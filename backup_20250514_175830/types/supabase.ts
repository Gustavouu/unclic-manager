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
      users: {
        Row: {
          id: string
          business_id: string
          email: string
          name: string
          role: 'admin' | 'professional' | 'receptionist'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          email: string
          name: string
          role: 'admin' | 'professional' | 'receptionist'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          email?: string
          name?: string
          role?: 'admin' | 'professional' | 'receptionist'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          cnpj: string | null
          email: string | null
          phone: string | null
          address: Json | null
          settings: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cnpj?: string | null
          email?: string | null
          phone?: string | null
          address?: Json | null
          settings?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string | null
          email?: string | null
          phone?: string | null
          address?: Json | null
          settings?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          business_id: string
          name: string
          email: string | null
          phone: string | null
          birth_date: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          duration: number
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration: number
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
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
          email: string
          phone: string | null
          specialties: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          specialties: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          specialties?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      professional_schedules: {
        Row: {
          id: string
          professional_id: string
          day_of_week: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          day_of_week: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
          start_time: string
          end_time: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          day_of_week?: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          business_id: string
          client_id: string
          professional_id: string
          service_id: string
          date_time: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          price: number
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          client_id: string
          professional_id: string
          service_id: string
          date_time: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          price: number
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          client_id?: string
          professional_id?: string
          service_id?: string
          date_time?: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          price?: number
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_settings: {
        Row: {
          id: string
          business_id: string
          company_name: string
          business_hours: Json
          appointment_interval: number
          min_advance_time: number
          max_advance_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          company_name: string
          business_hours: Json
          appointment_interval: number
          min_advance_time: number
          max_advance_time: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          company_name?: string
          business_hours?: Json
          appointment_interval?: number
          min_advance_time?: number
          max_advance_time?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 