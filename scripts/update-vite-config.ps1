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

# Atualizar configuração do Vite
Write-Log "Atualizando configuração do Vite..."

# vite.config.ts
$viteConfigContent = @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
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
    "vite.config.ts" = $viteConfigContent
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Force
    Write-Log "Arquivo atualizado: $($file.Key)"
}

Write-Log "`nAtualização concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se a configuração do Vite foi atualizada corretamente"
Write-Log "2. Verifique se o alias '@' está funcionando corretamente"
Write-Log "3. Verifique se o servidor de desenvolvimento está funcionando corretamente"
Write-Log "4. Verifique se o build está funcionando corretamente"
Write-Log "5. Em caso de problemas, restaure o backup em: $backupDir" 