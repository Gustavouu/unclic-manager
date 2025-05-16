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

# Criar diretório de backup se não existir
$backupDir = "backups/frontend_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Fazer backup dos arquivos
Write-Log "Fazendo backup dos arquivos..."
$directories = @(
    "src/services",
    "src/types",
    "src/lib"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Copy-Item -Path $dir -Destination "$backupDir/$dir" -Recurse -Force
    }
}

# Atualizar cliente Supabase
Write-Log "Atualizando cliente Supabase..."

# supabase.ts
$supabaseClientContent = @'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public'
    }
})
'@

# Criar diretórios se não existirem
$directories = @(
    "src/services",
    "src/types",
    "src/lib"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Atualizar arquivos
$files = @{
    "src/lib/supabase.ts" = $supabaseClientContent
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Force
    Write-Log "Arquivo atualizado: $($file.Key)"
}

Write-Log "`nAtualização concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se o cliente Supabase foi atualizado corretamente"
Write-Log "2. Verifique se as variáveis de ambiente estão configuradas corretamente"
Write-Log "3. Verifique se os tipos estão sendo usados corretamente"
Write-Log "4. Teste todas as funcionalidades da aplicação para garantir que tudo está funcionando corretamente"
Write-Log "5. Em caso de problemas, restaure o backup em: $backupDir" 