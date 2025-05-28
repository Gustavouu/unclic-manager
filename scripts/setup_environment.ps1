# Script de configuração do ambiente

# Verificar e instalar dependências
Write-Host "Verificando dependências..."

# Verificar PostgreSQL
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgInstalled) {
    Write-Host "PostgreSQL não encontrado. Por favor, instale o PostgreSQL e adicione ao PATH."
    Write-Host "Download: https://www.postgresql.org/download/windows/"
    exit 1
}

# Configurar variáveis de ambiente
$env:SUPABASE_PROJECT_ID = "seu-projeto-staging"
$env:SUPABASE_DB_URL = "postgresql://postgres:[YOUR-PASSWORD]@db.seu-projeto-staging.supabase.co:5432/postgres"

# Criar diretórios necessários
$directories = @(
    "logs",
    "backups",
    "reports"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir
        Write-Host "Diretório criado: $dir"
    }
}

# Verificar conectividade
Write-Host "Testando conectividade com o banco de dados..."
try {
    $result = psql $env:SUPABASE_DB_URL -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Conexão com o banco de dados estabelecida com sucesso!"
    } else {
        Write-Host "Erro ao conectar com o banco de dados. Verifique as credenciais."
        exit 1
    }
} catch {
    Write-Host "Erro ao testar conectividade: $_"
    exit 1
}

# Verificar espaço em disco
$drive = Get-PSDrive C
$freeSpaceGB = [math]::Round($drive.Free / 1GB, 2)
Write-Host "Espaço livre em disco: $freeSpaceGB GB"

if ($freeSpaceGB -lt 10) {
    Write-Host "AVISO: Espaço em disco baixo. Recomendado ter pelo menos 10GB livres."
}

# Verificar recursos do sistema
$cpu = Get-CimInstance Win32_Processor | Select-Object -ExpandProperty LoadPercentage
$memory = Get-CimInstance Win32_OperatingSystem | Select-Object -ExpandProperty FreePhysicalMemory
$memoryGB = [math]::Round($memory / 1MB, 2)

Write-Host "Uso de CPU: $cpu%"
Write-Host "Memória livre: $memoryGB GB"

# Verificar scripts de migração
$migrationFiles = @(
    "supabase/migrations/20240321000000_standardize_naming.sql",
    "supabase/migrations/20240321000001_verify_migration.sql",
    "supabase/migrations/20240321000002_rollback.sql",
    "scripts/test_migration.ps1"
)

foreach ($file in $migrationFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "ERRO: Arquivo não encontrado: $file"
        exit 1
    }
    Write-Host "Arquivo encontrado: $file"
}

Write-Host "`nConfiguração do ambiente concluída!"
Write-Host "Próximos passos:"
Write-Host "1. Verifique as credenciais do banco de dados"
Write-Host "2. Execute o script de teste em staging"
Write-Host "3. Revise os logs e métricas" 