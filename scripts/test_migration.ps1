# Script para testar a migração em ambiente de staging

# Configurações
$env:SUPABASE_PROJECT_ID = "seu-projeto-staging"
$env:SUPABASE_DB_URL = "postgresql://postgres:[YOUR-PASSWORD]@db.seu-projeto-staging.supabase.co:5432/postgres"
$logFile = "migration_test_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

# Função para logging
function Write-Log {
    param (
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

# Função para medir tempo de execução
function Measure-ExecutionTime {
    param (
        [scriptblock]$ScriptBlock,
        [string]$OperationName
    )
    $startTime = Get-Date
    try {
        & $ScriptBlock
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        Write-Log "Operação '$OperationName' concluída em $duration segundos"
        return $duration
    }
    catch {
        Write-Log "Erro na operação '$OperationName': $_" -Level "ERROR"
        throw
    }
}

# Função para executar comandos SQL
function Execute-SQL {
    param (
        [string]$sqlFile,
        [string]$operationName
    )
    
    Write-Log "Iniciando execução de $sqlFile..."
    $duration = Measure-ExecutionTime -ScriptBlock {
        psql $env:SUPABASE_DB_URL -f $sqlFile
    } -OperationName $operationName

    if ($LASTEXITCODE -ne 0) {
        Write-Log "Erro ao executar $sqlFile" -Level "ERROR"
        exit 1
    }
}

# Iniciar teste
Write-Log "Iniciando teste de migração..."

# Backup do banco de dados
Write-Log "Criando backup do banco de dados..."
$backupDuration = Measure-ExecutionTime -ScriptBlock {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "backup_staging_$timestamp.sql"
    pg_dump $env:SUPABASE_DB_URL -f $backupFile
} -OperationName "Backup do banco de dados"

if ($LASTEXITCODE -ne 0) {
    Write-Log "Erro ao criar backup" -Level "ERROR"
    exit 1
}

# Executar migração
Write-Log "Executando migração..."
Execute-SQL "supabase/migrations/20240321000000_standardize_naming.sql" "Migração principal"

# Verificar migração
Write-Log "Verificando migração..."
Execute-SQL "supabase/migrations/20240321000001_verify_migration.sql" "Verificação da migração"

# Testar funcionalidades básicas
Write-Log "Testando funcionalidades básicas..."

# Teste 1: Criar um novo negócio
$testBusiness = @"
INSERT INTO businesses (name, owner_id) 
VALUES ('Test Business', '00000000-0000-0000-0000-000000000000')
RETURNING id;
"@
$businessId = Measure-ExecutionTime -ScriptBlock {
    psql $env:SUPABASE_DB_URL -t -c $testBusiness
} -OperationName "Criar negócio de teste"

# Teste 2: Criar um novo usuário
$testUser = @"
INSERT INTO users (email, tenant_id) 
VALUES ('test@example.com', '$businessId')
RETURNING id;
"@
$userId = Measure-ExecutionTime -ScriptBlock {
    psql $env:SUPABASE_DB_URL -t -c $testUser
} -OperationName "Criar usuário de teste"

# Teste 3: Criar um novo serviço
$testService = @"
INSERT INTO services (name, tenant_id) 
VALUES ('Test Service', '$businessId')
RETURNING id;
"@
$serviceId = Measure-ExecutionTime -ScriptBlock {
    psql $env:SUPABASE_DB_URL -t -c $testService
} -OperationName "Criar serviço de teste"

# Teste 4: Criar um novo agendamento
$testAppointment = @"
INSERT INTO appointments (user_id, service_id, tenant_id, scheduled_at) 
VALUES ('$userId', '$serviceId', '$businessId', NOW())
RETURNING id;
"@
$appointmentId = Measure-ExecutionTime -ScriptBlock {
    psql $env:SUPABASE_DB_URL -t -c $testAppointment
} -OperationName "Criar agendamento de teste"

# Verificar se os dados foram criados corretamente
Write-Log "Verificando dados de teste..."
$verifyData = @"
SELECT 
    (SELECT COUNT(*) FROM businesses WHERE id = '$businessId') as business_count,
    (SELECT COUNT(*) FROM users WHERE id = '$userId') as user_count,
    (SELECT COUNT(*) FROM services WHERE id = '$serviceId') as service_count,
    (SELECT COUNT(*) FROM appointments WHERE id = '$appointmentId') as appointment_count;
"@
$verificationResult = Measure-ExecutionTime -ScriptBlock {
    psql $env:SUPABASE_DB_URL -t -c $verifyData
} -OperationName "Verificação de dados"

# Limpar dados de teste
Write-Log "Limpando dados de teste..."
$cleanup = @"
DELETE FROM appointments WHERE id = '$appointmentId';
DELETE FROM services WHERE id = '$serviceId';
DELETE FROM users WHERE id = '$userId';
DELETE FROM businesses WHERE id = '$businessId';
"@
Measure-ExecutionTime -ScriptBlock {
    psql $env:SUPABASE_DB_URL -c $cleanup
} -OperationName "Limpeza de dados de teste"

# Gerar relatório de performance
$report = @"
Relatório de Performance da Migração
===================================
Backup do banco de dados: $backupDuration segundos
Criação de negócio: $($businessId) segundos
Criação de usuário: $($userId) segundos
Criação de serviço: $($serviceId) segundos
Criação de agendamento: $($appointmentId) segundos
Verificação de dados: $($verificationResult) segundos
"@

Write-Log $report
Write-Log "Testes concluídos com sucesso!"

# Salvar relatório em arquivo
$reportFile = "migration_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
Set-Content -Path $reportFile -Value $report 