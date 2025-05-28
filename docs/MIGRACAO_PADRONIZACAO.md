# Documentação da Migração de Padronização

## Visão Geral
Este documento descreve o processo de migração para padronizar as nomenclaturas do banco de dados, centralizar o enriquecimento do usuário autenticado e garantir cobertura de testes automatizados e políticas de RLS.

## Objetivos
- Padronizar nomenclaturas para inglês
- Centralizar o enriquecimento do usuário autenticado
- Garantir cobertura de testes automatizados
- Implementar políticas de RLS consistentes

## Arquivos de Migração

### 1. Migração Principal (`20240321000000_standardize_naming.sql`)
- Renomeia tabelas para inglês
- Padroniza colunas para usar `tenant_id`
- Atualiza constraints e índices
- Implementa triggers e funções
- Atualiza políticas de RLS

### 2. Verificação (`20240321000001_verify_migration.sql`)
- Verifica tabelas renomeadas
- Valida colunas e constraints
- Confirma índices e políticas
- Verifica triggers

### 3. Rollback (`20240321000002_rollback.sql`)
- Reverte todas as alterações em caso de falha
- Restaura nomenclaturas originais
- Remove índices adicionados
- Restaura políticas de RLS

## Scripts de Teste

### Teste de Migração (`test_migration.ps1`)
- Executa backup do banco
- Aplica migração
- Verifica alterações
- Testa funcionalidades básicas
- Gera relatório de performance

## Processo de Execução

### 1. Preparação
1. Fazer backup do banco de dados
2. Verificar espaço em disco
3. Notificar equipe sobre a manutenção

### 2. Execução em Staging
1. Executar script de teste
2. Analisar logs e métricas
3. Verificar funcionalidades
4. Validar performance

### 3. Execução em Produção
1. Agendar janela de manutenção
2. Executar backup
3. Aplicar migração
4. Verificar alterações
5. Monitorar performance

## Métricas de Performance

### Tempos Esperados
- Backup: ~5-10 minutos
- Migração: ~2-3 minutos
- Verificação: ~1 minuto
- Testes: ~2-3 minutos

### Indicadores de Sucesso
- Tempo de resposta das queries < 100ms
- Sem erros nas políticas de RLS
- Índices funcionando corretamente
- Dados consistentes após migração

## Rollback

### Gatilhos para Rollback
- Erros críticos durante migração
- Problemas de performance
- Inconsistências nos dados
- Falhas nas políticas de RLS

### Processo de Rollback
1. Executar script de rollback
2. Verificar restauração
3. Validar funcionalidades
4. Confirmar consistência

## Monitoramento

### Métricas a Monitorar
- Tempo de resposta das queries
- Uso de CPU e memória
- Tamanho do banco de dados
- Número de conexões ativas

### Alertas
- Erros nas queries
- Tempo de resposta alto
- Falhas nas políticas
- Inconsistências nos dados

## Checklist de Verificação

### Pré-Migração
- [ ] Backup realizado
- [ ] Espaço em disco suficiente
- [ ] Equipe notificada
- [ ] Ambiente de staging testado

### Durante Migração
- [ ] Backup verificado
- [ ] Migração aplicada
- [ ] Verificações executadas
- [ ] Testes realizados

### Pós-Migração
- [ ] Dados consistentes
- [ ] Performance adequada
- [ ] Políticas funcionando
- [ ] Logs analisados

## Suporte

### Contatos
- DBA: [Nome e contato]
- DevOps: [Nome e contato]
- Desenvolvimento: [Nome e contato]

### Procedimentos de Emergência
1. Identificar problema
2. Avaliar impacto
3. Decidir sobre rollback
4. Executar procedimentos necessários

## Histórico de Alterações

| Data | Versão | Descrição | Autor |
|------|---------|-----------|--------|
| 2024-03-21 | 1.0 | Versão inicial | [Autor] |

## Notas Adicionais
- Manter backup por 7 dias
- Monitorar logs por 24h após migração
- Realizar testes de carga após 24h
- Agendar revisão após 7 dias 