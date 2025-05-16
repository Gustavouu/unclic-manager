# Scripts de Migração do Banco de Dados

Este diretório contém scripts para gerenciar a migração do banco de dados do UnCliC Manager.

## Pré-requisitos

- PowerShell 5.1 ou superior
- PostgreSQL 12 ou superior
- Arquivo `.env` com as seguintes variáveis:
  - `VITE_SUPABASE_URL`: URL do projeto Supabase
  - `VITE_SUPABASE_ANON_KEY`: Chave anônima do projeto Supabase

## Scripts Disponíveis

### 1. Backup do Banco de Dados (`backup-database.ps1`)

Faz um backup completo do banco de dados antes da migração.

```powershell
.\scripts\backup-database.ps1
```

O backup será salvo no diretório `backups` com o nome `backup_YYYYMMDD_HHMMSS.sql`.

### 2. Restauração do Banco de Dados (`restore-database.ps1`)

Restaura o banco de dados a partir de um backup.

```powershell
.\scripts\restore-database.ps1
```

O script irá:
1. Listar todos os backups disponíveis
2. Solicitar a seleção do backup a ser restaurado
3. Confirmar a restauração
4. Restaurar o banco de dados
5. Verificar a integridade da restauração

### 3. Verificação do Banco de Dados (`verify-database.ps1`)

Verifica a integridade do banco de dados após a migração.

```powershell
.\scripts\verify-database.ps1
```

O script verifica:
1. Existência e contagem de registros em todas as tabelas
2. Índices
3. Políticas RLS
4. Funções
5. Triggers
6. Chaves estrangeiras

### 4. Migração do Banco de Dados (`migrate-database.ps1`)

Executa a migração completa do banco de dados.

```powershell
.\scripts\migrate-database.ps1
```

O script irá:
1. Fazer backup do banco de dados
2. Executar o script SQL de migração
3. Verificar a integridade do banco de dados
4. Restaurar o backup em caso de problemas

## Processo de Migração

1. **Preparação**
   - Verifique se todos os pré-requisitos estão atendidos
   - Certifique-se de que o arquivo `.env` está configurado corretamente
   - Faça um backup manual do banco de dados (opcional)

2. **Execução**
   - Execute o script de migração:
     ```powershell
     .\scripts\migrate-database.ps1
     ```
   - Confirme a migração digitando `MIGRATE`
   - Aguarde a conclusão do processo

3. **Verificação**
   - Verifique se todas as tabelas foram criadas corretamente
   - Verifique se todas as políticas RLS foram criadas corretamente
   - Verifique se todos os índices foram criados corretamente
   - Verifique se todas as funções e triggers foram criados corretamente
   - Execute o script de verificação para confirmar a integridade
   - Teste todas as funcionalidades da aplicação

4. **Em Caso de Problemas**
   - Execute o script de restauração:
     ```powershell
     .\scripts\restore-database.ps1
     ```
   - Selecione o backup mais recente
   - Confirme a restauração digitando `RESTORE`
   - Aguarde a conclusão do processo
   - Verifique a integridade do banco de dados

## Estrutura do Banco de Dados

O banco de dados é composto pelas seguintes tabelas:

- `businesses`: Informações das empresas
- `business_settings`: Configurações das empresas
- `users`: Usuários do sistema
- `clients`: Clientes das empresas
- `services`: Serviços oferecidos
- `professionals`: Profissionais
- `professional_schedules`: Horários dos profissionais
- `appointments`: Agendamentos

Cada tabela possui:
- Índices otimizados
- Políticas RLS para controle de acesso
- Triggers para atualização automática de timestamps
- Chaves estrangeiras para integridade referencial

## Segurança

- Todas as operações são executadas com autenticação segura
- As credenciais são armazenadas temporariamente em arquivo seguro
- O arquivo de credenciais é removido após a execução
- Confirmação é necessária para operações destrutivas
- Backups são mantidos para recuperação em caso de problemas

## Suporte

Em caso de problemas:
1. Verifique os logs de erro
2. Consulte a documentação do Supabase
3. Verifique a integridade do banco de dados
4. Restaure o backup mais recente se necessário
5. Entre em contato com a equipe de suporte 