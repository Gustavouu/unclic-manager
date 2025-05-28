# Guia de Instalação

## 1. PostgreSQL

### Windows
1. Baixe o instalador do PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante a instalação:
   - Mantenha a porta padrão (5432)
   - Defina uma senha para o usuário postgres
   - Mantenha o locale padrão
4. Após a instalação:
   - Adicione o diretório bin do PostgreSQL ao PATH do sistema
   - O caminho padrão é: `C:\Program Files\PostgreSQL\[versão]\bin`

### Verificação da Instalação
1. Abra um novo PowerShell
2. Execute:
   ```powershell
   psql --version
   ```
3. Se o comando for reconhecido, a instalação foi bem-sucedida

## 2. Configuração do Ambiente

### Variáveis de Ambiente
1. Configure as seguintes variáveis:
   ```powershell
   $env:SUPABASE_PROJECT_ID = "seu-projeto-staging"
   $env:SUPABASE_DB_URL = "postgresql://postgres:[YOUR-PASSWORD]@db.seu-projeto-staging.supabase.co:5432/postgres"
   ```

### Diretórios
1. Execute o script de configuração:
   ```powershell
   .\scripts\setup_environment.ps1
   ```
2. Verifique se os diretórios foram criados:
   - logs/
   - backups/
   - reports/

## 3. Teste de Conexão

### Banco de Dados
1. Execute:
   ```powershell
   psql $env:SUPABASE_DB_URL -c "SELECT version();"
   ```
2. Se retornar a versão do PostgreSQL, a conexão está funcionando

### Scripts de Migração
1. Verifique se todos os arquivos existem:
   - supabase/migrations/20240321000000_standardize_naming.sql
   - supabase/migrations/20240321000001_verify_migration.sql
   - supabase/migrations/20240321000002_rollback.sql
   - scripts/test_migration.ps1

## 4. Próximos Passos

1. Após a instalação e configuração:
   - Execute o script de teste em staging
   - Revise os logs e métricas
   - Verifique a conectividade com o banco

2. Se encontrar problemas:
   - Verifique as credenciais do banco
   - Confirme se o PostgreSQL está no PATH
   - Verifique os logs de erro

## 5. Suporte

Se precisar de ajuda:
1. Verifique a documentação do PostgreSQL
2. Consulte os logs de erro
3. Entre em contato com a equipe de suporte 