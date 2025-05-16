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
          email: string
          phone: string
          address: string
          city: string
          state: string
          country: string
          postal_code: string
          logo_url: string | null
          website: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          country: string
          postal_code: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          country?: string
          postal_code?: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_settings: {
        Row: {
          id: string
          business_id: string
          working_hours: Json
          appointment_duration: number
          break_duration: number
          max_appointments_per_day: number
          allow_same_day_appointments: boolean
          allow_weekend_appointments: boolean
          notification_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          working_hours: Json
          appointment_duration: number
          break_duration: number
          max_appointments_per_day: number
          allow_same_day_appointments: boolean
          allow_weekend_appointments: boolean
          notification_settings: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          working_hours?: Json
          appointment_duration?: number
          break_duration?: number
          max_appointments_per_day?: number
          allow_same_day_appointments?: boolean
          allow_weekend_appointments?: boolean
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          business_id: string
          email: string
          name: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          email: string
          name: string
          role: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          email?: string
          name?: string
          role?: string
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
          email: string
          phone: string
          birth_date: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          notes: string | null
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
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          notes?: string | null
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
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          notes?: string | null
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
          color: string | null
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
          color?: string | null
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
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          business_id: string
          user_id: string
          name: string
          email: string
          phone: string
          specialties: string[] | null
          bio: string | null
          photo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          name: string
          email: string
          phone: string
          specialties?: string[] | null
          bio?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          specialties?: string[] | null
          bio?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      professional_schedules: {
        Row: {
          id: string
          professional_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_working_day: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_working_day: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_working_day?: boolean
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
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          client_id: string
          professional_id: string
          service_id: string
          start_time: string
          end_time: string
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          client_id?: string
          professional_id?: string
          service_id?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
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