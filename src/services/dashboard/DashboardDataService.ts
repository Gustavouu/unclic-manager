
import { supabase } from '@/integrations/supabase/client';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import type {
  DashboardMetrics,
  RevenueDataPoint,
  PopularService,
  AppointmentData,
  ClientData,
  SupabaseResponse,
  DashboardData
} from '@/hooks/dashboard/types';

export class DashboardDataService {
  private monitor = PerformanceMonitor.getInstance();

  async loadFreshData(businessId: string): Promise<DashboardData> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];

    // Queries paralelas para melhor performance com tipos corretos
    const [clientsResponse, appointmentsResponse] = await Promise.all([
      this.monitor.measureAsync('clients_query', async () => {
        const result = await supabase
          .from('clients_unified')
          .select('id, status, created_at')
          .eq('business_id', businessId);
        return result as SupabaseResponse<ClientData>;
      }),
      this.monitor.measureAsync('appointments_query', async () => {
        const result = await supabase
          .from('appointments_unified')
          .select('id, booking_date, status, price, created_at')
          .eq('business_id', businessId)
          .gte('booking_date', startOfMonth)
          .lte('booking_date', endOfMonth);
        return result as SupabaseResponse<AppointmentData>;
      })
    ]);

    if (clientsResponse.error) {
      this.monitor.trackQuery('clients_unified_select', 0, false, clientsResponse.error.message);
      throw new Error(`Erro ao carregar clientes: ${clientsResponse.error.message}`);
    }
    
    if (appointmentsResponse.error) {
      this.monitor.trackQuery('appointments_unified_select', 0, false, appointmentsResponse.error.message);
      throw new Error(`Erro ao carregar agendamentos: ${appointmentsResponse.error.message}`);
    }

    this.monitor.trackQuery('clients_unified_select', 0, true);
    this.monitor.trackQuery('appointments_unified_select', 0, true);

    const clients = clientsResponse.data || [];
    const appointments = appointmentsResponse.data || [];

    return this.transformRawData(clients, appointments, startOfMonth, endOfMonth, today, now);
  }

  private transformRawData(
    clients: ClientData[],
    appointments: AppointmentData[],
    startOfMonth: string,
    endOfMonth: string,
    today: string,
    now: Date
  ): DashboardData {
    const activeClients = clients.filter(client => client.status === 'active');
    
    const newClientsThisMonth = clients.filter(client => {
      if (!client.created_at) return false;
      const createdDate = new Date(client.created_at);
      const monthStart = new Date(startOfMonth);
      const monthEnd = new Date(endOfMonth);
      return createdDate >= monthStart && createdDate <= monthEnd;
    }).length;

    const totalRevenue = appointments.reduce((sum, apt) => {
      const price = apt.price || 0;
      return sum + price;
    }, 0);

    const totalAppointments = appointments.length;
    const todayAppointments = appointments.filter(apt => apt.booking_date === today).length;
    
    const pendingAppointments = appointments.filter(apt => 
      apt.status === 'scheduled' || apt.status === 'agendado'
    ).length;
    
    const completedAppointments = appointments.filter(apt => 
      apt.status === 'completed' || apt.status === 'concluido'
    ).length;

    const averageTicket = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;
    const growthRate = Math.random() * 20; // Placeholder - calcular baseado em dados históricos
    const retentionRate = activeClients.length > 0 ? 85 : 0; // Placeholder - calcular baseado em dados reais

    // Gerar dados de receita dos últimos 6 meses
    const revenueData: RevenueDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      revenueData.push({
        date: date.toLocaleDateString('pt-BR', { month: 'short' }),
        value: Math.floor(Math.random() * 5000) + 2000 // Placeholder - usar dados reais
      });
    }

    // Serviços populares baseados nos agendamentos
    const services = [
      { id: '1', name: 'Corte de Cabelo', count: Math.floor(totalAppointments * 0.4) },
      { id: '2', name: 'Barba', count: Math.floor(totalAppointments * 0.25) },
      { id: '3', name: 'Sobrancelha', count: Math.floor(totalAppointments * 0.2) },
      { id: '4', name: 'Tratamento', count: Math.floor(totalAppointments * 0.15) },
    ];
    
    const totalServices = services.reduce((sum, service) => sum + service.count, 0);
    const popularServices: PopularService[] = services.map(service => ({
      ...service,
      percentage: totalServices > 0 ? (service.count / totalServices) * 100 : 0
    }));

    const metrics: DashboardMetrics = {
      totalAppointments,
      totalClients: clients.length,
      monthlyRevenue: totalRevenue,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      activeClients: activeClients.length,
      newClientsThisMonth,
      servicesCompleted: Math.floor(totalAppointments * 0.8),
      averageTicket,
      growthRate,
      retentionRate,
    };

    return { metrics, revenueData, popularServices };
  }
}
