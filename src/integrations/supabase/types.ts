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
      Appointments: {
        Row: {
          booking_date: string
          business_id: string
          client_id: string
          created_at: string | null
          duration: number
          employee_id: string
          end_time: string
          feedback_comment: string | null
          id: string
          notes: string | null
          payment_method: string | null
          price: number
          rating: number | null
          reminder_sent: boolean | null
          service_id: string
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          business_id: string
          client_id: string
          created_at?: string | null
          duration: number
          employee_id: string
          end_time: string
          feedback_comment?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          price?: number
          rating?: number | null
          reminder_sent?: boolean | null
          service_id: string
          start_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          business_id?: string
          client_id?: string
          created_at?: string | null
          duration?: number
          employee_id?: string
          end_time?: string
          feedback_comment?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          price?: number
          rating?: number | null
          reminder_sent?: boolean | null
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointments_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          table_name: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          table_name: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          business_id: string
          client_id: string
          created_at: string | null
          duration: number
          employee_id: string
          end_time: string
          error_messages: Json | null
          feedback_comment: string | null
          id: string
          notes: string | null
          payment_method: string | null
          price: number
          rating: number | null
          reminder_sent: boolean | null
          service_id: string
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          business_id: string
          client_id: string
          created_at?: string | null
          duration?: number
          employee_id: string
          end_time: string
          error_messages?: Json | null
          feedback_comment?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          price?: number
          rating?: number | null
          reminder_sent?: boolean | null
          service_id: string
          start_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          business_id?: string
          client_id?: string
          created_at?: string | null
          duration?: number
          employee_id?: string
          end_time?: string
          error_messages?: Json | null
          feedback_comment?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          price?: number
          rating?: number | null
          reminder_sent?: boolean | null
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_bookings_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_analysis: {
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
        Relationships: []
      }
      business_settings: {
        Row: {
          allow_online_booking: boolean | null
          banner_url: string | null
          business_id: string
          created_at: string | null
          id: string
          logo_url: string | null
          maximum_days_in_advance: number | null
          minimum_notice_time: number | null
          notes: Json | null
          primary_color: string | null
          require_advance_payment: boolean | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          allow_online_booking?: boolean | null
          banner_url?: string | null
          business_id: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          maximum_days_in_advance?: number | null
          minimum_notice_time?: number | null
          notes?: Json | null
          primary_color?: string | null
          require_advance_payment?: boolean | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_online_booking?: boolean | null
          banner_url?: string | null
          business_id?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          maximum_days_in_advance?: number | null
          minimum_notice_time?: number | null
          notes?: Json | null
          primary_color?: string | null
          require_advance_payment?: boolean | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_users: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          role: string
          role_id: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          role?: string
          role_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          role?: string
          role_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          address_complement: string | null
          address_number: string | null
          admin_email: string
          city: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          ein: string | null
          error_messages: Json | null
          id: string
          language: string | null
          latitude: number | null
          legal_name: string | null
          logo_url: string | null
          longitude: number | null
          name: string
          neighborhood: string | null
          phone: string | null
          slug: string
          state: string | null
          status: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          timezone: string | null
          trade_name: string | null
          trial_end_date: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          admin_email: string
          city?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          ein?: string | null
          error_messages?: Json | null
          id?: string
          language?: string | null
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          phone?: string | null
          slug: string
          state?: string | null
          status?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          timezone?: string | null
          trade_name?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          admin_email?: string
          city?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          ein?: string | null
          error_messages?: Json | null
          id?: string
          language?: string | null
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          phone?: string | null
          slug?: string
          state?: string | null
          status?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          timezone?: string | null
          trade_name?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          business_id: string
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          birth_date: string | null
          business_id: string
          city: string | null
          created_at: string | null
          email: string | null
          error_messages: Json | null
          gender: string | null
          id: string
          last_visit: string | null
          name: string
          notes: string | null
          phone: string | null
          preferences: Json | null
          state: string | null
          status: string | null
          total_spent: number | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          business_id: string
          city?: string | null
          created_at?: string | null
          email?: string | null
          error_messages?: Json | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          preferences?: Json | null
          state?: string | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          business_id?: string
          city?: string | null
          created_at?: string | null
          email?: string | null
          error_messages?: Json | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferences?: Json | null
          state?: string | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clients_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
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
            foreignKeyName: "commissions_professionalId_fkey"
            columns: ["professionalId"]
            isOneToOne: false
            referencedRelation: "professionals"
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
        Relationships: []
      }
      integrations: {
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
        Relationships: []
      }
      inventory: {
        Row: {
          barcode: string | null
          business_id: string
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_equipment: boolean | null
          last_restock_date: string | null
          location: string | null
          min_quantity: number | null
          name: string
          quantity: number
          sale_price: number | null
          sku: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          business_id: string
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_equipment?: boolean | null
          last_restock_date?: string | null
          location?: string | null
          min_quantity?: number | null
          name: string
          quantity?: number
          sale_price?: number | null
          sku?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          business_id?: string
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_equipment?: boolean | null
          last_restock_date?: string | null
          location?: string | null
          min_quantity?: number | null
          name?: string
          quantity?: number
          sale_price?: number | null
          sku?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
            referencedRelation: "users"
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          business_id: string
          created_at: string | null
          id: string
          payment_date: string | null
          payment_method: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          business_id: string
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          business_id?: string
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          module: string
          name: Database["public"]["Enums"]["permission_type"]
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          module: string
          name: Database["public"]["Enums"]["permission_type"]
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          module?: string
          name?: Database["public"]["Enums"]["permission_type"]
        }
        Relationships: []
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
      professionals: {
        Row: {
          avatar: string | null
          avatar_url: string | null
          bio: string | null
          business_id: string
          createdAt: string
          email: string | null
          establishmentId: string
          id: string
          isActive: boolean
          name: string
          phone: string | null
          rating: number | null
          status: string | null
          tenantId: string
          total_reviews: number | null
          updatedAt: string
          userId: string | null
          working_hours: Json | null
          workingHours: Json | null
        }
        Insert: {
          avatar?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_id: string
          createdAt?: string
          email?: string | null
          establishmentId: string
          id: string
          isActive?: boolean
          name: string
          phone?: string | null
          rating?: number | null
          status?: string | null
          tenantId: string
          total_reviews?: number | null
          updatedAt: string
          userId?: string | null
          working_hours?: Json | null
          workingHours?: Json | null
        }
        Update: {
          avatar?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_id?: string
          createdAt?: string
          email?: string | null
          establishmentId?: string
          id?: string
          isActive?: boolean
          name?: string
          phone?: string | null
          rating?: number | null
          status?: string | null
          tenantId?: string
          total_reviews?: number | null
          updatedAt?: string
          userId?: string | null
          working_hours?: Json | null
          workingHours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
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
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_name: Database["public"]["Enums"]["permission_type"]
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_name: Database["public"]["Enums"]["permission_type"]
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_name?: Database["public"]["Enums"]["permission_type"]
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_name_fkey"
            columns: ["permission_name"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          role_type: Database["public"]["Enums"]["role_type"]
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          role_type?: Database["public"]["Enums"]["role_type"]
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          role_type?: Database["public"]["Enums"]["role_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          action: string
          business_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          success: boolean | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          success?: boolean | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          success?: boolean | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
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
        ]
      }
      services: {
        Row: {
          business_id: string
          category: string | null
          commission_percentage: number | null
          created_at: string | null
          description: string | null
          duration: number
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          category?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          category?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
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
        Relationships: []
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
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
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
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          business_id: string
          category_id: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          receipt_url: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          business_id: string
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          business_id?: string
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
        Relationships: []
      }
      users: {
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
        Relationships: []
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
        Relationships: []
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
      check_data_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          issue_type: string
          issue_count: number
          description: string
        }[]
      }
      clean_existing_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clear_tenant_context: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_default_roles_for_business: {
        Args: { business_id_param: string }
        Returns: undefined
      }
      ensure_user_business_access: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fetch_agendamentos: {
        Args: { business_id_param: string }
        Returns: Json[]
      }
      get_appointments_with_details: {
        Args: { p_business_id: string }
        Returns: {
          id: string
          business_id: string
          client_id: string
          client_name: string
          employee_id: string
          employee_name: string
          service_id: string
          service_name: string
          booking_date: string
          start_time: string
          end_time: string
          duration: number
          price: number
          status: string
          notes: string
          payment_method: string
          created_at: string
        }[]
      }
      get_business_metrics: {
        Args: { p_business_id: string }
        Returns: Json
      }
      get_current_tenant_context: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_error_message: {
        Args: { error_code: string; default_message?: string }
        Returns: string
      }
      get_user_business_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_business_id_safe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_business_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_permissions: {
        Args: { user_id_param: string; business_id_param: string }
        Returns: Database["public"]["Enums"]["permission_type"][]
      }
      get_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      log_security_audit: {
        Args: {
          action_param: string
          table_name_param?: string
          record_id_param?: string
          old_values_param?: Json
          new_values_param?: Json
          business_id_param?: string
        }
        Returns: undefined
      }
      migrate_all_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_businesses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_clients: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      normalize_status: {
        Args: { status_value: string }
        Returns: string
      }
      obter_metricas_periodo: {
        Args:
          | { business_id_param: string; periodo?: string }
          | { p_tenant_id: string; p_data_inicio: string; p_data_fim: string }
        Returns: Json
      }
      set_business_status: {
        Args: { business_id: string; new_status: string }
        Returns: boolean
      }
      set_tenant_context: {
        Args: { tenant_id: string }
        Returns: undefined
      }
      sync_legacy_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      user_belongs_to_business_secure: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      user_belongs_to_tenant: {
        Args: { tenant_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          permission_name: Database["public"]["Enums"]["permission_type"]
          business_id_param?: string
        }
        Returns: boolean
      }
      user_has_permission_on_resource: {
        Args: { resource_name: string }
        Returns: boolean
      }
      user_has_role: {
        Args: { role_name: string }
        Returns: boolean
      }
      user_is_admin_for_tenant: {
        Args: { tenant_id: string }
        Returns: boolean
      }
      usuario_tem_acesso_ao_negocio: {
        Args: { id_negocio_verificar: string }
        Returns: boolean
      }
      validate_email: {
        Args: { email_text: string }
        Returns: boolean
      }
      validate_phone: {
        Args: { phone_text: string }
        Returns: boolean
      }
      validate_zip_code: {
        Args: { zip_text: string }
        Returns: boolean
      }
      verificar_completar_onboarding: {
        Args: { business_id_param: string }
        Returns: Json
      }
      verificar_completar_onboarding_v2: {
        Args: { business_id_param: string }
        Returns: Json
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
      permission_type:
        | "appointments.view"
        | "appointments.create"
        | "appointments.edit"
        | "appointments.delete"
        | "clients.view"
        | "clients.create"
        | "clients.edit"
        | "clients.delete"
        | "services.view"
        | "services.create"
        | "services.edit"
        | "services.delete"
        | "professionals.view"
        | "professionals.create"
        | "professionals.edit"
        | "professionals.delete"
        | "financial.view"
        | "financial.create"
        | "financial.edit"
        | "financial.delete"
        | "reports.view"
        | "inventory.view"
        | "inventory.create"
        | "inventory.edit"
        | "inventory.delete"
        | "settings.view"
        | "settings.edit"
        | "admin.full_access"
      ProductUnit: "UNIT" | "KG" | "G" | "MG" | "L" | "ML" | "M" | "CM" | "MM"
      role_type: "owner" | "admin" | "manager" | "staff" | "professional"
      TenantStatus: "ACTIVE" | "SUSPENDED" | "CANCELLED" | "TRIAL"
      TransactionStatus: "PENDING" | "PAID" | "CANCELLED" | "PARTIAL"
      TransactionType: "INCOME" | "EXPENSE" | "TRANSFER"
      user_status: "active" | "inactive" | "blocked" | "pending"
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
      permission_type: [
        "appointments.view",
        "appointments.create",
        "appointments.edit",
        "appointments.delete",
        "clients.view",
        "clients.create",
        "clients.edit",
        "clients.delete",
        "services.view",
        "services.create",
        "services.edit",
        "services.delete",
        "professionals.view",
        "professionals.create",
        "professionals.edit",
        "professionals.delete",
        "financial.view",
        "financial.create",
        "financial.edit",
        "financial.delete",
        "reports.view",
        "inventory.view",
        "inventory.create",
        "inventory.edit",
        "inventory.delete",
        "settings.view",
        "settings.edit",
        "admin.full_access",
      ],
      ProductUnit: ["UNIT", "KG", "G", "MG", "L", "ML", "M", "CM", "MM"],
      role_type: ["owner", "admin", "manager", "staff", "professional"],
      TenantStatus: ["ACTIVE", "SUSPENDED", "CANCELLED", "TRIAL"],
      TransactionStatus: ["PENDING", "PAID", "CANCELLED", "PARTIAL"],
      TransactionType: ["INCOME", "EXPENSE", "TRANSFER"],
      user_status: ["active", "inactive", "blocked", "pending"],
      UserStatus: ["ACTIVE", "INACTIVE", "SUSPENDED"],
    },
  },
} as const
