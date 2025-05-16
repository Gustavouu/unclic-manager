import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabase: SupabaseClient;
  }
}

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
          address: string
          logo_url: string | null
          status: 'pending' | 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          admin_email: string
          phone: string
          address: string
          logo_url?: string | null
          status?: 'pending' | 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          admin_email?: string
          phone?: string
          address?: string
          logo_url?: string | null
          status?: 'pending' | 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      business_users: {
        Row: {
          id: string
          business_id: string
          user_id: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_business_status: {
        Args: {
          business_id: string
          new_status: 'pending' | 'active' | 'inactive'
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 