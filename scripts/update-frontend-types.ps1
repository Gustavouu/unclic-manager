# Funções de log
function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "Green"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Log $Message "Red"
    exit 1
}

function Write-Warning {
    param([string]$Message)
    Write-Log $Message "Yellow"
}

# Verificar se está no diretório raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Error "Por favor, execute este script do diretório raiz do projeto."
}

# Criar diretório de backup se não existir
$backupDir = "backups/frontend_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Fazer backup dos arquivos
Write-Log "Fazendo backup dos arquivos..."
$directories = @(
    "src/services",
    "src/types",
    "src/lib"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Copy-Item -Path $dir -Destination "$backupDir/$dir" -Recurse -Force
    }
}

# Atualizar tipos
Write-Log "Atualizando tipos..."

# business.ts
$businessTypesContent = @'
export interface Business {
    id: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    country: string
    postal_code: string
    logo_url?: string
    website?: string
    description?: string
    created_at: string
    updated_at: string
}

export interface BusinessSettings {
    id: string
    business_id: string
    working_hours: {
        [key: string]: {
            start: string
            end: string
            is_working_day: boolean
        }
    }
    appointment_duration: number
    break_duration: number
    allow_same_day_appointments: boolean
    allow_future_appointments: boolean
    max_future_days: number
    require_confirmation: boolean
    send_reminders: boolean
    reminder_time: number
    created_at: string
    updated_at: string
}

export interface User {
    id: string
    business_id: string
    email: string
    name: string
    role: 'admin' | 'manager' | 'professional'
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Client {
    id: string
    business_id: string
    email: string
    name: string
    phone: string
    address?: string
    city?: string
    state?: string
    country?: string
    postal_code?: string
    notes?: string
    created_at: string
    updated_at: string
}

export interface Service {
    id: string
    business_id: string
    name: string
    description?: string
    duration: number
    price: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Professional {
    id: string
    business_id: string
    user_id: string
    name: string
    email: string
    phone: string
    specialties?: string[]
    bio?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface ProfessionalSchedule {
    id: string
    professional_id: string
    day_of_week: number
    start_time: string
    end_time: string
    is_working_day: boolean
    created_at: string
    updated_at: string
}

export interface Appointment {
    id: string
    business_id: string
    client_id: string
    professional_id: string
    service_id: string
    start_time: string
    end_time: string
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
    notes?: string
    created_at: string
    updated_at: string
}
'@

# supabase.ts
$supabaseTypesContent = @'
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
          allow_same_day_appointments: boolean
          allow_future_appointments: boolean
          max_future_days: number
          require_confirmation: boolean
          send_reminders: boolean
          reminder_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          working_hours: Json
          appointment_duration: number
          break_duration: number
          allow_same_day_appointments?: boolean
          allow_future_appointments?: boolean
          max_future_days?: number
          require_confirmation?: boolean
          send_reminders?: boolean
          reminder_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          working_hours?: Json
          appointment_duration?: number
          break_duration?: number
          allow_same_day_appointments?: boolean
          allow_future_appointments?: boolean
          max_future_days?: number
          require_confirmation?: boolean
          send_reminders?: boolean
          reminder_time?: number
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
          email: string
          name: string
          phone: string
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
          email: string
          name: string
          phone: string
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
          email?: string
          name?: string
          phone?: string
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
          user_id: string
          name: string
          email: string
          phone: string
          specialties: string[] | null
          bio: string | null
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
          is_working_day?: boolean
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
'@

# Criar diretórios se não existirem
$directories = @(
    "src/services",
    "src/types",
    "src/lib"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Atualizar arquivos
$files = @{
    "src/types/business.ts" = $businessTypesContent
    "src/types/supabase.ts" = $supabaseTypesContent
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Force
    Write-Log "Arquivo atualizado: $($file.Key)"
}

Write-Log "`nAtualização concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se todos os tipos foram atualizados corretamente"
Write-Log "2. Verifique se os tipos estão sendo usados corretamente nos serviços"
Write-Log "3. Verifique se os tipos estão sendo usados corretamente nos componentes"
Write-Log "4. Teste todas as funcionalidades da aplicação para garantir que tudo está funcionando corretamente"
Write-Log "5. Em caso de problemas, restaure o backup em: $backupDir" 