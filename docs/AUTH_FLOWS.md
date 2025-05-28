# Fluxos de Autenticação e Autorização

## Visão Geral

Este documento descreve os fluxos de autenticação e autorização implementados no sistema, garantindo que o acesso aos recursos seja seguro e controlado.

## Fluxo de Login

1. **Login**: O usuário fornece e-mail e senha. O sistema valida as credenciais e, se válidas, retorna um token de acesso e um token de refresh.
2. **Armazenamento de Sessão**: O token de acesso é armazenado localmente para uso em requisições subsequentes.
3. **Expiração de Sessão**: O token de acesso expira após um período (ex: 1 hora). O token de refresh pode ser usado para obter um novo token de acesso.

## Fluxo de Recuperação de Senha

1. **Solicitação de Redefinição**: O usuário solicita a redefinição de senha fornecendo seu e-mail. O sistema envia um e-mail com um link de redefinição.
2. **Redefinição de Senha**: O usuário acessa o link, fornece uma nova senha e o sistema atualiza a senha.

## Fluxo de Alteração de Senha

1. **Alteração de Senha**: O usuário, autenticado, solicita a alteração de senha fornecendo a senha atual e a nova senha.
2. **Validação e Atualização**: O sistema valida a senha atual e, se correta, atualiza para a nova senha.

## Fluxo de Autorização

1. **Verificação de Permissões**: Cada rota ou recurso protegido verifica se o usuário possui as permissões necessárias.
2. **Redirecionamento**: Se o usuário não possui as permissões, é redirecionado para uma página de erro (ex: 403 Forbidden).

## Integrações Externas

- **E-mail de Recuperação**: Envio de e-mail com link de redefinição de senha.
- **Notificações**: Envio de notificações para alterações de senha e outras ações críticas.

## Testes

Os fluxos de autenticação e autorização são cobertos por testes de integração, garantindo que o sistema responda corretamente a cenários de erro, concorrência e integrações externas. 