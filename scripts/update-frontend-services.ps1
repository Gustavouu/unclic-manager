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

# Atualizar serviços
Write-Log "Atualizando serviços..."

# businessService.ts
$businessServiceContent = @'
import { supabase } from '@/lib/supabase'
import type { Business, BusinessSettings, User, Client, Service, Professional, ProfessionalSchedule, Appointment } from '@/types/business'

export class BusinessService {
    async getBusiness(id: string): Promise<Business | null> {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async getBusinessSettings(businessId: string): Promise<BusinessSettings | null> {
        const { data, error } = await supabase
            .from('business_settings')
            .select('*')
            .eq('business_id', businessId)
            .single()

        if (error) throw error
        return data
    }

    async updateBusinessSettings(businessId: string, settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
        const { data, error } = await supabase
            .from('business_settings')
            .update(settings)
            .eq('business_id', businessId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async getUsers(businessId: string): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('business_id', businessId)

        if (error) throw error
        return data
    }

    async getClients(businessId: string): Promise<Client[]> {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', businessId)

        if (error) throw error
        return data
    }

    async getServices(businessId: string): Promise<Service[]> {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('business_id', businessId)

        if (error) throw error
        return data
    }

    async getProfessionals(businessId: string): Promise<Professional[]> {
        const { data, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('business_id', businessId)

        if (error) throw error
        return data
    }

    async getProfessionalSchedules(professionalId: string): Promise<ProfessionalSchedule[]> {
        const { data, error } = await supabase
            .from('professional_schedules')
            .select('*')
            .eq('professional_id', professionalId)

        if (error) throw error
        return data
    }

    async getAppointments(businessId: string): Promise<Appointment[]> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('business_id', businessId)

        if (error) throw error
        return data
    }
}
'@

# clientService.ts
$clientServiceContent = @'
import { supabase } from '@/lib/supabase'
import type { Client } from '@/types/business'

export class ClientService {
    async getClient(id: string): Promise<Client | null> {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
        const { data, error } = await supabase
            .from('clients')
            .insert(client)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async updateClient(id: string, client: Partial<Client>): Promise<Client> {
        const { data, error } = await supabase
            .from('clients')
            .update(client)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async deleteClient(id: string): Promise<void> {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
'@

# serviceService.ts
$serviceServiceContent = @'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/types/business'

export class ServiceService {
    async getService(id: string): Promise<Service | null> {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
        const { data, error } = await supabase
            .from('services')
            .insert(service)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async updateService(id: string, service: Partial<Service>): Promise<Service> {
        const { data, error } = await supabase
            .from('services')
            .update(service)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async deleteService(id: string): Promise<void> {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
'@

# professionalService.ts
$professionalServiceContent = @'
import { supabase } from '@/lib/supabase'
import type { Professional, ProfessionalSchedule } from '@/types/business'

export class ProfessionalService {
    async getProfessional(id: string): Promise<Professional | null> {
        const { data, error } = await supabase
            .from('professionals')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async createProfessional(professional: Omit<Professional, 'id' | 'created_at' | 'updated_at'>): Promise<Professional> {
        const { data, error } = await supabase
            .from('professionals')
            .insert(professional)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async updateProfessional(id: string, professional: Partial<Professional>): Promise<Professional> {
        const { data, error } = await supabase
            .from('professionals')
            .update(professional)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async deleteProfessional(id: string): Promise<void> {
        const { error } = await supabase
            .from('professionals')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    async getSchedule(professionalId: string): Promise<ProfessionalSchedule[]> {
        const { data, error } = await supabase
            .from('professional_schedules')
            .select('*')
            .eq('professional_id', professionalId)

        if (error) throw error
        return data
    }

    async updateSchedule(schedule: ProfessionalSchedule[]): Promise<ProfessionalSchedule[]> {
        const { data, error } = await supabase
            .from('professional_schedules')
            .upsert(schedule)
            .select()

        if (error) throw error
        return data
    }
}
'@

# appointmentService.ts
$appointmentServiceContent = @'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/types/business'

export class AppointmentService {
    async getAppointment(id: string): Promise<Appointment | null> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }

    async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
        const { data, error } = await supabase
            .from('appointments')
            .insert(appointment)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
        const { data, error } = await supabase
            .from('appointments')
            .update(appointment)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    async deleteAppointment(id: string): Promise<void> {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id)

        if (error) throw error
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
    "src/services/businessService.ts" = $businessServiceContent
    "src/services/clientService.ts" = $clientServiceContent
    "src/services/serviceService.ts" = $serviceServiceContent
    "src/services/professionalService.ts" = $professionalServiceContent
    "src/services/appointmentService.ts" = $appointmentServiceContent
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Force
    Write-Log "Arquivo atualizado: $($file.Key)"
}

Write-Log "`nAtualização concluída!"
Write-Log "Recomendações:"
Write-Log "1. Verifique se todos os serviços foram atualizados corretamente"
Write-Log "2. Verifique se todos os tipos foram atualizados corretamente"
Write-Log "3. Verifique se o cliente Supabase foi atualizado corretamente"
Write-Log "4. Teste todas as funcionalidades da aplicação para garantir que tudo está funcionando corretamente"
Write-Log "5. Em caso de problemas, restaure o backup em: $backupDir" 