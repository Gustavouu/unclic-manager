#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${2:-$GREEN}$1${NC}"
}

# Função para erro
error() {
    log "$1" "$RED"
    exit 1
}

# Função para aviso
warn() {
    log "$1" "$YELLOW"
}

# Verificar se está no diretório raiz do projeto
if [ ! -f "package.json" ]; then
    error "Por favor, execute este script do diretório raiz do projeto."
fi

# Criar backup dos arquivos
log "Criando backup dos arquivos..."
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="backup_${timestamp}"

mkdir -p "$backup_dir"
cp -r src/services "$backup_dir/"
cp -r src/types "$backup_dir/"
cp -r src/lib "$backup_dir/"

# Atualizar serviços
log "Atualizando serviços..."

# Atualizar businessService.ts
cat > src/services/businessService.ts << 'EOL'
import { supabase } from '@/lib/supabase';
import { Business, BusinessSettings } from '@/types/business';

export class BusinessService {
  static async getBusiness(businessId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessSettings(businessId: string): Promise<BusinessSettings | null> {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusinessSettings(
    businessId: string,
    settings: Partial<BusinessSettings>
  ): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from('business_settings')
      .update(settings)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessUsers(businessId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessClients(businessId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessServices(businessId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessProfessionals(businessId: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessAppointments(businessId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        professional:professionals(*),
        service:services(*)
      `)
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createBusiness(business: Partial<Business>): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .insert(business)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusiness(
    businessId: string,
    business: Partial<Business>
  ): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .update(business)
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBusiness(businessId: string): Promise<void> {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId);

    if (error) throw error;
  }
}
EOL

# Atualizar clientService.ts
cat > src/services/clientService.ts << 'EOL'
import { supabase } from '@/lib/supabase';
import { Client } from '@/types/business';

export class ClientService {
  static async getClient(clientId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getClients(businessId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createClient(client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateClient(
    clientId: string,
    client: Partial<Client>
  ): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  }
}
EOL

# Atualizar serviceService.ts
cat > src/services/serviceService.ts << 'EOL'
import { supabase } from '@/lib/supabase';
import { Service } from '@/types/business';

export class ServiceService {
  static async getService(serviceId: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getServices(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createService(service: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateService(
    serviceId: string,
    service: Partial<Service>
  ): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
  }
}
EOL

# Atualizar professionalService.ts
cat > src/services/professionalService.ts << 'EOL'
import { supabase } from '@/lib/supabase';
import { Professional, ProfessionalSchedule } from '@/types/business';

export class ProfessionalService {
  static async getProfessional(professionalId: string): Promise<Professional | null> {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getProfessionals(businessId: string): Promise<Professional[]> {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createProfessional(professional: Partial<Professional>): Promise<Professional> {
    const { data, error } = await supabase
      .from('professionals')
      .insert(professional)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProfessional(
    professionalId: string,
    professional: Partial<Professional>
  ): Promise<Professional> {
    const { data, error } = await supabase
      .from('professionals')
      .update(professional)
      .eq('id', professionalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProfessional(professionalId: string): Promise<void> {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', professionalId);

    if (error) throw error;
  }

  static async getSchedules(professionalId: string): Promise<ProfessionalSchedule[]> {
    const { data, error } = await supabase
      .from('professional_schedules')
      .select('*')
      .eq('professional_id', professionalId);

    if (error) throw error;
    return data;
  }

  static async createSchedule(schedule: Partial<ProfessionalSchedule>): Promise<ProfessionalSchedule> {
    const { data, error } = await supabase
      .from('professional_schedules')
      .insert(schedule)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSchedule(
    scheduleId: string,
    schedule: Partial<ProfessionalSchedule>
  ): Promise<ProfessionalSchedule> {
    const { data, error } = await supabase
      .from('professional_schedules')
      .update(schedule)
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSchedule(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .from('professional_schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) throw error;
  }
}
EOL

# Atualizar appointmentService.ts
cat > src/services/appointmentService.ts << 'EOL'
import { supabase } from '@/lib/supabase';
import { Appointment } from '@/types/business';

export class AppointmentService {
  static async getAppointment(appointmentId: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        professional:professionals(*),
        service:services(*)
      `)
      .eq('id', appointmentId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getAppointments(businessId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        professional:professionals(*),
        service:services(*)
      `)
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAppointment(
    appointmentId: string,
    appointment: Partial<Appointment>
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAppointment(appointmentId: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) throw error;
  }
}
EOL

log "Serviços atualizados com sucesso!"
log "Backup disponível em: $backup_dir"
log "Recomendações:"
log "1. Verifique se todos os serviços estão funcionando corretamente"
log "2. Atualize os componentes que usam esses serviços"
log "3. Teste todas as funcionalidades principais"
log "4. Verifique se os tipos estão corretos" 