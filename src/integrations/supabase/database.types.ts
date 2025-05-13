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
          status: string | null
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
          status?: string | null
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
          status?: string | null
          working_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add additional tables as needed
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
