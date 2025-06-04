
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "./types";
import { useTenant } from "@/contexts/TenantContext";

// Dados de exemplo para quando não há dados reais
const createSampleAppointments = (businessId: string): Appointment[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: "sample-1",
      clientId: "sample-client-1",
      clientName: "Maria Silva",
      serviceId: "sample-service-1",
      serviceName: "Corte e Escova",
      serviceType: "hair",
      professionalId: "sample-prof-1",
      professionalName: "Ana Santos",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      duration: 60,
      price: 80,
      status: "agendado" as AppointmentStatus,
      notes: "Cliente preferencial",
      paymentMethod: "pix",
      businessId: businessId,
    },
    {
      id: "sample-2",
      clientId: "sample-client-2",
      clientName: "João Santos",
      serviceId: "sample-service-2",
      serviceName: "Corte Masculino",
      serviceType: "haircut",
      professionalId: "sample-prof-2",
      professionalName: "Carlos Mendes",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
      duration: 45,
      price: 50,
      status: "confirmado" as AppointmentStatus,
      notes: "",
      paymentMethod: "dinheiro",
      businessId: businessId,
    },
    {
      id: "sample-3",
      clientId: "sample-client-3",
      clientName: "Patricia Costa",
      serviceId: "sample-service-3",
      serviceName: "Manicure",
      serviceType: "nails",
      professionalId: "sample-prof-1",
      professionalName: "Ana Santos",
      date: tomorrow,
      duration: 60,
      price: 40,
      status: "agendado" as AppointmentStatus,
      notes: "Esmalte vermelho",
      paymentMethod: "cartao",
      businessId: businessId,
    },
    {
      id: "sample-4",
      clientId: "sample-client-4",
      clientName: "Roberto Lima",
      serviceId: "sample-service-4",
      serviceName: "Barba",
      serviceType: "barber",
      professionalId: "sample-prof-2",
      professionalName: "Carlos Mendes",
      date: nextWeek,
      duration: 30,
      price: 35,
      status: "agendado" as AppointmentStatus,
      notes: "",
      businessId: businessId,
    },
    {
      id: "sample-5",
      clientId: "sample-client-5",
      clientName: "Fernanda Oliveira",
      serviceId: "sample-service-5",
      serviceName: "Hidratação Capilar",
      serviceType: "treatment",
      professionalId: "sample-prof-1",
      professionalName: "Ana Santos",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 16, 0),
      duration: 90,
      price: 120,
      status: "concluido" as AppointmentStatus,
      notes: "Tratamento para cabelos danificados",
      paymentMethod: "pix",
      businessId: businessId,
    }
  ];
};

export function useAppointmentsFetch() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchAppointments = useCallback(async () => {
    if (!businessId) {
      console.log('No business ID available, using sample data');
      const sampleData = createSampleAppointments('sample-business');
      setAppointments(sampleData);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching appointments for business ID:', businessId);
      
      // Tentar buscar da tabela bookings primeiro
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          clients (*),
          services_v2 (*),
          employees (*)
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: false });
          
      if (bookingsError) {
        console.error('Error fetching from bookings:', bookingsError);
        
        // Se falhar, tentar da tabela Appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('Appointments')
          .select(`
            *,
            clientes:id_cliente (*),
            servicos:id_servico (*),
            funcionarios:id_funcionario (*)
          `)
          .eq('id_negocio', businessId)
          .order('data', { ascending: false })
          .order('hora_inicio', { ascending: false });
        
        if (appointmentsError) {
          console.warn('No data found in database tables, using sample data');
          const sampleData = createSampleAppointments(businessId);
          setAppointments(sampleData);
          setIsLoading(false);
          return;
        }
        
        // Mapear dados da tabela Appointments
        if (appointmentsData && appointmentsData.length > 0) {
          const mappedAppointments: Appointment[] = appointmentsData.map((appointment: any) => ({
            id: appointment.id,
            clientId: appointment.id_cliente,
            clientName: appointment.clientes?.nome || 'Cliente',
            serviceId: appointment.id_servico,
            serviceName: appointment.servicos?.nome || 'Serviço',
            serviceType: appointment.servicos?.categoria || 'service',
            professionalId: appointment.id_funcionario,
            professionalName: appointment.funcionarios?.nome || 'Profissional',
            date: new Date(`${appointment.data}T${appointment.hora_inicio}`),
            duration: appointment.duracao,
            price: appointment.valor,
            status: mapStatusFromDb(appointment.status),
            notes: appointment.observacoes || '',
            paymentMethod: appointment.forma_pagamento,
            businessId: appointment.id_negocio,
          }));
          
          setAppointments(mappedAppointments);
          console.log('Successfully mapped', mappedAppointments.length, 'appointments from Appointments table');
        } else {
          // Se não há dados, usar dados de exemplo
          const sampleData = createSampleAppointments(businessId);
          setAppointments(sampleData);
          console.log('No appointments found, using sample data');
        }
      } else {
        // Mapear dados da tabela bookings
        if (bookingsData && bookingsData.length > 0) {
          const mappedAppointments: Appointment[] = bookingsData.map((booking: any) => ({
            id: booking.id,
            clientId: booking.client_id,
            clientName: booking.clients?.name || 'Cliente',
            serviceId: booking.service_id,
            serviceName: booking.services_v2?.name || 'Serviço',
            serviceType: booking.services_v2?.category || 'service',
            professionalId: booking.employee_id,
            professionalName: booking.employees?.name || 'Profissional',
            date: new Date(`${booking.booking_date}T${booking.start_time}`),
            duration: booking.duration,
            price: booking.price,
            status: mapStatusFromDb(booking.status),
            notes: booking.notes || '',
            paymentMethod: booking.payment_method,
            businessId: booking.business_id,
          }));
          
          setAppointments(mappedAppointments);
          console.log('Successfully mapped', mappedAppointments.length, 'appointments from bookings table');
        } else {
          // Se não há dados, usar dados de exemplo
          const sampleData = createSampleAppointments(businessId);
          setAppointments(sampleData);
          console.log('No bookings found, using sample data');
        }
      }
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
      
      // Em caso de erro, usar dados de exemplo
      const sampleData = createSampleAppointments(businessId || 'sample-business');
      setAppointments(sampleData);
      console.log('Error occurred, using sample data');
      
      toast.error("Erro ao carregar agendamentos, exibindo dados de exemplo");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  // Buscar dados quando o componente é montado
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    setAppointments,
    isLoading,
    error,
    fetchAppointments,
  };
}

function mapStatusFromDb(status: string): AppointmentStatus {
  const statusMap: Record<string, AppointmentStatus> = {
    'scheduled': 'agendado',
    'confirmed': 'confirmado',
    'completed': 'concluido',
    'canceled': 'cancelado',
    'cancelled': 'cancelado',
    'no_show': 'faltou',
    'agendado': 'agendado',
    'confirmado': 'confirmado',
    'concluido': 'concluido',
    'cancelado': 'cancelado',
    'faltou': 'faltou',
  };
  return statusMap[status?.toLowerCase()] || 'agendado';
}
