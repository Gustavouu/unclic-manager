
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          business_id: string | null
          client_id: string
          professional_id: string
          date: string
          start_time: string
          end_time: string
          duration: number
          total_price: number
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          payment_method: string | null
          notes: string | null
          reminder_sent: boolean | null
          rating: number | null
          feedback_comment: string | null
          notification_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id?: string | null
          client_id: string
          professional_id: string
          date: string
          start_time: string
          end_time: string
          duration: number
          total_price: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          payment_method?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          rating?: number | null
          feedback_comment?: string | null
          notification_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string | null
          client_id?: string
          professional_id?: string
          date?: string
          start_time?: string
          end_time?: string
          duration?: number
          total_price?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          payment_method?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          rating?: number | null
          feedback_comment?: string | null
          notification_config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      appointment_services: {
        Row: {
          id: string
          appointment_id: string
          service_id: string
          price: number
          duration: number
          discount: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          service_id: string
          price: number
          duration: number
          discount?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          service_id?: string
          price?: number
          duration?: number
          discount?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_settings: {
        Row: {
          id: string
          business_id: string
          allow_remote_queue: boolean
          remote_queue_limit: number
          require_advance_payment: boolean
          minimum_notice_time: number
          maximum_days_in_advance: number
          allow_simultaneous_appointments: boolean
          require_manual_confirmation: boolean
          block_no_show_clients: boolean
          send_email_confirmation: boolean
          send_reminders: boolean
          reminder_hours: number
          send_followup_message: boolean
          followup_hours: number
          cancellation_policy_hours: number
          no_show_fee: number
          primary_color: string
          secondary_color: string
          logo_url: string | null
          banner_url: string | null
          cancellation_policy: string
          cancellation_message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          allow_remote_queue?: boolean
          remote_queue_limit?: number
          require_advance_payment?: boolean
          minimum_notice_time?: number
          maximum_days_in_advance?: number
          allow_simultaneous_appointments?: boolean
          require_manual_confirmation?: boolean
          block_no_show_clients?: boolean
          send_email_confirmation?: boolean
          send_reminders?: boolean
          reminder_hours?: number
          send_followup_message?: boolean
          followup_hours?: number
          cancellation_policy_hours?: number
          no_show_fee?: number
          primary_color?: string
          secondary_color?: string
          logo_url?: string | null
          banner_url?: string | null
          cancellation_policy?: string
          cancellation_message?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          allow_remote_queue?: boolean
          remote_queue_limit?: number
          require_advance_payment?: boolean
          minimum_notice_time?: number
          maximum_days_in_advance?: number
          allow_simultaneous_appointments?: boolean
          require_manual_confirmation?: boolean
          block_no_show_clients?: boolean
          send_email_confirmation?: boolean
          send_reminders?: boolean
          reminder_hours?: number
          send_followup_message?: boolean
          followup_hours?: number
          cancellation_policy_hours?: number
          no_show_fee?: number
          primary_color?: string
          secondary_color?: string
          logo_url?: string | null
          banner_url?: string | null
          cancellation_policy?: string
          cancellation_message?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_users: {
        Row: {
          id: string
          business_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          slug: string
          admin_email: string
          phone: string | null
          zip_code: string | null
          address: string | null
          address_number: string | null
          address_complement: string | null
          neighborhood: string | null
          city: string | null
          state: string | null
          latitude: number | null
          longitude: number | null
          logo_url: string | null
          description: string | null
          ein: string | null
          legal_name: string | null
          trade_name: string | null
          status: string
          subscription_status: string
          subscription_end_date: string | null
          trial_end_date: string
          timezone: string
          currency: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          admin_email: string
          phone?: string | null
          zip_code?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          neighborhood?: string | null
          city?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          logo_url?: string | null
          description?: string | null
          ein?: string | null
          legal_name?: string | null
          trade_name?: string | null
          status?: string
          subscription_status?: string
          subscription_end_date?: string | null
          trial_end_date?: string
          timezone?: string
          currency?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          admin_email?: string
          phone?: string | null
          zip_code?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          neighborhood?: string | null
          city?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          logo_url?: string | null
          description?: string | null
          ein?: string | null
          legal_name?: string | null
          trade_name?: string | null
          status?: string
          subscription_status?: string
          subscription_end_date?: string | null
          trial_end_date?: string
          timezone?: string
          currency?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          business_id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          birth_date: string | null
          gender: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          notes: string | null
          last_visit: string | null
          total_spent: number | null
          preferences: Json | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          gender?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          notes?: string | null
          last_visit?: string | null
          total_spent?: number | null
          preferences?: Json | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          gender?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          notes?: string | null
          last_visit?: string | null
          total_spent?: number | null
          preferences?: Json | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_accounts: {
        Row: {
          id: string
          business_id: string
          establishment_id: string
          name: string
          type: string
          bank: string | null
          agency: string | null
          account_number: string | null
          description: string | null
          initial_balance: number
          current_balance: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          establishment_id: string
          name: string
          type: string
          bank?: string | null
          agency?: string | null
          account_number?: string | null
          description?: string | null
          initial_balance?: number
          current_balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          establishment_id?: string
          name?: string
          type?: string
          bank?: string | null
          agency?: string | null
          account_number?: string | null
          description?: string | null
          initial_balance?: number
          current_balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      financial_categories: {
        Row: {
          id: string
          business_id: string
          name: string
          parent_id: string | null
          type: string
          color: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          parent_id?: string | null
          type: string
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          parent_id?: string | null
          type?: string
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          business_id: string
          user_id: string
          resource: string
          action: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          resource: string
          action: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          resource?: string
          action?: string
          created_at?: string
          updated_at?: string
        }
      }
      professional_services: {
        Row: {
          id: string
          professional_id: string
          service_id: string
          custom_price: number | null
          custom_duration: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          service_id: string
          custom_price?: number | null
          custom_duration?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          service_id?: string
          custom_price?: number | null
          custom_duration?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          business_id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          position: string | null
          bio: string | null
          photo_url: string | null
          specialties: string[] | null
          commission_percentage: number | null
          hire_date: string | null
          status: string
          working_hours: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          position?: string | null
          bio?: string | null
          photo_url?: string | null
          specialties?: string[] | null
          commission_percentage?: number | null
          hire_date?: string | null
          status?: string
          working_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          position?: string | null
          bio?: string | null
          photo_url?: string | null
          specialties?: string[] | null
          commission_percentage?: number | null
          hire_date?: string | null
          status?: string
          working_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          birth_date: string | null
          tax_id: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          birth_date?: string | null
          tax_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          birth_date?: string | null
          tax_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          color: string | null
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          color?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          color?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          category_id: string | null
          name: string
          description: string | null
          duration: number
          price: number
          cost: number | null
          commission_percentage: number | null
          is_active: boolean
          allow_online_booking: boolean
          buffer_time_before: number | null
          buffer_time_after: number | null
          color: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          category_id?: string | null
          name: string
          description?: string | null
          duration: number
          price: number
          cost?: number | null
          commission_percentage?: number | null
          is_active?: boolean
          allow_online_booking?: boolean
          buffer_time_before?: number | null
          buffer_time_after?: number | null
          color?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          duration?: number
          price?: number
          cost?: number | null
          commission_percentage?: number | null
          is_active?: boolean
          allow_online_booking?: boolean
          buffer_time_before?: number | null
          buffer_time_after?: number | null
          color?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          business_id: string
          account_id: string
          category_id: string | null
          appointment_id: string | null
          client_id: string | null
          description: string | null
          amount: number
          type: string
          status: string
          payment_method: string | null
          payment_gateway_id: string | null
          payment_gateway_data: Json | null
          due_date: string | null
          payment_date: string | null
          document: string | null
          notes: string | null
          created_by_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          account_id: string
          category_id?: string | null
          appointment_id?: string | null
          client_id?: string | null
          description?: string | null
          amount: number
          type: string
          status: string
          payment_method?: string | null
          payment_gateway_id?: string | null
          payment_gateway_data?: Json | null
          due_date?: string | null
          payment_date?: string | null
          document?: string | null
          notes?: string | null
          created_by_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          account_id?: string
          category_id?: string | null
          appointment_id?: string | null
          client_id?: string | null
          description?: string | null
          amount?: number
          type?: string
          status?: string
          payment_method?: string | null
          payment_gateway_id?: string | null
          payment_gateway_data?: Json | null
          due_date?: string | null
          payment_date?: string | null
          document?: string | null
          notes?: string | null
          created_by_id?: string | null
          created_at?: string
          updated_at?: string
        }
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
        Args: {
          business_id: string
          new_status: string
        }
        Returns: boolean
      }
      user_belongs_to_business: {
        Args: {
          business_id: string
        }
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
      appointment_status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"
    }
  }
}
