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
      businesses: {
        Row: {
          id: string
          name: string
          slug: string
          admin_email: string
          phone: string
          zip_code: string
          address: string
          address_number: string
          address_complement: string | null
          neighborhood: string
          city: string
          state: string
          latitude: number | null
          longitude: number | null
          logo_url: string | null
          description: string | null
          ein: string | null
          legal_name: string | null
          trade_name: string | null
          status: 'active' | 'inactive' | 'suspended'
          subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled'
          subscription_end_date: string | null
          trial_end_date: string | null
          timezone: string
          currency: string
          language: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          admin_email: string
          phone: string
          zip_code: string
          address: string
          address_number: string
          address_complement?: string | null
          neighborhood: string
          city: string
          state: string
          latitude?: number | null
          longitude?: number | null
          logo_url?: string | null
          description?: string | null
          ein?: string | null
          legal_name?: string | null
          trade_name?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          subscription_status?: 'trial' | 'active' | 'suspended' | 'cancelled'
          subscription_end_date?: string | null
          trial_end_date?: string | null
          timezone?: string
          currency?: string
          language?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          admin_email?: string
          phone?: string
          zip_code?: string
          address?: string
          address_number?: string
          address_complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          latitude?: number | null
          longitude?: number | null
          logo_url?: string | null
          description?: string | null
          ein?: string | null
          legal_name?: string | null
          trade_name?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          subscription_status?: 'trial' | 'active' | 'suspended' | 'cancelled'
          subscription_end_date?: string | null
          trial_end_date?: string | null
          timezone?: string
          currency?: string
          language?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      business_users: {
        Row: {
          id: string
          business_id: string
          user_id: string
          role: 'owner' | 'admin' | 'staff' | 'professional'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'staff' | 'professional'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'staff' | 'professional'
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          business_id: string
          name: string
          email: string
          phone: string
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          address: string | null
          address_number: string | null
          address_complement: string | null
          neighborhood: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          notes: string | null
          preferences: Json
          status: 'active' | 'inactive' | 'blocked'
          last_appointment: string | null
          total_appointments: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          email: string
          phone: string
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          neighborhood?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          notes?: string | null
          preferences?: Json
          status?: 'active' | 'inactive' | 'blocked'
          last_appointment?: string | null
          total_appointments?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          email?: string
          phone?: string
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          neighborhood?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          notes?: string | null
          preferences?: Json
          status?: 'active' | 'inactive' | 'blocked'
          last_appointment?: string | null
          total_appointments?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_business_stats: {
        Args: {
          business_id: string
        }
        Returns: {
          total_clients: number
          total_appointments: number
          total_revenue: number
          active_professionals: number
        }
      }
      get_client_stats: {
        Args: {
          client_id: string
        }
        Returns: {
          total_appointments: number
          total_spent: number
          average_appointment_value: number
          last_appointment_date: string | null
          favorite_service: string | null
          favorite_professional: string | null
          no_show_count: number
          cancellation_count: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 