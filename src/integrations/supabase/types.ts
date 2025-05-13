export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advertisements: {
        Row: {
          clicks: number
          createdAt: string
          description: string | null
          endDate: string
          id: string
          image: string | null
          impressions: number
          isActive: boolean
          startDate: string
          tenantId: string
          title: string
          updatedAt: string
          url: string | null
        }
        Insert: {
          clicks?: number
          createdAt?: string
          description?: string | null
          endDate: string
          id: string
          image?: string | null
          impressions?: number
          isActive?: boolean
          startDate: string
          tenantId: string
          title: string
          updatedAt: string
          url?: string | null
        }
        Update: {
          clicks?: number
          createdAt?: string
          description?: string | null
          endDate?: string
          id?: string
          image?: string | null
          impressions?: number
          isActive?: boolean
          startDate?: string
          tenantId?: string
          title?: string
          updatedAt?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos: {
        Row: {
          atualizado_em: string | null
          avaliacao: number | null
          comentario_avaliacao: string | null
          criado_em: string | null
          data: string
          duracao: number
          forma_pagamento: string | null
          hora_fim: string
          hora_inicio: string
          id: string
          id_cliente: string
          id_funcionario: string
          id_negocio: string
          id_servico: string
          lembrete_enviado: boolean | null
          observacoes: string | null
          status: string | null
          valor: number
        }
        Insert: {
          atualizado_em?: string | null
          avaliacao?: number | null
          comentario_avaliacao?: string | null
          criado_em?: string | null
          data: string
          duracao: number
          forma_pagamento?: string | null
          hora_fim: string
          hora_inicio: string
          id?: string
          id_cliente: string
          id_funcionario: string
          id_negocio: string
          id_servico: string
          lembrete_enviado?: boolean | null
          observacoes?: string | null
          status?: string | null
          valor: number
        }
        Update: {
          atualizado_em?: string | null
          avaliacao?: number | null
          comentario_avaliacao?: string | null
          criado_em?: string | null
          data?: string
          duracao?: number
          forma_pagamento?: string | null
          hora_fim?: string
          hora_inicio?: string
          id?: string
          id_cliente?: string
          id_funcionario?: string
          id_negocio?: string
          id_servico?: string
          lembrete_enviado?: boolean | null
          observacoes?: string | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_id_servico_fkey"
            columns: ["id_servico"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      analises_negocio: {
        Row: {
          agendamentos_concluidos: number | null
          clientes_recorrentes: number | null
          criado_em: string | null
          data: string
          despesas_total: number | null
          funcionarios_destaque: Json | null
          id: string
          id_negocio: string
          lucro_liquido: number | null
          novos_clientes: number | null
          nps: number | null
          receita_total: number | null
          servicos_populares: Json | null
          taxa_cancelamento: number | null
          taxa_ocupacao: number | null
          tempo_medio_atendimento: number | null
          total_agendamentos: number | null
        }
        Insert: {
          agendamentos_concluidos?: number | null
          clientes_recorrentes?: number | null
          criado_em?: string | null
          data: string
          despesas_total?: number | null
          funcionarios_destaque?: Json | null
          id?: string
          id_negocio: string
          lucro_liquido?: number | null
          novos_clientes?: number | null
          nps?: number | null
          receita_total?: number | null
          servicos_populares?: Json | null
          taxa_cancelamento?: number | null
          taxa_ocupacao?: number | null
          tempo_medio_atendimento?: number | null
          total_agendamentos?: number | null
        }
        Update: {
          agendamentos_concluidos?: number | null
          clientes_recorrentes?: number | null
          criado_em?: string | null
          data?: string
          despesas_total?: number | null
          funcionarios_destaque?: Json | null
          id?: string
          id_negocio?: string
          lucro_liquido?: number | null
          novos_clientes?: number | null
          nps?: number | null
          receita_total?: number | null
          servicos_populares?: Json | null
          taxa_cancelamento?: number | null
          taxa_ocupacao?: number | null
          tempo_medio_atendimento?: number | null
          total_agendamentos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analises_negocio_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_services: {
        Row: {
          appointmentId: string
          createdAt: string
          discount: number | null
          duration: number
          id: string
          notes: string | null
          price: number
          serviceId: string
          updatedAt: string
        }
        Insert: {
          appointmentId: string
          createdAt?: string
          discount?: number | null
          duration: number
          id: string
          notes?: string | null
          price: number
          serviceId: string
          updatedAt: string
        }
        Update: {
          appointmentId?: string
          createdAt?: string
          discount?: number | null
          duration?: number
          id?: string
          notes?: string | null
          price?: number
          serviceId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointmentId_fkey"
            columns: ["appointmentId"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          cancelledAt: string | null
          cancelReason: string | null
          createdAt: string
          createdById: string | null
          customerId: string | null
          customerNotes: string | null
          endTime: string
          establishmentId: string
          id: string
          internalNotes: string | null
          notes: string | null
          professionalId: string
          reminderSentAt: string | null
          source: Database["public"]["Enums"]["AppointmentSource"]
          startTime: string
          status: Database["public"]["Enums"]["AppointmentStatus"]
          tenantId: string
          updatedAt: string
          updatedById: string | null
        }
        Insert: {
          cancelledAt?: string | null
          cancelReason?: string | null
          createdAt?: string
          createdById?: string | null
          customerId?: string | null
          customerNotes?: string | null
          endTime: string
          establishmentId: string
          id: string
          internalNotes?: string | null
          notes?: string | null
          professionalId: string
          reminderSentAt?: string | null
          source?: Database["public"]["Enums"]["AppointmentSource"]
          startTime: string
          status?: Database["public"]["Enums"]["AppointmentStatus"]
          tenantId: string
          updatedAt: string
          updatedById?: string | null
        }
        Update: {
          cancelledAt?: string | null
          cancelReason?: string | null
          createdAt?: string
          createdById?: string | null
          customerId?: string | null
          customerNotes?: string | null
          endTime?: string
          establishmentId?: string
          id?: string
          internalNotes?: string | null
          notes?: string | null
          professionalId?: string
          reminderSentAt?: string | null
          source?: Database["public"]["Enums"]["AppointmentSource"]
          startTime?: string
          status?: Database["public"]["Enums"]["AppointmentStatus"]
          tenantId?: string
          updatedAt?: string
          updatedById?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_establishmentId_fkey"
            columns: ["establishmentId"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professionalId_fkey"
            columns: ["professionalId"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_updatedById_fkey"
            columns: ["updatedById"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas_marketing: {
        Row: {
          atualizado_em: string | null
          canais: string[] | null
          cliques: number | null
          conversoes: number | null
          criado_em: string | null
          criado_por: string | null
          data_fim: string
          data_inicio: string
          id: string
          id_negocio: string
          impressoes: number | null
          nome: string
          orcamento: number | null
          publico_alvo: string | null
          resultados: Json | null
          roi: number | null
          status: string | null
          tipo: string
          total_gasto: number | null
        }
        Insert: {
          atualizado_em?: string | null
          canais?: string[] | null
          cliques?: number | null
          conversoes?: number | null
          criado_em?: string | null
          criado_por?: string | null
          data_fim: string
          data_inicio: string
          id?: string
          id_negocio: string
          impressoes?: number | null
          nome: string
          orcamento?: number | null
          publico_alvo?: string | null
          resultados?: Json | null
          roi?: number | null
          status?: string | null
          tipo: string
          total_gasto?: number | null
        }
        Update: {
          atualizado_em?: string | null
          canais?: string[] | null
          cliques?: number | null
          conversoes?: number | null
          criado_em?: string | null
          criado_por?: string | null
          data_fim?: string
          data_inicio?: string
          id?: string
          id_negocio?: string
          impressoes?: number | null
          nome?: string
          orcamento?: number | null
          publico_alvo?: string | null
          resultados?: Json | null
          roi?: number | null
          status?: string | null
          tipo?: string
          total_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_marketing_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_marketing_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          atualizado_em: string | null
          cor: string | null
          criado_em: string | null
          descricao: string | null
          icone: string | null
          id: string
          id_negocio: string
          nome: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string | null
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          id_negocio: string
          nome: string
          tipo: string
        }
        Update: {
          atualizado_em?: string | null
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          id_negocio?: string
          nome?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          atualizado_em: string | null
          cep: string | null
          cidade: string | null
          criado_em: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          genero: string | null
          id: string
          id_negocio: string
          id_usuario: string | null
          nome: string
          notas: string | null
          preferencias: Json | null
          telefone: string | null
          tenant_id: string | null
          ultima_visita: string | null
          valor_total_gasto: number | null
        }
        Insert: {
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          genero?: string | null
          id?: string
          id_negocio: string
          id_usuario?: string | null
          nome: string
          notas?: string | null
          preferencias?: Json | null
          telefone?: string | null
          tenant_id?: string | null
          ultima_visita?: string | null
          valor_total_gasto?: number | null
        }
        Update: {
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          genero?: string | null
          id?: string
          id_negocio?: string
          id_usuario?: string | null
          nome?: string
          notas?: string | null
          preferencias?: Json | null
          telefone?: string | null
          tenant_id?: string | null
          ultima_visita?: string | null
          valor_total_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          isActive: boolean
          isDefault: boolean
          name: string
          tenantId: string
          type: Database["public"]["Enums"]["CommissionType"]
          updatedAt: string
          value: number
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          isActive?: boolean
          isDefault?: boolean
          name: string
          tenantId: string
          type: Database["public"]["Enums"]["CommissionType"]
          updatedAt: string
          value: number
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          isActive?: boolean
          isDefault?: boolean
          name?: string
          tenantId?: string
          type?: Database["public"]["Enums"]["CommissionType"]
          updatedAt?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          appointmentId: string | null
          createdAt: string
          financialTransactionId: string | null
          id: string
          paidAt: string | null
          professionalId: string
          status: Database["public"]["Enums"]["CommissionStatus"]
          updatedAt: string
        }
        Insert: {
          amount: number
          appointmentId?: string | null
          createdAt?: string
          financialTransactionId?: string | null
          id: string
          paidAt?: string | null
          professionalId: string
          status?: Database["public"]["Enums"]["CommissionStatus"]
          updatedAt: string
        }
        Update: {
          amount?: number
          appointmentId?: string | null
          createdAt?: string
          financialTransactionId?: string | null
          id?: string
          paidAt?: string | null
          professionalId?: string
          status?: Database["public"]["Enums"]["CommissionStatus"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_appointmentId_fkey"
            columns: ["appointmentId"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_financialTransactionId_fkey"
            columns: ["financialTransactionId"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_professionalId_fkey"
            columns: ["professionalId"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_negocio: {
        Row: {
          atualizado_em: string | null
          aviso_minimo_agendamento: number | null
          banner_url: string | null
          bloquear_clientes_faltantes: boolean | null
          configuracoes_gateway_pagamento: Json | null
          confirmacao_manual_agendamentos: boolean | null
          cores_primarias: string | null
          cores_secundarias: string | null
          criado_em: string | null
          dias_maximos_antecedencia: number | null
          enviar_confirmacao_email: boolean | null
          enviar_lembretes: boolean | null
          fallback_humano_habilitado: boolean | null
          ia_habilitada: boolean | null
          id: string
          id_negocio: string
          limite_fila_remota: number | null
          logo_url: string | null
          mensagem_cancelamento: string | null
          mensagem_pos_atendimento: boolean | null
          pagamento_antecipado_obrigatorio: boolean | null
          permite_agendamentos_simultaneos: boolean | null
          permite_fila_remota: boolean | null
          permite_gorjetas: boolean | null
          politica_cancelamento: string | null
          politica_cancelamento_horas: number | null
          taxa_nao_comparecimento: number | null
          tempo_lembrete_horas: number | null
          tempo_mensagem_pos_horas: number | null
        }
        Insert: {
          atualizado_em?: string | null
          aviso_minimo_agendamento?: number | null
          banner_url?: string | null
          bloquear_clientes_faltantes?: boolean | null
          configuracoes_gateway_pagamento?: Json | null
          confirmacao_manual_agendamentos?: boolean | null
          cores_primarias?: string | null
          cores_secundarias?: string | null
          criado_em?: string | null
          dias_maximos_antecedencia?: number | null
          enviar_confirmacao_email?: boolean | null
          enviar_lembretes?: boolean | null
          fallback_humano_habilitado?: boolean | null
          ia_habilitada?: boolean | null
          id?: string
          id_negocio: string
          limite_fila_remota?: number | null
          logo_url?: string | null
          mensagem_cancelamento?: string | null
          mensagem_pos_atendimento?: boolean | null
          pagamento_antecipado_obrigatorio?: boolean | null
          permite_agendamentos_simultaneos?: boolean | null
          permite_fila_remota?: boolean | null
          permite_gorjetas?: boolean | null
          politica_cancelamento?: string | null
          politica_cancelamento_horas?: number | null
          taxa_nao_comparecimento?: number | null
          tempo_lembrete_horas?: number | null
          tempo_mensagem_pos_horas?: number | null
        }
        Update: {
          atualizado_em?: string | null
          aviso_minimo_agendamento?: number | null
          banner_url?: string | null
          bloquear_clientes_faltantes?: boolean | null
          configuracoes_gateway_pagamento?: Json | null
          confirmacao_manual_agendamentos?: boolean | null
          cores_primarias?: string | null
          cores_secundarias?: string | null
          criado_em?: string | null
          dias_maximos_antecedencia?: number | null
          enviar_confirmacao_email?: boolean | null
          enviar_lembretes?: boolean | null
          fallback_humano_habilitado?: boolean | null
          ia_habilitada?: boolean | null
          id?: string
          id_negocio?: string
          limite_fila_remota?: number | null
          logo_url?: string | null
          mensagem_cancelamento?: string | null
          mensagem_pos_atendimento?: boolean | null
          pagamento_antecipado_obrigatorio?: boolean | null
          permite_agendamentos_simultaneos?: boolean | null
          permite_fila_remota?: boolean | null
          permite_gorjetas?: boolean | null
          politica_cancelamento?: string | null
          politica_cancelamento_horas?: number | null
          taxa_nao_comparecimento?: number | null
          tempo_lembrete_horas?: number | null
          tempo_mensagem_pos_horas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_negocio_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: true
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          addressComplement: string | null
          addressNumber: string | null
          avatar: string | null
          birthDate: string | null
          city: string | null
          createdAt: string
          email: string | null
          gender: Database["public"]["Enums"]["Gender"] | null
          id: string
          isActive: boolean
          name: string
          neighborhood: string | null
          notes: string | null
          phone: string | null
          state: string | null
          tags: string[] | null
          tenantId: string
          updatedAt: string
          zipCode: string | null
        }
        Insert: {
          address?: string | null
          addressComplement?: string | null
          addressNumber?: string | null
          avatar?: string | null
          birthDate?: string | null
          city?: string | null
          createdAt?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id: string
          isActive?: boolean
          name: string
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          state?: string | null
          tags?: string[] | null
          tenantId: string
          updatedAt: string
          zipCode?: string | null
        }
        Update: {
          address?: string | null
          addressComplement?: string | null
          addressNumber?: string | null
          avatar?: string | null
          birthDate?: string | null
          city?: string | null
          createdAt?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          isActive?: boolean
          name?: string
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          state?: string | null
          tags?: string[] | null
          tenantId?: string
          updatedAt?: string
          zipCode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string | null
          addressComplement: string | null
          addressNumber: string | null
          city: string | null
          coverImage: string | null
          createdAt: string
          description: string | null
          email: string | null
          id: string
          isActive: boolean
          logo: string | null
          name: string
          neighborhood: string | null
          openingHours: Json | null
          phone: string | null
          slug: string
          state: string | null
          tenantId: string
          updatedAt: string
          website: string | null
          zipCode: string | null
        }
        Insert: {
          address?: string | null
          addressComplement?: string | null
          addressNumber?: string | null
          city?: string | null
          coverImage?: string | null
          createdAt?: string
          description?: string | null
          email?: string | null
          id: string
          isActive?: boolean
          logo?: string | null
          name: string
          neighborhood?: string | null
          openingHours?: Json | null
          phone?: string | null
          slug: string
          state?: string | null
          tenantId: string
          updatedAt: string
          website?: string | null
          zipCode?: string | null
        }
        Update: {
          address?: string | null
          addressComplement?: string | null
          addressNumber?: string | null
          city?: string | null
          coverImage?: string | null
          createdAt?: string
          description?: string | null
          email?: string | null
          id?: string
          isActive?: boolean
          logo?: string | null
          name?: string
          neighborhood?: string | null
          openingHours?: Json | null
          phone?: string | null
          slug?: string
          state?: string | null
          tenantId?: string
          updatedAt?: string
          website?: string | null
          zipCode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque: {
        Row: {
          atualizado_em: string | null
          codigo_barras: string | null
          criado_em: string | null
          data_ultima_reposicao: string | null
          data_validade: string | null
          descricao: string | null
          e_equipamento: boolean | null
          id: string
          id_categoria: string | null
          id_fornecedor: string | null
          id_negocio: string
          imagem_url: string | null
          localizacao: string | null
          nome: string
          preco_custo: number | null
          preco_venda: number | null
          quantidade: number
          quantidade_minima: number | null
          sku: string | null
        }
        Insert: {
          atualizado_em?: string | null
          codigo_barras?: string | null
          criado_em?: string | null
          data_ultima_reposicao?: string | null
          data_validade?: string | null
          descricao?: string | null
          e_equipamento?: boolean | null
          id?: string
          id_categoria?: string | null
          id_fornecedor?: string | null
          id_negocio: string
          imagem_url?: string | null
          localizacao?: string | null
          nome: string
          preco_custo?: number | null
          preco_venda?: number | null
          quantidade?: number
          quantidade_minima?: number | null
          sku?: string | null
        }
        Update: {
          atualizado_em?: string | null
          codigo_barras?: string | null
          criado_em?: string | null
          data_ultima_reposicao?: string | null
          data_validade?: string | null
          descricao?: string | null
          e_equipamento?: boolean | null
          id?: string
          id_categoria?: string | null
          id_fornecedor?: string | null
          id_negocio?: string
          imagem_url?: string | null
          localizacao?: string | null
          nome?: string
          preco_custo?: number | null
          preco_venda?: number | null
          quantidade?: number
          quantidade_minima?: number | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          accountNumber: string | null
          agency: string | null
          bank: string | null
          createdAt: string
          currentBalance: number
          description: string | null
          establishmentId: string
          id: string
          initialBalance: number
          isActive: boolean
          name: string
          tenantId: string
          type: Database["public"]["Enums"]["AccountType"]
          updatedAt: string
        }
        Insert: {
          accountNumber?: string | null
          agency?: string | null
          bank?: string | null
          createdAt?: string
          currentBalance?: number
          description?: string | null
          establishmentId: string
          id: string
          initialBalance?: number
          isActive?: boolean
          name: string
          tenantId: string
          type: Database["public"]["Enums"]["AccountType"]
          updatedAt: string
        }
        Update: {
          accountNumber?: string | null
          agency?: string | null
          bank?: string | null
          createdAt?: string
          currentBalance?: number
          description?: string | null
          establishmentId?: string
          id?: string
          initialBalance?: number
          isActive?: boolean
          name?: string
          tenantId?: string
          type?: Database["public"]["Enums"]["AccountType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_accounts_establishmentId_fkey"
            columns: ["establishmentId"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_accounts_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          color: string | null
          createdAt: string
          icon: string | null
          id: string
          isActive: boolean
          name: string
          parentId: string | null
          tenantId: string
          type: Database["public"]["Enums"]["TransactionType"]
          updatedAt: string
        }
        Insert: {
          color?: string | null
          createdAt?: string
          icon?: string | null
          id: string
          isActive?: boolean
          name: string
          parentId?: string | null
          tenantId: string
          type: Database["public"]["Enums"]["TransactionType"]
          updatedAt: string
        }
        Update: {
          color?: string | null
          createdAt?: string
          icon?: string | null
          id?: string
          isActive?: boolean
          name?: string
          parentId?: string | null
          tenantId?: string
          type?: Database["public"]["Enums"]["TransactionType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_categories_parentId_fkey"
            columns: ["parentId"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_categories_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          accountId: string
          amount: number
          appointmentId: string | null
          categoryId: string | null
          createdAt: string
          createdById: string | null
          customerId: string | null
          description: string | null
          document: string | null
          dueDate: string | null
          id: string
          notes: string | null
          paymentDate: string | null
          paymentGatewayData: Json | null
          paymentGatewayId: string | null
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"] | null
          status: Database["public"]["Enums"]["TransactionStatus"]
          tenantId: string
          type: Database["public"]["Enums"]["TransactionType"]
          updatedAt: string
        }
        Insert: {
          accountId: string
          amount: number
          appointmentId?: string | null
          categoryId?: string | null
          createdAt?: string
          createdById?: string | null
          customerId?: string | null
          description?: string | null
          document?: string | null
          dueDate?: string | null
          id: string
          notes?: string | null
          paymentDate?: string | null
          paymentGatewayData?: Json | null
          paymentGatewayId?: string | null
          paymentMethod?: Database["public"]["Enums"]["PaymentMethod"] | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          tenantId: string
          type: Database["public"]["Enums"]["TransactionType"]
          updatedAt: string
        }
        Update: {
          accountId?: string
          amount?: number
          appointmentId?: string | null
          categoryId?: string | null
          createdAt?: string
          createdById?: string | null
          customerId?: string | null
          description?: string | null
          document?: string | null
          dueDate?: string | null
          id?: string
          notes?: string | null
          paymentDate?: string | null
          paymentGatewayData?: Json | null
          paymentGatewayId?: string | null
          paymentMethod?: Database["public"]["Enums"]["PaymentMethod"] | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          tenantId?: string
          type?: Database["public"]["Enums"]["TransactionType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_appointmentId_fkey"
            columns: ["appointmentId"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          atualizado_em: string | null
          bio: string | null
          cargo: string | null
          comissao_percentual: number | null
          criado_em: string | null
          data_contratacao: string | null
          email: string | null
          especializacoes: string[] | null
          foto_url: string | null
          id: string
          id_negocio: string
          id_usuario: string | null
          nome: string
          status: string | null
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string | null
          bio?: string | null
          cargo?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          data_contratacao?: string | null
          email?: string | null
          especializacoes?: string[] | null
          foto_url?: string | null
          id?: string
          id_negocio: string
          id_usuario?: string | null
          nome: string
          status?: string | null
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string | null
          bio?: string | null
          cargo?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          data_contratacao?: string | null
          email?: string | null
          especializacoes?: string[] | null
          foto_url?: string | null
          id?: string
          id_negocio?: string
          id_usuario?: string | null
          nome?: string
          status?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios_disponibilidade: {
        Row: {
          atualizado_em: string | null
          capacidade_simultanea: number | null
          criado_em: string | null
          dia_folga: boolean | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id: string
          id_funcionario: string | null
          id_negocio: string
          id_servico: string | null
          intervalo_entre_agendamentos: number | null
        }
        Insert: {
          atualizado_em?: string | null
          capacidade_simultanea?: number | null
          criado_em?: string | null
          dia_folga?: boolean | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id?: string
          id_funcionario?: string | null
          id_negocio: string
          id_servico?: string | null
          intervalo_entre_agendamentos?: number | null
        }
        Update: {
          atualizado_em?: string | null
          capacidade_simultanea?: number | null
          criado_em?: string | null
          dia_folga?: boolean | null
          dia_semana?: number
          hora_fim?: string
          hora_inicio?: string
          id?: string
          id_funcionario?: string | null
          id_negocio?: string
          id_servico?: string | null
          intervalo_entre_agendamentos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_disponibilidade_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_disponibilidade_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_disponibilidade_id_servico_fkey"
            columns: ["id_servico"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          configuracao: Json | null
          criado_em: string | null
          data_expiracao_token: string | null
          id: string
          id_negocio: string
          nome_provedor: string
          status_ultima_sincronizacao: string | null
          tipo: string
          token_acesso: string | null
          token_refresh: string | null
          ultima_sincronizacao: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          configuracao?: Json | null
          criado_em?: string | null
          data_expiracao_token?: string | null
          id?: string
          id_negocio: string
          nome_provedor: string
          status_ultima_sincronizacao?: string | null
          tipo: string
          token_acesso?: string | null
          token_refresh?: string | null
          ultima_sincronizacao?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          configuracao?: Json | null
          criado_em?: string | null
          data_expiracao_token?: string | null
          id?: string
          id_negocio?: string
          nome_provedor?: string
          status_ultima_sincronizacao?: string | null
          tipo?: string
          token_acesso?: string | null
          token_refresh?: string | null
          ultima_sincronizacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          config: Json | null
          createdAt: string
          id: string
          lastSyncAt: string | null
          name: string
          status: Database["public"]["Enums"]["IntegrationStatus"]
          tenantId: string
          type: Database["public"]["Enums"]["IntegrationType"]
          updatedAt: string
        }
        Insert: {
          config?: Json | null
          createdAt?: string
          id: string
          lastSyncAt?: string | null
          name: string
          status?: Database["public"]["Enums"]["IntegrationStatus"]
          tenantId: string
          type: Database["public"]["Enums"]["IntegrationType"]
          updatedAt: string
        }
        Update: {
          config?: Json | null
          createdAt?: string
          id?: string
          lastSyncAt?: string | null
          name?: string
          status?: Database["public"]["Enums"]["IntegrationStatus"]
          tenantId?: string
          type?: Database["public"]["Enums"]["IntegrationType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string | null
          due_date: string | null
          id: string
          line_items: Json | null
          metadata: Json | null
          paid_date: string | null
          payment_method: string | null
          payment_url: string | null
          provider_invoice_id: string | null
          status: string
          subscription_id: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          line_items?: Json | null
          metadata?: Json | null
          paid_date?: string | null
          payment_method?: string | null
          payment_url?: string | null
          provider_invoice_id?: string | null
          status: string
          subscription_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          line_items?: Json | null
          metadata?: Json | null
          paid_date?: string | null
          payment_method?: string | null
          payment_url?: string | null
          provider_invoice_id?: string | null
          status?: string
          subscription_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_cards: {
        Row: {
          createdAt: string
          currentPoints: number
          customerId: string
          id: string
          isActive: boolean
          loyaltyLevelId: string | null
          loyaltyProgramId: string
          totalEarnedPoints: number
          totalRedeemedPoints: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          currentPoints?: number
          customerId: string
          id: string
          isActive?: boolean
          loyaltyLevelId?: string | null
          loyaltyProgramId: string
          totalEarnedPoints?: number
          totalRedeemedPoints?: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          currentPoints?: number
          customerId?: string
          id?: string
          isActive?: boolean
          loyaltyLevelId?: string | null
          loyaltyProgramId?: string
          totalEarnedPoints?: number
          totalRedeemedPoints?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_cards_loyaltyLevelId_fkey"
            columns: ["loyaltyLevelId"]
            isOneToOne: false
            referencedRelation: "loyalty_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_cards_loyaltyProgramId_fkey"
            columns: ["loyaltyProgramId"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_levels: {
        Row: {
          benefits: Json | null
          color: string | null
          createdAt: string
          description: string | null
          icon: string | null
          id: string
          isActive: boolean
          loyaltyProgramId: string
          name: string
          pointsRequired: number
          updatedAt: string
        }
        Insert: {
          benefits?: Json | null
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id: string
          isActive?: boolean
          loyaltyProgramId: string
          name: string
          pointsRequired: number
          updatedAt: string
        }
        Update: {
          benefits?: Json | null
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          isActive?: boolean
          loyaltyProgramId?: string
          name?: string
          pointsRequired?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_levels_loyaltyProgramId_fkey"
            columns: ["loyaltyProgramId"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          isActive: boolean
          name: string
          tenantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          isActive?: boolean
          name: string
          tenantId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          isActive?: boolean
          name?: string
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rules: {
        Row: {
          action: Database["public"]["Enums"]["LoyaltyAction"]
          createdAt: string
          description: string | null
          id: string
          isActive: boolean
          loyaltyProgramId: string
          minTransactionValue: number | null
          name: string
          pointsValue: number
          productIds: string[] | null
          serviceIds: string[] | null
          updatedAt: string
        }
        Insert: {
          action: Database["public"]["Enums"]["LoyaltyAction"]
          createdAt?: string
          description?: string | null
          id: string
          isActive?: boolean
          loyaltyProgramId: string
          minTransactionValue?: number | null
          name: string
          pointsValue: number
          productIds?: string[] | null
          serviceIds?: string[] | null
          updatedAt: string
        }
        Update: {
          action?: Database["public"]["Enums"]["LoyaltyAction"]
          createdAt?: string
          description?: string | null
          id?: string
          isActive?: boolean
          loyaltyProgramId?: string
          minTransactionValue?: number | null
          name?: string
          pointsValue?: number
          productIds?: string[] | null
          serviceIds?: string[] | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_rules_loyaltyProgramId_fkey"
            columns: ["loyaltyProgramId"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          appointmentId: string | null
          createdAt: string
          description: string | null
          expiresAt: string | null
          financialTransactionId: string | null
          id: string
          loyaltyCardId: string
          points: number
          tenantId: string
          type: Database["public"]["Enums"]["LoyaltyTransactionType"]
        }
        Insert: {
          appointmentId?: string | null
          createdAt?: string
          description?: string | null
          expiresAt?: string | null
          financialTransactionId?: string | null
          id: string
          loyaltyCardId: string
          points: number
          tenantId: string
          type: Database["public"]["Enums"]["LoyaltyTransactionType"]
        }
        Update: {
          appointmentId?: string | null
          createdAt?: string
          description?: string | null
          expiresAt?: string | null
          financialTransactionId?: string | null
          id?: string
          loyaltyCardId?: string
          points?: number
          tenantId?: string
          type?: Database["public"]["Enums"]["LoyaltyTransactionType"]
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_loyaltyCardId_fkey"
            columns: ["loyaltyCardId"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          channel: Database["public"]["Enums"]["MarketingChannel"]
          content: string | null
          createdAt: string
          description: string | null
          id: string
          metrics: Json | null
          name: string
          scheduledAt: string | null
          sentAt: string | null
          status: Database["public"]["Enums"]["CampaignStatus"]
          targetAudience: Json | null
          tenantId: string
          type: Database["public"]["Enums"]["CampaignType"]
          updatedAt: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["MarketingChannel"]
          content?: string | null
          createdAt?: string
          description?: string | null
          id: string
          metrics?: Json | null
          name: string
          scheduledAt?: string | null
          sentAt?: string | null
          status?: Database["public"]["Enums"]["CampaignStatus"]
          targetAudience?: Json | null
          tenantId: string
          type: Database["public"]["Enums"]["CampaignType"]
          updatedAt: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["MarketingChannel"]
          content?: string | null
          createdAt?: string
          description?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          scheduledAt?: string | null
          sentAt?: string | null
          status?: Database["public"]["Enums"]["CampaignStatus"]
          targetAudience?: Json | null
          tenantId?: string
          type?: Database["public"]["Enums"]["CampaignType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_consents: {
        Row: {
          channel: Database["public"]["Enums"]["MarketingChannel"]
          consented: boolean
          consentedAt: string | null
          createdAt: string
          customerId: string
          id: string
          revokedAt: string | null
          updatedAt: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["MarketingChannel"]
          consented?: boolean
          consentedAt?: string | null
          createdAt?: string
          customerId: string
          id: string
          revokedAt?: string | null
          updatedAt: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["MarketingChannel"]
          consented?: boolean
          consentedAt?: string | null
          createdAt?: string
          customerId?: string
          id?: string
          revokedAt?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_consents_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_dashboard: {
        Row: {
          created_at: string | null
          data_referencia: string
          horarios_pico: Json | null
          id: string
          novos_clientes: number
          servicos_populares: Json | null
          taxa_cancelamento: number
          tenant_id: string
          ticket_medio: number
          total_agendamentos: number
          total_vendas: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_referencia: string
          horarios_pico?: Json | null
          id?: string
          novos_clientes?: number
          servicos_populares?: Json | null
          taxa_cancelamento?: number
          tenant_id: string
          ticket_medio?: number
          total_agendamentos?: number
          total_vendas?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_referencia?: string
          horarios_pico?: Json | null
          id?: string
          novos_clientes?: number
          servicos_populares?: Json | null
          taxa_cancelamento?: number
          tenant_id?: string
          ticket_medio?: number
          total_agendamentos?: number
          total_vendas?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      negocios: {
        Row: {
          atualizado_em: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          criado_em: string | null
          data_fim_assinatura: string | null
          data_fim_teste: string | null
          descricao: string | null
          email_admin: string
          endereco: string | null
          estado: string | null
          fuso_horario: string | null
          id: string
          idioma: string | null
          latitude: number | null
          longitude: number | null
          moeda: string | null
          nome: string
          nome_fantasia: string | null
          numero: string | null
          razao_social: string | null
          slug: string
          status: string | null
          status_assinatura: string | null
          telefone: string | null
          url_logo: string | null
        }
        Insert: {
          atualizado_em?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          criado_em?: string | null
          data_fim_assinatura?: string | null
          data_fim_teste?: string | null
          descricao?: string | null
          email_admin: string
          endereco?: string | null
          estado?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          latitude?: number | null
          longitude?: number | null
          moeda?: string | null
          nome: string
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string | null
          slug: string
          status?: string | null
          status_assinatura?: string | null
          telefone?: string | null
          url_logo?: string | null
        }
        Update: {
          atualizado_em?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          criado_em?: string | null
          data_fim_assinatura?: string | null
          data_fim_teste?: string | null
          descricao?: string | null
          email_admin?: string
          endereco?: string | null
          estado?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          latitude?: number | null
          longitude?: number | null
          moeda?: string | null
          nome?: string
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string | null
          slug?: string
          status?: string | null
          status_assinatura?: string | null
          telefone?: string | null
          url_logo?: string | null
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed: boolean
          completedAt: string | null
          createdAt: string
          data: Json | null
          id: string
          step: string
          tenantId: string
          updatedAt: string
        }
        Insert: {
          completed?: boolean
          completedAt?: string | null
          createdAt?: string
          data?: Json | null
          id: string
          step: string
          tenantId: string
          updatedAt: string
        }
        Update: {
          completed?: boolean
          completedAt?: string | null
          createdAt?: string
          data?: Json | null
          id?: string
          step?: string
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          agendamento_id: string | null
          created_at: string | null
          data_pagamento: string | null
          id: string
          metodo_pagamento: string
          status: string
          tenant_id: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          id?: string
          metodo_pagamento: string
          status: string
          tenant_id: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          id?: string
          metodo_pagamento?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      partnership_deals: {
        Row: {
          createdAt: string
          description: string | null
          endDate: string | null
          id: string
          isActive: boolean
          partnerName: string
          startDate: string
          tenantId: string
          terms: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id: string
          isActive?: boolean
          partnerName: string
          startDate: string
          tenantId: string
          terms?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id?: string
          isActive?: boolean
          partnerName?: string
          startDate?: string
          tenantId?: string
          terms?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_deals_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          operation: string
          status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          operation: string
          status: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          operation?: string
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string | null
          customer_id: string | null
          expiry_date: string | null
          holder_name: string | null
          id: string
          is_default: boolean | null
          last_four: string | null
          metadata: Json | null
          provider: string
          provider_payment_method_id: string | null
          tenant_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          customer_id?: string | null
          expiry_date?: string | null
          holder_name?: string | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          provider: string
          provider_payment_method_id?: string | null
          tenant_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          customer_id?: string | null
          expiry_date?: string | null
          holder_name?: string | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          provider?: string
          provider_payment_method_id?: string | null
          tenant_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_providers: {
        Row: {
          client_id: string | null
          client_secret: string | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          provider_name: string
          tenant_id: string | null
          updated_at: string | null
          webhook_secret: string | null
        }
        Insert: {
          client_id?: string | null
          client_secret?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider_name: string
          tenant_id?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Update: {
          client_id?: string | null
          client_secret?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider_name?: string
          tenant_id?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_providers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_acesso: {
        Row: {
          acesso_agendamentos: boolean | null
          acesso_clientes: boolean | null
          acesso_configuracoes: boolean | null
          acesso_estoque: boolean | null
          acesso_financeiro: boolean | null
          acesso_marketing: boolean | null
          acesso_relatorios: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          e_administrador: boolean | null
          id: string
          id_negocio: string
          id_usuario: string
        }
        Insert: {
          acesso_agendamentos?: boolean | null
          acesso_clientes?: boolean | null
          acesso_configuracoes?: boolean | null
          acesso_estoque?: boolean | null
          acesso_financeiro?: boolean | null
          acesso_marketing?: boolean | null
          acesso_relatorios?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          e_administrador?: boolean | null
          id?: string
          id_negocio: string
          id_usuario: string
        }
        Update: {
          acesso_agendamentos?: boolean | null
          acesso_clientes?: boolean | null
          acesso_configuracoes?: boolean | null
          acesso_estoque?: boolean | null
          acesso_financeiro?: boolean | null
          acesso_marketing?: boolean | null
          acesso_relatorios?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          e_administrador?: boolean | null
          id?: string
          id_negocio?: string
          id_usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_acesso_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfis_acesso_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          createdAt: string
          description: string | null
          id: string
          module: string
          name: string
          tenantId: string
          updatedAt: string
        }
        Insert: {
          action: string
          createdAt?: string
          description?: string | null
          id: string
          module: string
          name: string
          tenantId: string
          updatedAt: string
        }
        Update: {
          action?: string
          createdAt?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          costPrice: number | null
          createdAt: string
          description: string | null
          id: string
          image: string | null
          isActive: boolean
          isSellable: boolean
          isService: boolean
          minStock: number | null
          name: string
          salePrice: number | null
          sku: string | null
          tenantId: string
          unit: Database["public"]["Enums"]["ProductUnit"]
          updatedAt: string
        }
        Insert: {
          barcode?: string | null
          costPrice?: number | null
          createdAt?: string
          description?: string | null
          id: string
          image?: string | null
          isActive?: boolean
          isSellable?: boolean
          isService?: boolean
          minStock?: number | null
          name: string
          salePrice?: number | null
          sku?: string | null
          tenantId: string
          unit?: Database["public"]["Enums"]["ProductUnit"]
          updatedAt: string
        }
        Update: {
          barcode?: string | null
          costPrice?: number | null
          createdAt?: string
          description?: string | null
          id?: string
          image?: string | null
          isActive?: boolean
          isSellable?: boolean
          isService?: boolean
          minStock?: number | null
          name?: string
          salePrice?: number | null
          sku?: string | null
          tenantId?: string
          unit?: Database["public"]["Enums"]["ProductUnit"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_commission_rules: {
        Row: {
          categoryId: string | null
          commissionRuleId: string
          createdAt: string
          endDate: string | null
          id: string
          isActive: boolean
          professionalId: string
          serviceId: string | null
          startDate: string | null
          updatedAt: string
        }
        Insert: {
          categoryId?: string | null
          commissionRuleId: string
          createdAt?: string
          endDate?: string | null
          id: string
          isActive?: boolean
          professionalId: string
          serviceId?: string | null
          startDate?: string | null
          updatedAt: string
        }
        Update: {
          categoryId?: string | null
          commissionRuleId?: string
          createdAt?: string
          endDate?: string | null
          id?: string
          isActive?: boolean
          professionalId?: string
          serviceId?: string | null
          startDate?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_commission_rules_commissionRuleId_fkey"
            columns: ["commissionRuleId"]
            isOneToOne: false
            referencedRelation: "commission_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_commission_rules_professionalId_fkey"
            columns: ["professionalId"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          createdAt: string
          customDuration: number | null
          customPrice: number | null
          id: string
          isActive: boolean
          professionalId: string
          serviceId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          customDuration?: number | null
          customPrice?: number | null
          id: string
          isActive?: boolean
          professionalId: string
          serviceId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          customDuration?: number | null
          customPrice?: number | null
          id?: string
          isActive?: boolean
          professionalId?: string
          serviceId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professionalId_fkey"
            columns: ["professionalId"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_services_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          avatar: string | null
          bio: string | null
          createdAt: string
          email: string | null
          establishmentId: string
          id: string
          isActive: boolean
          name: string
          phone: string | null
          tenantId: string
          updatedAt: string
          userId: string | null
          workingHours: Json | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          createdAt?: string
          email?: string | null
          establishmentId: string
          id: string
          isActive?: boolean
          name: string
          phone?: string | null
          tenantId: string
          updatedAt: string
          userId?: string | null
          workingHours?: Json | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          createdAt?: string
          email?: string | null
          establishmentId?: string
          id?: string
          isActive?: boolean
          name?: string
          phone?: string | null
          tenantId?: string
          updatedAt?: string
          userId?: string | null
          workingHours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_establishmentId_fkey"
            columns: ["establishmentId"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionals_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionals_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          createdAt: string
          id: string
          permissionId: string
          roleId: string
        }
        Insert: {
          createdAt?: string
          id: string
          permissionId: string
          roleId: string
        }
        Update: {
          createdAt?: string
          id?: string
          permissionId?: string
          roleId?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permissionId_fkey"
            columns: ["permissionId"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          isSystem: boolean
          name: string
          tenantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          isSystem?: boolean
          name: string
          tenantId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          isSystem?: boolean
          name?: string
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          color: string | null
          createdAt: string
          description: string | null
          icon: string | null
          id: string
          isActive: boolean
          name: string
          order: number
          tenantId: string
          updatedAt: string
        }
        Insert: {
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id: string
          isActive?: boolean
          name: string
          order?: number
          tenantId: string
          updatedAt: string
        }
        Update: {
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          isActive?: boolean
          name?: string
          order?: number
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_products: {
        Row: {
          createdAt: string
          id: string
          productId: string
          quantity: number
          serviceId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          productId: string
          quantity: number
          serviceId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          productId?: string
          quantity?: number
          serviceId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_products_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          allowOnlineBooking: boolean
          bufferTimeAfter: number | null
          bufferTimeBefore: number | null
          categoryId: string | null
          color: string | null
          cost: number | null
          createdAt: string
          description: string | null
          duration: number
          icon: string | null
          id: string
          image: string | null
          isActive: boolean
          maxDailyBookings: number | null
          name: string
          price: number
          tenantId: string
          updatedAt: string
        }
        Insert: {
          allowOnlineBooking?: boolean
          bufferTimeAfter?: number | null
          bufferTimeBefore?: number | null
          categoryId?: string | null
          color?: string | null
          cost?: number | null
          createdAt?: string
          description?: string | null
          duration: number
          icon?: string | null
          id: string
          image?: string | null
          isActive?: boolean
          maxDailyBookings?: number | null
          name: string
          price: number
          tenantId: string
          updatedAt: string
        }
        Update: {
          allowOnlineBooking?: boolean
          bufferTimeAfter?: number | null
          bufferTimeBefore?: number | null
          categoryId?: string | null
          color?: string | null
          cost?: number | null
          createdAt?: string
          description?: string | null
          duration?: number
          icon?: string | null
          id?: string
          image?: string | null
          isActive?: boolean
          maxDailyBookings?: number | null
          name?: string
          price?: number
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          comissao_percentual: number | null
          criado_em: string | null
          descricao: string | null
          duracao: number
          id: string
          id_categoria: string | null
          id_negocio: string
          ids_equipamentos: string[] | null
          imagem_url: string | null
          nome: string
          preco: number
          requer_equipamento: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          descricao?: string | null
          duracao: number
          id?: string
          id_categoria?: string | null
          id_negocio: string
          ids_equipamentos?: string[] | null
          imagem_url?: string | null
          nome: string
          preco: number
          requer_equipamento?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          descricao?: string | null
          duracao?: number
          id?: string
          id_categoria?: string | null
          id_negocio?: string
          ids_equipamentos?: string[] | null
          imagem_url?: string | null
          nome?: string
          preco?: number
          requer_equipamento?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_items: {
        Row: {
          batchNumber: string | null
          createdAt: string
          establishmentId: string
          expiryDate: string | null
          id: string
          productId: string
          quantity: number
          tenantId: string
          updatedAt: string
        }
        Insert: {
          batchNumber?: string | null
          createdAt?: string
          establishmentId: string
          expiryDate?: string | null
          id: string
          productId: string
          quantity: number
          tenantId: string
          updatedAt: string
        }
        Update: {
          batchNumber?: string | null
          createdAt?: string
          establishmentId?: string
          expiryDate?: string | null
          id?: string
          productId?: string
          quantity?: number
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_items_establishmentId_fkey"
            columns: ["establishmentId"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_items_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_items_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          batchNumber: string | null
          createdAt: string
          createdById: string | null
          establishmentId: string
          expiryDate: string | null
          id: string
          notes: string | null
          productId: string
          quantity: number
          reason: Database["public"]["Enums"]["MovementReason"]
          tenantId: string
          type: Database["public"]["Enums"]["MovementType"]
        }
        Insert: {
          batchNumber?: string | null
          createdAt?: string
          createdById?: string | null
          establishmentId: string
          expiryDate?: string | null
          id: string
          notes?: string | null
          productId: string
          quantity: number
          reason: Database["public"]["Enums"]["MovementReason"]
          tenantId: string
          type: Database["public"]["Enums"]["MovementType"]
        }
        Update: {
          batchNumber?: string | null
          createdAt?: string
          createdById?: string | null
          establishmentId?: string
          expiryDate?: string | null
          id?: string
          notes?: string | null
          productId?: string
          quantity?: number
          reason?: Database["public"]["Enums"]["MovementReason"]
          tenantId?: string
          type?: Database["public"]["Enums"]["MovementType"]
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          interval: string
          interval_count: number
          name: string
          price: number
          provider_plan_id: string | null
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval: string
          interval_count?: number
          name: string
          price: number
          provider_plan_id?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          interval_count?: number
          name?: string
          price?: number
          provider_plan_id?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          customer_id: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          plan_id: string | null
          provider_subscription_id: string | null
          start_date: string
          status: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_id?: string | null
          provider_subscription_id?: string | null
          start_date: string
          status: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_id?: string | null
          provider_subscription_id?: string | null
          start_date?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          createdAt: string
          customDomain: string | null
          id: string
          name: string
          planExpiresAt: string | null
          planId: string | null
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["TenantStatus"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          customDomain?: string | null
          id: string
          name: string
          planExpiresAt?: string | null
          planId?: string | null
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["TenantStatus"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          customDomain?: string | null
          id?: string
          name?: string
          planExpiresAt?: string | null
          planId?: string | null
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["TenantStatus"]
          updatedAt?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          atualizado_em: string | null
          comprovante_url: string | null
          criado_em: string | null
          criado_por: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          id: string
          id_agendamento: string | null
          id_categoria: string | null
          id_cliente: string | null
          id_negocio: string
          metodo_pagamento: string | null
          notas: string | null
          status: string | null
          tipo: string
          valor: number
        }
        Insert: {
          atualizado_em?: string | null
          comprovante_url?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          id_agendamento?: string | null
          id_categoria?: string | null
          id_cliente?: string | null
          id_negocio: string
          metodo_pagamento?: string | null
          notas?: string | null
          status?: string | null
          tipo: string
          valor: number
        }
        Update: {
          atualizado_em?: string | null
          comprovante_url?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          id_agendamento?: string | null
          id_categoria?: string | null
          id_cliente?: string | null
          id_negocio?: string
          metodo_pagamento?: string | null
          notas?: string | null
          status?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_agendamento_fkey"
            columns: ["id_agendamento"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          createdAt: string
          id: string
          roleId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          roleId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          roleId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          email: string
          id: string
          lastLogin: string | null
          name: string
          password: string
          phone: string | null
          refreshToken: string | null
          refreshTokenExpiresAt: string | null
          status: Database["public"]["Enums"]["UserStatus"]
          tenantId: string
          twoFactorEnabled: boolean
          twoFactorSecret: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          lastLogin?: string | null
          name: string
          password: string
          phone?: string | null
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          status?: Database["public"]["Enums"]["UserStatus"]
          tenantId: string
          twoFactorEnabled?: boolean
          twoFactorSecret?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          lastLogin?: string | null
          name?: string
          password?: string
          phone?: string | null
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          status?: Database["public"]["Enums"]["UserStatus"]
          tenantId?: string
          twoFactorEnabled?: boolean
          twoFactorSecret?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          atualizado_em: string | null
          cpf: string | null
          criado_em: string | null
          data_nascimento: string | null
          email: string
          funcao: string | null
          id: string
          id_negocio: string | null
          nome_completo: string
          senha_hash: string | null
          status: string | null
          telefone: string | null
          ultimo_acesso: string | null
          url_avatar: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cpf?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email: string
          funcao?: string | null
          id?: string
          id_negocio?: string | null
          nome_completo: string
          senha_hash?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          url_avatar?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cpf?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email?: string
          funcao?: string | null
          id?: string
          id_negocio?: string | null
          nome_completo?: string
          senha_hash?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          url_avatar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          provider: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_id: string
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          provider: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          provider?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_tenant: {
        Args: { tenant_id: string }
        Returns: boolean
      }
      clear_tenant_context: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_tenant_context: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_business_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      obter_metricas_periodo: {
        Args: { p_tenant_id: string; p_data_inicio: string; p_data_fim: string }
        Returns: {
          data_referencia: string
          total_agendamentos: number
          total_vendas: number
          ticket_medio: number
          taxa_cancelamento: number
          novos_clientes: number
          servicos_populares: Json
          horarios_pico: Json
        }[]
      }
      set_business_status: {
        Args: { business_id: string; new_status: string }
        Returns: boolean
      }
      set_tenant_context: {
        Args: { tenant_id: string }
        Returns: undefined
      }
      usuario_tem_acesso_ao_negocio: {
        Args: { id_negocio_verificar: string }
        Returns: boolean
      }
    }
    Enums: {
      AccountType: "CASH" | "BANK" | "CREDIT_CARD" | "PAYMENT_GATEWAY" | "OTHER"
      AppointmentSource: "STAFF" | "ONLINE" | "INTEGRATION"
      AppointmentStatus:
        | "SCHEDULED"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
      CampaignStatus: "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED"
      CampaignType:
        | "PROMOTION"
        | "ANNOUNCEMENT"
        | "REMINDER"
        | "BIRTHDAY"
        | "REACTIVATION"
        | "LOYALTY"
        | "CUSTOM"
      CommissionStatus: "PENDING" | "PAID" | "CANCELLED"
      CommissionType: "FIXED" | "PERCENTAGE" | "PROGRESSIVE"
      Gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY"
      IntegrationStatus: "ACTIVE" | "INACTIVE" | "ERROR"
      IntegrationType:
        | "PAYMENT_GATEWAY"
        | "CALENDAR"
        | "MESSAGING"
        | "ACCOUNTING"
        | "MARKETING"
        | "CUSTOM"
      LoyaltyAction:
        | "EARN_PER_VISIT"
        | "EARN_PER_SPEND"
        | "EARN_PER_SERVICE"
        | "EARN_PER_PRODUCT"
        | "EARN_PER_REFERRAL"
        | "REDEEM_DISCOUNT"
        | "REDEEM_FREE_SERVICE"
        | "REDEEM_FREE_PRODUCT"
        | "REDEEM_CUSTOM"
      LoyaltyTransactionType: "EARN" | "REDEEM" | "EXPIRE" | "ADJUST"
      MarketingChannel: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH"
      MovementReason:
        | "PURCHASE"
        | "SALE"
        | "RETURN"
        | "LOSS"
        | "EXPIRY"
        | "ADJUSTMENT"
        | "TRANSFER"
        | "SERVICE_USAGE"
        | "OTHER"
      MovementType: "IN" | "OUT" | "ADJUSTMENT"
      PaymentMethod:
        | "CASH"
        | "CREDIT_CARD"
        | "DEBIT_CARD"
        | "BANK_TRANSFER"
        | "PIX"
        | "BOLETO"
        | "ONLINE"
        | "OTHER"
      ProductUnit: "UNIT" | "KG" | "G" | "MG" | "L" | "ML" | "M" | "CM" | "MM"
      TenantStatus: "ACTIVE" | "SUSPENDED" | "CANCELLED" | "TRIAL"
      TransactionStatus: "PENDING" | "PAID" | "CANCELLED" | "PARTIAL"
      TransactionType: "INCOME" | "EXPENSE" | "TRANSFER"
      UserStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AccountType: ["CASH", "BANK", "CREDIT_CARD", "PAYMENT_GATEWAY", "OTHER"],
      AppointmentSource: ["STAFF", "ONLINE", "INTEGRATION"],
      AppointmentStatus: [
        "SCHEDULED",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      CampaignStatus: ["DRAFT", "SCHEDULED", "SENT", "CANCELLED"],
      CampaignType: [
        "PROMOTION",
        "ANNOUNCEMENT",
        "REMINDER",
        "BIRTHDAY",
        "REACTIVATION",
        "LOYALTY",
        "CUSTOM",
      ],
      CommissionStatus: ["PENDING", "PAID", "CANCELLED"],
      CommissionType: ["FIXED", "PERCENTAGE", "PROGRESSIVE"],
      Gender: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      IntegrationStatus: ["ACTIVE", "INACTIVE", "ERROR"],
      IntegrationType: [
        "PAYMENT_GATEWAY",
        "CALENDAR",
        "MESSAGING",
        "ACCOUNTING",
        "MARKETING",
        "CUSTOM",
      ],
      LoyaltyAction: [
        "EARN_PER_VISIT",
        "EARN_PER_SPEND",
        "EARN_PER_SERVICE",
        "EARN_PER_PRODUCT",
        "EARN_PER_REFERRAL",
        "REDEEM_DISCOUNT",
        "REDEEM_FREE_SERVICE",
        "REDEEM_FREE_PRODUCT",
        "REDEEM_CUSTOM",
      ],
      LoyaltyTransactionType: ["EARN", "REDEEM", "EXPIRE", "ADJUST"],
      MarketingChannel: ["EMAIL", "SMS", "WHATSAPP", "PUSH"],
      MovementReason: [
        "PURCHASE",
        "SALE",
        "RETURN",
        "LOSS",
        "EXPIRY",
        "ADJUSTMENT",
        "TRANSFER",
        "SERVICE_USAGE",
        "OTHER",
      ],
      MovementType: ["IN", "OUT", "ADJUSTMENT"],
      PaymentMethod: [
        "CASH",
        "CREDIT_CARD",
        "DEBIT_CARD",
        "BANK_TRANSFER",
        "PIX",
        "BOLETO",
        "ONLINE",
        "OTHER",
      ],
      ProductUnit: ["UNIT", "KG", "G", "MG", "L", "ML", "M", "CM", "MM"],
      TenantStatus: ["ACTIVE", "SUSPENDED", "CANCELLED", "TRIAL"],
      TransactionStatus: ["PENDING", "PAID", "CANCELLED", "PARTIAL"],
      TransactionType: ["INCOME", "EXPENSE", "TRANSFER"],
      UserStatus: ["ACTIVE", "INACTIVE", "SUSPENDED"],
    },
  },
} as const
