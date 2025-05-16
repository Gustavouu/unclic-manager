#!/bin/bash

# Script de Migração do Banco de Dados
# Este script executa a migração do banco de dados de forma segura

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${2:-$GREEN}$1${NC}"
}

# Função para erro
error() {
    log "$1" "$RED"
    exit 1
}

# Função para aviso
warn() {
    log "$1" "$YELLOW"
}

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    error "Supabase CLI não está instalado. Por favor, instale-o primeiro."
fi

# Verificar se está logado no Supabase
if ! supabase status &> /dev/null; then
    error "Não está logado no Supabase. Por favor, faça login primeiro."
fi

# Criar backup do banco
log "Criando backup do banco de dados..."
if ! supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql; then
    error "Falha ao criar backup do banco de dados."
fi

# Executar migração
log "Executando migração..."
if ! supabase db execute --file scripts/database/migration.sql; then
    warn "Falha na migração. Restaurando backup..."
    if ! supabase db reset; then
        error "Falha ao restaurar backup. Por favor, restaure manualmente o backup mais recente."
    fi
    error "Migração falhou. O banco foi restaurado para o estado anterior."
fi

# Verificar integridade
log "Verificando integridade do banco..."

# Verificar se todas as tabelas foram criadas
TABLES=(
    "users"
    "businesses"
    "clients"
    "services"
    "professionals"
    "professional_schedules"
    "appointments"
    "business_settings"
)

for table in "${TABLES[@]}"; do
    if ! supabase db execute --command "SELECT 1 FROM $table LIMIT 1" &> /dev/null; then
        warn "Tabela $table não foi criada corretamente."
    fi
done

# Verificar se as políticas RLS foram criadas
log "Verificando políticas RLS..."
if ! supabase db execute --command "SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public'" | grep -q "8"; then
    warn "Nem todas as políticas RLS foram criadas."
fi

# Verificar se os índices foram criados
log "Verificando índices..."
if ! supabase db execute --command "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'" | grep -q "14"; then
    warn "Nem todos os índices foram criados."
fi

# Executar verificação detalhada
log "Executando verificação detalhada..."
if ! supabase db execute --file scripts/database/verify_migration.sql > migration_verification.log; then
    warn "Falha ao executar verificação detalhada."
fi

# Verificar resultados da verificação
if grep -q "invalid_records" migration_verification.log && grep -q "[1-9]" migration_verification.log; then
    warn "Foram encontrados registros inválidos. Verifique o arquivo migration_verification.log"
fi

log "Migração concluída com sucesso!"
log "Recomendações:"
log "1. Verifique os logs do Supabase para mais detalhes"
log "2. Teste as funcionalidades principais da aplicação"
log "3. Verifique se os dados foram migrados corretamente"
log "4. Monitore o desempenho do banco nas próximas horas"
log "5. Revise o arquivo migration_verification.log para detalhes da verificação" 