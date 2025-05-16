# Funções de log
function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "Green"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Log $Message "Red"
    exit 1
}

function Write-Warning {
    param([string]$Message)
    Write-Log $Message "Yellow"
}

# Verificar se está no diretório raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Error "Por favor, execute este script do diretório raiz do projeto."
}

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Error "Arquivo .env não encontrado. Por favor, crie um arquivo .env com as variáveis de ambiente necessárias."
}

# Carregar variáveis de ambiente
$envContent = Get-Content .env
$envContent | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        Set-Item -Path "env:$name" -Value $value
    }
}

# Verificar se as variáveis de ambiente necessárias estão definidas
if (-not $env:VITE_SUPABASE_URL -or -not $env:VITE_SUPABASE_ANON_KEY) {
    Write-Error "Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias."
}

# Extrair o host do banco de dados da URL do Supabase
$dbUrl = $env:VITE_SUPABASE_URL
$dbHost = $dbUrl -replace '^https?://', '' -replace '/.*$', ''

# Criar arquivo temporário com as credenciais
$pgpassPath = "$env:USERPROFILE\.pgpass"
$pgpassContent = "$dbHost:5432:postgres:postgres:$env:VITE_SUPABASE_ANON_KEY"
Set-Content -Path $pgpassPath -Value $pgpassContent -Force

# Função para executar consulta SQL
function Invoke-SqlQuery {
    param(
        [string]$Query
    )
    $result = $Query | psql -h $dbHost -U postgres -d postgres -t
    return $result
}

# Fazer backup do banco de dados
Write-Log "Fazendo backup do banco de dados..."
& "$PSScriptRoot\backup-database.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao fazer backup do banco de dados."
}

# Verificar se o script SQL existe
$sqlFile = "scripts/update-database.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Error "Arquivo SQL não encontrado: $sqlFile"
}

# Confirmar migração
Write-Warning "`nATENÇÃO: Esta operação irá modificar a estrutura do banco de dados."
Write-Warning "Certifique-se de que você realmente deseja executar a migração."
$confirmation = Read-Host "Digite 'MIGRATE' para confirmar a migração"
if ($confirmation -ne "MIGRATE") {
    Write-Error "Operação cancelada pelo usuário."
}

# Executar o script SQL
Write-Log "`nExecutando script SQL..."
$sqlContent = Get-Content -Path $sqlFile -Raw
$sqlContent | psql -h $dbHost -U postgres -d postgres

# Verificar a integridade do banco de dados
Write-Log "`nVerificando integridade do banco de dados..."
& "$PSScriptRoot\verify-database.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Foram encontrados problemas na verificação do banco de dados."
    Write-Warning "Deseja restaurar o backup?"
    $restoreConfirmation = Read-Host "Digite 'RESTORE' para restaurar o backup"
    if ($restoreConfirmation -eq "RESTORE") {
        & "$PSScriptRoot\restore-database.ps1"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Falha ao restaurar o backup."
        }
        Write-Error "Migração falhou. O banco de dados foi restaurado para o estado anterior."
    }
}

# Remover arquivo temporário
Remove-Item -Path $pgpassPath -Force

Write-Log "`nMigração concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se todas as tabelas foram criadas corretamente"
Write-Log "2. Verifique se todas as políticas RLS foram criadas corretamente"
Write-Log "3. Verifique se todos os índices foram criados corretamente"
Write-Log "4. Verifique se todas as funções e triggers foram criados corretamente"
Write-Log "5. Execute o script de verificação do banco de dados para confirmar a integridade"
Write-Log "6. Teste todas as funcionalidades da aplicação para garantir que tudo está funcionando corretamente" 