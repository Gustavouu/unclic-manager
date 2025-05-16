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

# Criar diretório de backup se não existir
$backupDir = "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Gerar nome do arquivo de backup com timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$backupDir/backup_$timestamp.sql"

# Fazer backup do banco de dados
Write-Log "Fazendo backup do banco de dados..."
pg_dump -h $dbHost -U postgres -d postgres -F p -f $backupFile

# Verificar se o backup foi criado com sucesso
if (-not (Test-Path $backupFile)) {
    Write-Error "Falha ao criar o arquivo de backup."
}

# Verificar o tamanho do arquivo de backup
$backupSize = (Get-Item $backupFile).Length
Write-Log "Backup criado com sucesso: $backupFile ($backupSize bytes)"

# Remover arquivo temporário
Remove-Item -Path $pgpassPath -Force

Write-Log "`nBackup concluído!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se o arquivo de backup foi criado corretamente"
Write-Log "2. Verifique se o tamanho do arquivo de backup é razoável"
Write-Log "3. Mantenha o arquivo de backup em um local seguro"
Write-Log "4. Não execute a migração sem ter um backup válido" 