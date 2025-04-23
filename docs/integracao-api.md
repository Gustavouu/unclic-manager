# Integração de APIs no UnCliC Manager

Este documento detalha as integrações de APIs no UnCliC Manager, explicando como o sistema se comunica com serviços externos e como implementar novas integrações.

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura de Integração](#arquitetura-de-integração)
- [APIs Integradas](#apis-integradas)
  - [Pagamentos](#pagamentos)
  - [Marketing](#marketing)
  - [Comunicação](#comunicação)
  - [Calendário](#calendário)
- [Implementação de Integração](#implementação-de-integração)
- [Segurança](#segurança)
- [Gestão de Tokens e Chaves](#gestão-de-tokens-e-chaves)
- [Webhooks](#webhooks)
- [Tratamento de Erros](#tratamento-de-erros)
- [Métricas e Monitoramento](#métricas-e-monitoramento)
- [Melhores Práticas](#melhores-práticas)
- [Exemplos de Implementação](#exemplos-de-implementação)

## Visão Geral

O UnCliC Manager foi projetado para integrar-se com diferentes serviços externos através de APIs, ampliando suas funcionalidades nativas e permitindo automações e processamentos complexos sem necessidade de implementação própria.

Nossa abordagem de integração segue os princípios:

1. **Agnóstico em relação a provedores**: Interfaces abstratas que permitem troca de provedores
2. **Isolamento de responsabilidades**: Cada integração é encapsulada e independente
3. **Segurança por design**: Tokens e credenciais são armazenados de forma segura
4. **Resiliência**: Implementação de retry, circuit breaking e fallbacks
5. **Tenancy**: Cada tenant (negócio) tem suas próprias integrações e configurações

## Arquitetura de Integração

O sistema implementa uma arquitetura de adaptadores para integrações externas:

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│                │     │                │     │                │
│   Interface    │────▶│   Adaptador    │────▶│     API        │
│   Abstrata     │     │                │     │    Externa     │
│                │     │                │     │                │
└────────────────┘     └────────────────┘     └────────────────┘
```

### Componentes da Arquitetura

1. **Interface Abstrata**: Define métodos e parâmetros necessários para uma categoria de integração
2. **Adaptador**: Implementa a interface para um provedor específico
3. **Factory de Integração**: Cria a instância correta do adaptador com base nas configurações do tenant
4. **Gerenciador de Cache**: Armazena respostas para reduzir chamadas a APIs externas
5. **Handler de Erros**: Processa e registra erros de integração de forma consistente

## APIs Integradas

### Pagamentos

Integrações com gateways de pagamento para processamento de transações.

#### Provedores Suportados

- **Mercado Pago**: Processamento de pagamentos com cartão e Pix
- **PagSeguro**: Pagamentos com múltiplos métodos
- **Stripe**: Processamento internacional (em implementação)

#### Funcionalidades

- Criação de transações
- Verificação de status
- Estornos
- Assinaturas recorrentes

#### Exemplo de Implementação:

```typescript
// Interface abstrata de pagamentos
export interface PaymentProvider {
  createTransaction(data: CreateTransactionDTO): Promise<Transaction>;
  getTransactionStatus(id: string): Promise<TransactionStatus>;
  refundTransaction(id: string, amount?: number): Promise<RefundResult>;
  createSubscription(data: SubscriptionDTO): Promise<Subscription>;
}

// Adaptador para Mercado Pago
export class MercadoPagoAdapter implements PaymentProvider {
  private client: MercadoPagoClient;
  
  constructor(config: MercadoPagoConfig) {
    this.client = new MercadoPagoClient(config.accessToken);
  }
  
  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    try {
      const mpData = this.mapToMercadoPagoFormat(data);
      const response = await this.client.payment.create(mpData);
      return this.mapFromMercadoPagoFormat(response);
    } catch (error) {
      throw new PaymentIntegrationError(
        'Failed to create transaction on Mercado Pago',
        error
      );
    }
  }
  
  // Outras implementações de métodos...
}

// Factory para criar o adaptador correto
export class PaymentProviderFactory {
  static create(tenant: Tenant): PaymentProvider {
    const { paymentProvider, config } = tenant.integrations.payment;
    
    switch (paymentProvider) {
      case 'mercado_pago':
        return new MercadoPagoAdapter(config as MercadoPagoConfig);
      case 'pagseguro':
        return new PagSeguroAdapter(config as PagSeguroConfig);
      case 'stripe':
        return new StripeAdapter(config as StripeConfig);
      default:
        throw new Error(`Payment provider ${paymentProvider} not supported`);
    }
  }
}
```

### Marketing

Integrações com ferramentas de marketing para automação de campanhas.

#### Provedores Suportados

- **Mailchimp**: Campanhas de email marketing
- **RD Station**: Automação de marketing
- **Google Analytics**: Análise de tráfego e comportamento

#### Funcionalidades

- Gerenciamento de contatos
- Envio de campanhas
- Segmentação de público
- Rastreamento de conversões

### Comunicação

Integrações para comunicação com clientes.

#### Provedores Suportados

- **Twilio**: SMS e comunicações por voz
- **WhatsApp Business API**: Comunicação via WhatsApp
- **SendGrid**: Envio de emails transacionais

#### Funcionalidades

- Envio de lembretes de agendamento
- Notificações de confirmação
- Comunicações automatizadas
- Templates personalizáveis

### Calendário

Integrações com serviços de calendário para sincronização de agendamentos.

#### Provedores Suportados

- **Google Calendar**: Sincronização com Google Calendar
- **Microsoft Outlook**: Integração com calendário do Outlook
- **Apple Calendar**: Sincronização com iCloud Calendar (via CalDAV)

#### Funcionalidades

- Sincronização bidirecional de eventos
- Verificação de disponibilidade
- Atualização automática de status

## Implementação de Integração

### Estrutura de Diretórios

```
src/
└── integrations/
    ├── types.ts                 # Tipos comuns para integrações
    ├── errors.ts                # Classes de erro personalizadas
    ├── factory.ts               # Factory principal de integrações
    ├── payment/
    │   ├── types.ts             # Tipos específicos de pagamento
    │   ├── provider.interface.ts # Interface do provedor
    │   ├── mercadopago.adapter.ts # Adaptador específico
    │   ├── pagseguro.adapter.ts
    │   └── index.ts
    ├── marketing/
    │   ├── types.ts
    │   ├── provider.interface.ts
    │   ├── mailchimp.adapter.ts
    │   └── index.ts
    └── communication/
        ├── types.ts
        ├── provider.interface.ts
        ├── twilio.adapter.ts
        └── index.ts
```

### Processo de Adição de Nova Integração

1. **Definir Interface**: Criar a interface abstrata para o tipo de integração
2. **Implementar Adaptador**: Criar adaptador para o provedor específico
3. **Atualizar Factory**: Incluir novo adaptador na factory correspondente
4. **Adicionar UI de Configuração**: Criar interface para configuração da integração
5. **Documentar API**: Incluir detalhes na documentação de desenvolvimento

## Segurança

### Proteção de Credenciais

As credenciais de APIs são armazenadas de forma segura:

1. **Criptografia**: Chaves e tokens são criptografados no banco de dados
2. **Isolamento por Tenant**: Cada negócio tem suas próprias credenciais isoladas
3. **Proteção via RLS**: Políticas que impedem acesso não autorizado

```sql
-- Tabela para armazenar integrações
CREATE TABLE public.integracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES public.negocios(id),
  tipo TEXT NOT NULL, -- 'payment', 'marketing', etc.
  provedor TEXT NOT NULL, -- 'mercadopago', 'mailchimp', etc.
  credenciais JSONB NOT NULL, -- Dados criptografados
  configuracao JSONB NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para criptografar credenciais
CREATE OR REPLACE FUNCTION crypto.encrypt_credentials(credentials JSONB)
RETURNS TEXT AS $$
  -- Implementação de criptografia simétrica
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar credenciais
CREATE OR REPLACE FUNCTION crypto.decrypt_credentials(encrypted_data TEXT)
RETURNS JSONB AS $$
  -- Implementação de descriptografia simétrica
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criptografar credenciais automaticamente
CREATE TRIGGER encrypt_credentials_trigger
BEFORE INSERT OR UPDATE ON public.integracoes
FOR EACH ROW EXECUTE FUNCTION crypto.encrypt_credentials_trigger();
```

## Gestão de Tokens e Chaves

### Armazenamento

- **Tokens Temporários**: Armazenados em Redis com TTL apropriado
- **Tokens de Longa Duração**: Criptografados no banco de dados
- **Refresh Tokens**: Armazenados separadamente com maior segurança

### Renovação

Implementamos um sistema automático de renovação de tokens:

```typescript
export class TokenManager {
  private static instance: TokenManager;
  private refreshQueue: Map<string, Promise<string>>;
  
  private constructor() {
    this.refreshQueue = new Map();
  }
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }
  
  async getValidToken(integration: Integration): Promise<string> {
    const { accessToken, expiresAt, refreshToken } = integration;
    
    // Verificar se o token está expirado ou próximo de expirar
    const isExpired = new Date(expiresAt) <= new Date(Date.now() + 5 * 60 * 1000);
    
    if (!isExpired) {
      return accessToken;
    }
    
    // Usar um token em renovação ou iniciar renovação
    const key = `${integration.type}:${integration.id}`;
    if (!this.refreshQueue.has(key)) {
      const refreshPromise = this.refreshAccessToken(integration);
      this.refreshQueue.set(key, refreshPromise);
      
      // Limpar a promessa da fila após conclusão
      refreshPromise.finally(() => {
        this.refreshQueue.delete(key);
      });
    }
    
    return this.refreshQueue.get(key)!;
  }
  
  private async refreshAccessToken(integration: Integration): Promise<string> {
    // Implementação específica para cada tipo de integração
    // ...
  }
}
```

## Webhooks

O sistema implementa endpoints para receber callbacks de serviços externos:

### Gerenciamento de Endpoints

- **Endpoints Dinâmicos**: Cada integração tem um endpoint único
- **Validação de Assinatura**: Verificação de autenticidade das chamadas
- **Rastreamento**: Logs detalhados de todas as chamadas recebidas

```typescript
// Exemplo de controller de webhooks para pagamentos
export class PaymentWebhookController {
  async handleWebhook(req: Request, res: Response) {
    try {
      const { provider } = req.params;
      const signature = req.headers['x-webhook-signature'];
      const payload = req.body;
      
      // Validar assinatura
      if (!this.isValidSignature(provider, signature, payload)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // Processar evento com base no provedor
      const processor = WebhookProcessorFactory.create(provider);
      await processor.processEvent(payload);
      
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      logger.error('Error processing webhook', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  private isValidSignature(provider: string, signature: string, payload: any): boolean {
    // Implementação específica por provedor
    // ...
  }
}
```

## Tratamento de Erros

### Estratégias de Resiliência

1. **Retry com Backoff Exponencial**: Para falhas temporárias
2. **Circuit Breaker**: Para prevenir cascata de falhas
3. **Fallback**: Alternativas quando a integração principal falha
4. **Dead Letter Queue**: Para processamento posterior de eventos falhos

```typescript
// Exemplo de serviço com retry e circuit breaker
export class ResilientIntegrationService {
  private circuitBreaker: CircuitBreaker;
  
  constructor(private integration: IntegrationProvider) {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000,
      fallback: this.handleFallback.bind(this)
    });
  }
  
  async executeWithResilience<T>(operation: () => Promise<T>): Promise<T> {
    return this.circuitBreaker.fire(async () => {
      return await retry(operation, {
        maxRetries: 3,
        backoff: {
          type: 'exponential',
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 10000
        },
        onRetry: (error, attempt) => {
          logger.warn(`Retry attempt ${attempt} after error`, error);
        }
      });
    });
  }
  
  private async handleFallback<T>(): Promise<T> {
    // Estratégia de fallback específica
    // ...
  }
}
```

## Métricas e Monitoramento

### Métricas Coletadas

- **Taxa de Sucesso**: Porcentagem de chamadas bem-sucedidas
- **Tempo de Resposta**: Latência das chamadas a APIs
- **Volume de Chamadas**: Número de chamadas por período
- **Taxa de Erro**: Frequência e tipos de erros

### Implementação do Monitoramento

```typescript
// Cliente HTTP com métricas integradas
export class MetricHttpClient {
  constructor(
    private client: HttpClient,
    private metricsCollector: MetricsCollector
  ) {}
  
  async request<T>(config: RequestConfig): Promise<T> {
    const startTime = Date.now();
    const { integration, method, endpoint } = config;
    
    try {
      const result = await this.client.request<T>(config);
      
      // Registrar sucesso
      this.metricsCollector.recordSuccess({
        integration,
        method,
        endpoint,
        duration: Date.now() - startTime
      });
      
      return result;
    } catch (error) {
      // Registrar falha
      this.metricsCollector.recordFailure({
        integration,
        method,
        endpoint,
        duration: Date.now() - startTime,
        error: error.message
      });
      
      throw error;
    }
  }
}
```

## Melhores Práticas

1. **Camada de Abstração**: Nunca use APIs externas diretamente no código de negócio
2. **Timeouts Adequados**: Configure timeouts apropriados para cada tipo de operação
3. **Validação Local**: Valide dados localmente antes de enviar para APIs externas
4. **Logs Detalhados**: Mantenha logs detalhados de todas as chamadas e respostas
5. **Testes de Integração**: Crie testes que simulem as APIs externas
6. **Rate Limiting**: Implemente controle de taxa para evitar limites de APIs
7. **Versionamento de APIs**: Gerencie mudanças em APIs externas com adaptadores por versão

## Exemplos de Implementação

### Cliente de Integração

```typescript
// src/integrations/http-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TokenManager } from './token-manager';

export class IntegrationHttpClient {
  private axiosInstance: AxiosInstance;
  private tokenManager: TokenManager;
  
  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
    this.tokenManager = TokenManager.getInstance();
    
    // Interceptors para inclusão automática de tokens
    this.axiosInstance.interceptors.request.use(async (config) => {
      const integration = config.integration;
      
      if (integration && integration.requiresAuth) {
        const token = await this.tokenManager.getValidToken(integration);
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    });
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }
  
  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }
  
  // Outros métodos HTTP...
}
```

### Componente de Interface para Conectar Serviço Externo

```tsx
// src/components/integrations/PaymentIntegrationForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

// Schema de validação para integração do Mercado Pago
const mercadoPagoSchema = z.object({
  accessToken: z.string().min(1, 'Token de acesso é obrigatório'),
  publicKey: z.string().min(1, 'Chave pública é obrigatória'),
  webhookSecret: z.string().optional()
});

export function MercadoPagoIntegrationForm({ idNegocio, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(mercadoPagoSchema),
    defaultValues: {
      accessToken: '',
      publicKey: '',
      webhookSecret: ''
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Salvar configuração de integração
      const { error } = await supabase
        .from('integracoes')
        .insert({
          id_negocio: idNegocio,
          tipo: 'payment',
          provedor: 'mercadopago',
          credenciais: {
            accessToken: data.accessToken,
            publicKey: data.publicKey,
            webhookSecret: data.webhookSecret || '',
          },
          configuracao: {
            environment: 'production',
            notificationUrl: `${window.location.origin}/api/webhooks/payment/mercadopago/${idNegocio}`
          }
        });
      
      if (error) throw error;
      
      toast({
        title: 'Integração configurada',
        description: 'O Mercado Pago foi conectado com sucesso.',
        variant: 'success'
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao configurar integração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível conectar ao Mercado Pago.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar Mercado Pago</CardTitle>
        <CardDescription>
          Configure a integração com o Mercado Pago para processar pagamentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token de Acesso</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="APP_USR-..."
                      type="password"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave Pública</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="APP_USR-..."
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="webhookSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segredo do Webhook (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Segredo para validar webhooks"
                      type="password"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Conectando...' : 'Conectar Mercado Pago'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 