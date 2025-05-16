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

# Verificar tabelas
Write-Log "Verificando tabelas..."
$tables = @(
    "businesses",
    "business_settings",
    "users",
    "clients",
    "services",
    "professionals",
    "professional_schedules",
    "appointments"
)

foreach ($table in $tables) {
    $count = Invoke-SqlQuery "SELECT COUNT(*) FROM $table"
    Write-Log "Tabela $table: $count registros"
}

# Verificar índices
Write-Log "`nVerificando índices..."
$indexes = Invoke-SqlQuery @"
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;
"@
Write-Log $indexes

# Verificar políticas RLS
Write-Log "`nVerificando políticas RLS..."
$policies = Invoke-SqlQuery @"
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    policyname;
"@
Write-Log $policies

# Verificar funções
Write-Log "`nVerificando funções..."
$functions = Invoke-SqlQuery @"
SELECT
    n.nspname as schema,
    p.proname as function,
    pg_get_function_arguments(p.oid) as arguments,
    t.typname as return_type
FROM
    pg_proc p
    LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
    LEFT JOIN pg_type t ON p.prorettype = t.oid
WHERE
    n.nspname = 'public'
ORDER BY
    p.proname;
"@
Write-Log $functions

# Verificar triggers
Write-Log "`nVerificando triggers..."
$triggers = Invoke-SqlQuery @"
SELECT
    tgname as trigger_name,
    relname as table_name,
    pg_get_triggerdef(oid) as trigger_definition
FROM
    pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
WHERE
    NOT t.tgisinternal
ORDER BY
    relname,
    tgname;
"@
Write-Log $triggers

# Verificar chaves estrangeiras
Write-Log "`nVerificando chaves estrangeiras..."
$foreignKeys = Invoke-SqlQuery @"
SELECT
    tc.table_schema,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY
    tc.table_name,
    tc.constraint_name;
"@
Write-Log $foreignKeys

# Remover arquivo temporário
Remove-Item -Path $pgpassPath -Force

Write-Log "`nVerificação concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se todas as tabelas têm registros"
Write-Log "2. Verifique se todos os índices foram criados corretamente"
Write-Log "3. Verifique se todas as políticas RLS estão corretas"
Write-Log "4. Verifique se todas as funções e triggers estão funcionando"
Write-Log "5. Verifique se todas as chaves estrangeiras estão corretas" 