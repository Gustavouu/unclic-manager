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

# Executar o script SQL
Write-Log "Executando script SQL..."
$sqlContent = Get-Content -Path "scripts/update-database.sql" -Raw
$sqlContent | psql -h $dbHost -U postgres -d postgres

# Remover arquivo temporário
Remove-Item -Path $pgpassPath -Force

Write-Log "Script SQL executado com sucesso!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se todas as tabelas foram criadas corretamente"
Write-Log "2. Verifique se todas as políticas RLS foram criadas corretamente"
Write-Log "3. Verifique se todos os índices foram criados corretamente"
Write-Log "4. Verifique se todas as funções e triggers foram criados corretamente" 