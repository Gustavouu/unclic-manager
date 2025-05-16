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
      appointment_services: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          discount: number | null
          duration: number
          id: string
          notes: string | null
          price: number
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          discount?: number | null
          duration: number
          id?: string
          notes?: string | null
          price: number
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          discount?: number | null
          duration?: number
          id?: string
          notes?: string | null
          price?: number
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          business_id: string | null
          client_id: string | null
          created_at: string | null
          date: string
          duration: number
          end_time: string
          feedback_comment: string | null
          id: string
          notes: string | null
          notification_config: Json | null
          payment_method: string | null
          professional_id: string | null
          rating: number | null
          reminder_sent: boolean | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          total_price: number
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          client_id?: string | null
          created_at?: string | null
          date: string
          duration: number
          end_time: string
          feedback_comment?: string | null
          id?: string
          notes?: string | null
          notification_config?: Json | null
          payment_method?: string | null
          professional_id?: string | null
          rating?: number | null
          reminder_sent?: boolean | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          total_price: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          client_id?: string | null
          created_at?: string | null
          date?: string
          duration?: number
          end_time?: string
          feedback_comment?: string | null
          id?: string
          notes?: string | null
          notification_config?: Json | null
          payment_method?: string | null
          professional_id?: string | null
          rating?: number | null
          reminder_sent?: boolean | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          allow_remote_queue: boolean | null
          allow_simultaneous_appointments: boolean | null
          banner_url: string | null
          block_no_show_clients: boolean | null
          business_id: string | null
          cancellation_message: string | null
          cancellation_policy: string | null
          cancellation_policy_hours: number | null
          created_at: string | null
          followup_hours: number | null
          id: string
          logo_url: string | null
          maximum_days_in_advance: number | null
          minimum_notice_time: number | null
          no_show_fee: number | null
          primary_color: string | null
          reminder_hours: number | null
          remote_queue_limit: number | null
          require_advance_payment: boolean | null
          require_manual_confirmation: boolean | null
          secondary_color: string | null
          send_email_confirmation: boolean | null
          send_followup_message: boolean | null
          send_reminders: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_remote_queue?: boolean | null
          allow_simultaneous_appointments?: boolean | null
          banner_url?: string | null
          block_no_show_clients?: boolean | null
          business_id?: string | null
          cancellation_message?: string | null
          cancellation_policy?: string | null
          cancellation_policy_hours?: number | null
          created_at?: string | null
          followup_hours?: number | null
          id?: string
          logo_url?: string | null
          maximum_days_in_advance?: number | null
          minimum_notice_time?: number | null
          no_show_fee?: number | null
          primary_color?: string | null
          reminder_hours?: number | null
          remote_queue_limit?: number | null
          require_advance_payment?: boolean | null
          require_manual_confirmation?: boolean | null
          secondary_color?: string | null
          send_email_confirmation?: boolean | null
          send_followup_message?: boolean | null
          send_reminders?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_remote_queue?: boolean | null
          allow_simultaneous_appointments?: boolean | null
          banner_url?: string | null
          block_no_show_clients?: boolean | null
          business_id?: string | null
          cancellation_message?: string | null
          cancellation_policy?: string | null
          cancellation_policy_hours?: number | null
          created_at?: string | null
          followup_hours?: number | null
          id?: string
          logo_url?: string | null
          maximum_days_in_advance?: number | null
          minimum_notice_time?: number | null
          no_show_fee?: number | null
          primary_color?: string | null
          reminder_hours?: number | null
          remote_queue_limit?: number | null
          require_advance_payment?: boolean | null
          require_manual_confirmation?: boolean | null
          secondary_color?: string | null
          send_email_confirmation?: boolean | null
          send_followup_message?: boolean | null
          send_reminders?: boolean | null
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
          business_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
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
      clients: {
        Row: {
          address: string | null
          birth_date: string | null
          business_id: string | null
          city: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          id: string
          last_visit: string | null
          name: string
          notes: string | null
          phone: string | null
          preferences: Json | null
          state: string | null
          tags: string[] | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          business_id?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          preferences?: Json | null
          state?: string | null
          tags?: string[] | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          business_id?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          preferences?: Json | null
          state?: string | null
          tags?: string[] | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          account_number: string | null
          agency: string | null
          bank: string | null
          business_id: string | null
          created_at: string | null
          current_balance: number | null
          description: string | null
          establishment_id: string
          id: string
          initial_balance: number | null
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          agency?: string | null
          bank?: string | null
          business_id?: string | null
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          establishment_id: string
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          agency?: string | null
          bank?: string | null
          business_id?: string | null
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          establishment_id?: string
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          business_id: string | null
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          business_id: string | null
          created_at: string | null
          id: string
          resource: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          resource: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          resource?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          created_at: string | null
          custom_duration: number | null
          custom_price: number | null
          id: string
          is_active: boolean | null
          professional_id: string | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_duration?: number | null
          custom_price?: number | null
          id?: string
          is_active?: boolean | null
          professional_id?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_duration?: number | null
          custom_price?: number | null
          id?: string
          is_active?: boolean | null
          professional_id?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          bio: string | null
          business_id: string | null
          commission_percentage: number | null
          created_at: string | null
          email: string | null
          hire_date: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          position: string | null
          specialties: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          working_hours: Json | null
        }
        Insert: {
          bio?: string | null
          business_id?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          working_hours?: Json | null
        }
        Update: {
          bio?: string | null
          business_id?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          business_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          allow_online_booking: boolean | null
          buffer_time_after: number | null
          buffer_time_before: number | null
          business_id: string | null
          category_id: string | null
          color: string | null
          commission_percentage: number | null
          cost: number | null
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
          allow_online_booking?: boolean | null
          buffer_time_after?: number | null
          buffer_time_before?: number | null
          business_id?: string | null
          category_id?: string | null
          color?: string | null
          commission_percentage?: number | null
          cost?: number | null
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
          allow_online_booking?: boolean | null
          buffer_time_after?: number | null
          buffer_time_before?: number | null
          business_id?: string | null
          category_id?: string | null
          color?: string | null
          commission_percentage?: number | null
          cost?: number | null
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
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          appointment_id: string | null
          business_id: string | null
          category_id: string | null
          client_id: string | null
          created_at: string | null
          created_by_id: string | null
          description: string | null
          document: string | null
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_gateway_data: Json | null
          payment_gateway_id: string | null
          payment_method: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          appointment_id?: string | null
          business_id?: string | null
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by_id?: string | null
          description?: string | null
          document?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_gateway_data?: Json | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          status: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          appointment_id?: string | null
          business_id?: string | null
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by_id?: string | null
          description?: string | null
          document?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_gateway_data?: Json | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_current_business: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_business_status: {
        Args: { business_id: string; new_status: string }
        Returns: boolean
      }
      user_belongs_to_business: {
        Args: { business_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          business_id: string
          resource_name: string
          action_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "staff" | "professional"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
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
      app_role: ["owner", "admin", "staff", "professional"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
    },
  },
} as const
