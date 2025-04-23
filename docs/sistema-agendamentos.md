# Sistema de Agendamentos do UnCliC Manager

Este documento detalha o sistema de agendamentos implementado no UnCliC Manager, explicando sua arquitetura, funcionalidades e implementação.

## Sumário

- [Visão Geral](#visão-geral)
- [Modelo de Dados](#modelo-de-dados)
- [Funcionalidades](#funcionalidades)
- [Fluxos de Agendamento](#fluxos-de-agendamento)
- [Notificações](#notificações)
- [Implementação no Frontend](#implementação-no-frontend)
- [Implementação no Backend](#implementação-no-backend)
- [Casos de Uso](#casos-de-uso)
- [Considerações de Performance](#considerações-de-performance)
- [Melhores Práticas](#melhores-práticas)

## Visão Geral

O sistema de agendamentos do UnCliC Manager permite gerenciar compromissos, serviços e recursos de forma eficiente, oferecendo:

- Agendamento de serviços para clientes
- Alocação de profissionais por disponibilidade
- Gestão de horários disponíveis
- Visualização em calendário e lista
- Confirmações e lembretes automáticos
- Integração com pagamentos

## Modelo de Dados

O sistema é baseado nas seguintes tabelas principais:

### Agendamentos

```sql
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES public.negocios(id),
  id_cliente UUID REFERENCES public.clientes(id),
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado',
  titulo TEXT NOT NULL,
  descricao TEXT,
  cor TEXT,
  recorrente BOOLEAN DEFAULT FALSE,
  padrao_recorrencia JSONB,
  metadados JSONB DEFAULT '{}'::JSONB,
  criado_por UUID REFERENCES auth.users(id),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_agendamentos_negocio ON public.agendamentos(id_negocio);
CREATE INDEX idx_agendamentos_cliente ON public.agendamentos(id_cliente);
CREATE INDEX idx_agendamentos_periodo ON public.agendamentos(data_inicio, data_fim);
CREATE INDEX idx_agendamentos_status ON public.agendamentos(status);

-- Habilitar RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Política de isolamento por negócio
CREATE POLICY "Isolamento de agendamentos por negócio"
ON public.agendamentos
USING (
  id_negocio IN (
    SELECT id_negocio FROM public.usuarios WHERE auth.uid() = id
  )
);
```

### Serviços de Agendamento

```sql
CREATE TABLE public.agendamento_servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_agendamento UUID NOT NULL REFERENCES public.agendamentos(id) ON DELETE CASCADE,
  id_servico UUID NOT NULL REFERENCES public.servicos(id),
  preco DECIMAL(10, 2) NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  desconto DECIMAL(10, 2) DEFAULT 0,
  observacoes TEXT,
  duracao_minutos INTEGER
);
```

### Profissionais Alocados

```sql
CREATE TABLE public.agendamento_profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_agendamento UUID NOT NULL REFERENCES public.agendamentos(id) ON DELETE CASCADE,
  id_profissional UUID NOT NULL REFERENCES public.profissionais(id),
  principal BOOLEAN DEFAULT FALSE
);
```

### Status de Agendamento

```sql
CREATE TABLE public.status_agendamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES public.negocios(id),
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER,
  acoes_automaticas JSONB -- Ações desencadeadas automaticamente
);
```

### Disponibilidade de Profissionais

```sql
CREATE TABLE public.disponibilidade_profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_profissional UUID NOT NULL REFERENCES public.profissionais(id),
  dia_semana INTEGER NOT NULL, -- 0 (domingo) a 6 (sábado)
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  intervalo_minutos INTEGER DEFAULT 0
);
```

## Funcionalidades

### Principais Recursos

1. **Gerenciamento de Agendamentos**
   - Criar, editar e cancelar agendamentos
   - Visualizar agenda diária, semanal e mensal
   - Filtrar por profissional, serviço ou status

2. **Gestão de Disponibilidade**
   - Definir horários disponíveis por profissional
   - Gerenciar folgas e férias
   - Bloquear horários para compromissos internos

3. **Serviços e Duração**
   - Vincular serviços a agendamentos
   - Calcular duração com base nos serviços
   - Precificação automática

4. **Notificações**
   - Confirmações de agendamento
   - Lembretes automáticos
   - Notificações de alterações

5. **Recorrência**
   - Agendamentos periódicos (semanal, mensal)
   - Exceções a padrões de recorrência
   - Edição em massa ou individual

## Fluxos de Agendamento

### Novo Agendamento

1. **Verificação de Disponibilidade**
   - Consulta de horários disponíveis por profissional
   - Verificação de conflitos de agenda

2. **Criação do Agendamento**
   - Registro de dados básicos (cliente, data)
   - Vinculação de serviços
   - Alocação de profissionais

3. **Confirmação**
   - Cálculo de valor total
   - Envio de confirmação ao cliente
   - Registro no calendário

### Cancelamento e Reagendamento

1. **Política de Cancelamento**
   - Verificação de prazo para cancelamento gratuito
   - Aplicação de taxas conforme configuração

2. **Reagendamento**
   - Verificação de disponibilidade para nova data
   - Transferência de informações do agendamento original

3. **Notificação**
   - Aviso ao cliente e profissionais
   - Atualização de status

## Notificações

### Tipos de Notificações

1. **Confirmação de Agendamento**
   - Enviada imediatamente após a criação

2. **Lembrete de Agendamento**
   - Configurável (1 dia antes, 2 horas antes)

3. **Alteração de Status**
   - Enviada quando o status muda (confirmado, concluído, etc.)

4. **Cancelamento**
   - Notificação automática de cancelamento

### Canais de Comunicação

- Email
- SMS
- WhatsApp (via API)
- Notificações no aplicativo

### Implementação

```typescript
// Serviço de notificações de agendamento
class AgendamentoNotificacaoService {
  async enviarConfirmacao(agendamentoId: string) {
    try {
      // Buscar dados do agendamento
      const agendamento = await this.getAgendamentoComDados(agendamentoId);
      
      // Determinar canais de comunicação preferidos do cliente
      const canais = await this.getCanaisPreferidos(agendamento.id_cliente);
      
      // Gerar conteúdo da mensagem
      const conteudo = this.gerarConteudoConfirmacao(agendamento);
      
      // Enviar por cada canal ativo
      for (const canal of canais) {
        await this.enviarPorCanal(canal, conteudo, agendamento);
      }
      
      // Registrar envio
      await this.registrarNotificacao(agendamentoId, 'confirmacao');
    } catch (error) {
      console.error('Erro ao enviar confirmação:', error);
    }
  }
  
  // Outros métodos para diferentes tipos de notificações...
}
```

## Implementação no Frontend

### Componente de Calendário

```tsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/useTenant';
import { AgendamentoDialog } from './AgendamentoDialog';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

export function AgendaCalendario() {
  const [eventos, setEventos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const { currentTenant } = useTenant();
  
  useEffect(() => {
    if (!currentTenant) return;
    carregarAgendamentos();
  }, [currentTenant, view, date]);
  
  const carregarAgendamentos = async () => {
    try {
      // Calcular intervalo de datas com base na visualização atual
      const { inicio, fim } = calcularIntervaloData(view, date);
      
      // Buscar agendamentos
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          id,
          titulo,
          descricao,
          data_inicio,
          data_fim,
          status,
          cor,
          clientes(id, nome),
          agendamento_servicos(
            id,
            servicos(id, nome, duracao_minutos)
          ),
          agendamento_profissionais(
            id,
            profissionais(id, nome)
          )
        `)
        .eq('id_negocio', currentTenant.id)
        .gte('data_inicio', inicio.toISOString())
        .lte('data_fim', fim.toISOString());
      
      if (error) throw error;
      
      // Mapear dados para o formato do calendário
      const eventosFormatados = data.map(item => ({
        id: item.id,
        title: item.titulo,
        start: new Date(item.data_inicio),
        end: new Date(item.data_fim),
        status: item.status,
        client: item.clientes?.nome || 'Sem cliente',
        services: item.agendamento_servicos?.map(s => s.servicos?.nome) || [],
        professionals: item.agendamento_profissionais?.map(p => p.profissionais?.nome) || [],
        color: item.cor || getStatusColor(item.status),
        resource: item
      }));
      
      setEventos(eventosFormatados);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };
  
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({
      start,
      end,
      resource: {}
    });
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = (refresh = false) => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    if (refresh) carregarAgendamentos();
  };
  
  return (
    <div className="agenda-calendario">
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 200px)' }}
        views={['day', 'week', 'month']}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color
          }
        })}
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Não há agendamentos neste período'
        }}
      />
      
      {isDialogOpen && (
        <AgendamentoDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          agendamento={selectedEvent?.resource}
          dataInicio={selectedEvent?.start}
          dataFim={selectedEvent?.end}
        />
      )}
    </div>
  );
}

// Função auxiliar para calcular intervalo de datas
function calcularIntervaloData(view, date) {
  let inicio, fim;
  
  switch (view) {
    case 'day':
      inicio = moment(date).startOf('day');
      fim = moment(date).endOf('day');
      break;
    case 'week':
      inicio = moment(date).startOf('week');
      fim = moment(date).endOf('week');
      break;
    case 'month':
      inicio = moment(date).startOf('month').subtract(7, 'days');
      fim = moment(date).endOf('month').add(7, 'days');
      break;
    default:
      inicio = moment().startOf('week');
      fim = moment().endOf('week');
  }
  
  return { inicio, fim };
}

// Obter cor para status
function getStatusColor(status) {
  const colors = {
    'agendado': '#3498db',
    'confirmado': '#2ecc71',
    'em_andamento': '#f39c12',
    'concluido': '#27ae60',
    'cancelado': '#e74c3c'
  };
  
  return colors[status] || '#95a5a6';
}
```

## Implementação no Backend

### Verificação de Disponibilidade

```typescript
// Função para verificar disponibilidade de profissional
export async function verificarDisponibilidade(
  idProfissional: string,
  dataInicio: Date,
  dataFim: Date
): Promise<boolean> {
  try {
    // 1. Verificar se o horário está dentro do expediente
    const disponivel = await verificarHorarioExpediente(
      idProfissional,
      dataInicio,
      dataFim
    );
    
    if (!disponivel) return false;
    
    // 2. Verificar se não há conflito com outros agendamentos
    const { count, error } = await supabase
      .from('agendamentos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'agendado')
      .or(`status.eq.confirmado,status.eq.em_andamento`)
      .in('id', query => {
        query
          .from('agendamento_profissionais')
          .select('id_agendamento')
          .eq('id_profissional', idProfissional);
      })
      .or(
        `data_inicio.gte.${dataInicio.toISOString()}.and.data_inicio.lt.${dataFim.toISOString()}`,
        `data_fim.gt.${dataInicio.toISOString()}.and.data_fim.lte.${dataFim.toISOString()}`,
        `data_inicio.lte.${dataInicio.toISOString()}.and.data_fim.gte.${dataFim.toISOString()}`
      );
    
    if (error) throw error;
    
    return count === 0;
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return false;
  }
}

// Verificar se horário está no expediente do profissional
async function verificarHorarioExpediente(
  idProfissional: string,
  dataInicio: Date,
  dataFim: Date
): Promise<boolean> {
  // Obter dia da semana (0-6)
  const diaSemana = dataInicio.getDay();
  
  // Obter hora de início e fim
  const horaInicio = `${dataInicio.getHours()}:${dataInicio.getMinutes()}:00`;
  const horaFim = `${dataFim.getHours()}:${dataFim.getMinutes()}:00`;
  
  // Consultar disponibilidade configurada
  const { data, error } = await supabase
    .from('disponibilidade_profissionais')
    .select('*')
    .eq('id_profissional', idProfissional)
    .eq('dia_semana', diaSemana)
    .lte('hora_inicio', horaInicio)
    .gte('hora_fim', horaFim);
  
  if (error) {
    console.error('Erro ao verificar expediente:', error);
    return false;
  }
  
  return data && data.length > 0;
}
```

### Funções RPC para Agendamento

```sql
-- Função para encontrar próximos horários disponíveis
CREATE OR REPLACE FUNCTION public.encontrar_horarios_disponiveis(
  p_id_profissional UUID,
  p_id_servico UUID,
  p_data_inicial TIMESTAMP WITH TIME ZONE,
  p_quantidade_horarios INTEGER DEFAULT 5
)
RETURNS JSONB AS $$
DECLARE
  v_duracao_servico INTEGER;
  v_horarios_disponiveis JSONB = '[]'::JSONB;
  v_horario_atual TIMESTAMP WITH TIME ZONE = p_data_inicial;
  v_horario_fim TIMESTAMP WITH TIME ZONE;
  v_dia_atual INTEGER;
  v_hora_inicio TIME;
  v_hora_fim TIME;
  v_disponibilidade RECORD;
  v_encontrados INTEGER = 0;
BEGIN
  -- Obter duração do serviço
  SELECT duracao_minutos INTO v_duracao_servico
  FROM public.servicos
  WHERE id = p_id_servico;
  
  IF v_duracao_servico IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Procurar próximos horários disponíveis
  WHILE v_encontrados < p_quantidade_horarios AND v_horario_atual < (p_data_inicial + INTERVAL '30 days') LOOP
    v_dia_atual = EXTRACT(DOW FROM v_horario_atual);
    
    -- Encontrar disponibilidade para o dia atual
    FOR v_disponibilidade IN
      SELECT hora_inicio, hora_fim 
      FROM public.disponibilidade_profissionais
      WHERE id_profissional = p_id_profissional AND dia_semana = v_dia_atual
    LOOP
      v_hora_inicio = v_disponibilidade.hora_inicio;
      v_hora_fim = v_disponibilidade.hora_fim;
      
      -- Ajustar horário atual para respeitar hora de início
      IF EXTRACT(HOUR FROM v_horario_atual)::INTEGER < EXTRACT(HOUR FROM v_hora_inicio)::INTEGER 
        OR (
          EXTRACT(HOUR FROM v_horario_atual)::INTEGER = EXTRACT(HOUR FROM v_hora_inicio)::INTEGER 
          AND EXTRACT(MINUTE FROM v_horario_atual)::INTEGER < EXTRACT(MINUTE FROM v_hora_inicio)::INTEGER
        ) THEN
        v_horario_atual = date_trunc('day', v_horario_atual) 
                          + EXTRACT(HOUR FROM v_hora_inicio) * INTERVAL '1 hour'
                          + EXTRACT(MINUTE FROM v_hora_inicio) * INTERVAL '1 minute';
      END IF;
      
      -- Verificar disponibilidade até o final do expediente
      WHILE 
        (EXTRACT(HOUR FROM v_horario_atual)::INTEGER < EXTRACT(HOUR FROM v_hora_fim)::INTEGER
        OR (
          EXTRACT(HOUR FROM v_horario_atual)::INTEGER = EXTRACT(HOUR FROM v_hora_fim)::INTEGER
          AND EXTRACT(MINUTE FROM v_horario_atual)::INTEGER + v_duracao_servico <= EXTRACT(MINUTE FROM v_hora_fim)::INTEGER
        ))
        AND v_encontrados < p_quantidade_horarios 
      LOOP
        v_horario_fim = v_horario_atual + (v_duracao_servico * INTERVAL '1 minute');
        
        -- Verificar se não há conflito com outros agendamentos
        IF NOT EXISTS (
          SELECT 1 FROM public.agendamentos a
          JOIN public.agendamento_profissionais ap ON a.id = ap.id_agendamento
          WHERE ap.id_profissional = p_id_profissional
          AND a.status IN ('agendado', 'confirmado', 'em_andamento')
          AND (
            (a.data_inicio >= v_horario_atual AND a.data_inicio < v_horario_fim)
            OR (a.data_fim > v_horario_atual AND a.data_fim <= v_horario_fim)
            OR (a.data_inicio <= v_horario_atual AND a.data_fim >= v_horario_fim)
          )
        ) THEN
          -- Adicionar horário disponível
          v_horarios_disponiveis = v_horarios_disponiveis || jsonb_build_object(
            'inicio', v_horario_atual,
            'fim', v_horario_fim
          );
          v_encontrados = v_encontrados + 1;
        END IF;
        
        -- Avançar para próximo slot (15 minutos)
        v_horario_atual = v_horario_atual + INTERVAL '15 minutes';
      END LOOP;
      
      EXIT WHEN v_encontrados >= p_quantidade_horarios;
    END LOOP;
    
    -- Se não encontrou slots no dia atual, avançar para o próximo dia
    IF v_horario_atual < (date_trunc('day', v_horario_atual) + INTERVAL '1 day') THEN
      v_horario_atual = date_trunc('day', v_horario_atual) + INTERVAL '1 day';
    END IF;
  END LOOP;
  
  RETURN v_horarios_disponiveis;
END;
$$ LANGUAGE plpgsql;
```

## Casos de Uso

### Auto-Agendamento Online

O cliente pode agendar serviços diretamente pelo site ou aplicativo:

1. Seleção de serviço
2. Escolha de profissional
3. Visualização de horários disponíveis
4. Confirmação com ou sem pagamento antecipado

### Agendamento por Recepcionista

Atendente pode gerenciar toda agenda:

1. Registro de clientes
2. Verificação da disponibilidade
3. Alocação otimizada de profissionais
4. Registro de preferências do cliente

### Gerenciamento de Equipe

Distribuição eficiente de tarefas:

1. Visualização da carga de trabalho
2. Balanceamento de agendamentos
3. Gerenciamento de folgas
4. Relatórios de produtividade

## Considerações de Performance

### Otimizações Implementadas

1. **Indexação Estratégica**
   - Índices compostos para consultas frequentes
   - Índices para filtragem por período e status

2. **Paginação e Carregamento Progressivo**
   - Carregamento de eventos sob demanda
   - Técnicas de paginação para grandes volumes

3. **Caching**
   - Cache de horários disponíveis
   - Regeneração periódica de dados calculados

4. **Consultas Otimizadas**
   - Minimização de joins em consultas críticas
   - Views materializadas para dados agregados

## Melhores Práticas

1. **Controle de Conflitos**
   - Validação rigorosa para evitar overbooking
   - Bloqueio temporário de slots durante confirmação

2. **Integração com Outros Módulos**
   - Sincronização com estoque para materiais
   - Integração com financeiro para pagamentos
   - Conexão com CRM para histórico do cliente

3. **Dados Históricos**
   - Manter histórico completo de alterações
   - Evitar exclusão de agendamentos (usar status)

4. **Processamento Assíncrono**
   - Envio de notificações em background
   - Cálculos de disponibilidade em batch 