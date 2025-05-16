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

# Verificar se o diretório de backup existe
$backupDir = "backups"
if (-not (Test-Path $backupDir)) {
    Write-Error "Diretório de backup não encontrado."
}

# Listar arquivos de backup disponíveis
$backupFiles = Get-ChildItem -Path $backupDir -Filter "backup_*.sql" | Sort-Object LastWriteTime -Descending
if ($backupFiles.Count -eq 0) {
    Write-Error "Nenhum arquivo de backup encontrado."
}

Write-Log "Arquivos de backup disponíveis:"
for ($i = 0; $i -lt $backupFiles.Count; $i++) {
    Write-Log "$($i + 1). $($backupFiles[$i].Name) ($($backupFiles[$i].LastWriteTime))"
}

# Solicitar seleção do arquivo de backup
$selection = Read-Host "`nSelecione o número do arquivo de backup para restaurar"
$index = [int]$selection - 1
if ($index -lt 0 -or $index -ge $backupFiles.Count) {
    Write-Error "Seleção inválida."
}

$backupFile = $backupFiles[$index].FullName

# Confirmar restauração
Write-Warning "`nATENÇÃO: Esta operação irá sobrescrever todos os dados atuais do banco de dados."
Write-Warning "Certifique-se de que você realmente deseja restaurar o backup."
$confirmation = Read-Host "Digite 'RESTORE' para confirmar a restauração"
if ($confirmation -ne "RESTORE") {
    Write-Error "Operação cancelada pelo usuário."
}

# Restaurar o banco de dados
Write-Log "`nRestaurando banco de dados..."
psql -h $dbHost -U postgres -d postgres -f $backupFile

# Remover arquivo temporário
Remove-Item -Path $pgpassPath -Force

Write-Log "`nRestauração concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se todos os dados foram restaurados corretamente"
Write-Log "2. Verifique se todas as tabelas têm registros"
Write-Log "3. Verifique se todas as funções e triggers estão funcionando"
Write-Log "4. Verifique se todas as políticas RLS estão corretas"
Write-Log "5. Execute o script de verificação do banco de dados para confirmar a integridade" 