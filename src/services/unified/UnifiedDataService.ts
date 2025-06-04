
import { supabase } from '@/integrations/supabase/client';
import { OptimizedCache, CacheKeys } from '../cache/OptimizedCache';
import type { 
  UnifiedClient, 
  UnifiedAppointment, 
  UnifiedService, 
  UnifiedEmployee 
} from '@/types/unified';

export class UnifiedDataService {
  private static instance: UnifiedDataService;
  private cache = OptimizedCache.getInstance();

  private constructor() {}

  public static getInstance(): UnifiedDataService {
    if (!UnifiedDataService.instance) {
      UnifiedDataService.instance = new UnifiedDataService();
    }
    return UnifiedDataService.instance;
  }

  // Clients
  async getClients(businessId: string, useCache = true): Promise<UnifiedClient[]> {
    const cacheKey = CacheKeys.CLIENTS(businessId);
    
    if (useCache) {
      const cached = this.cache.get<UnifiedClient[]>(cacheKey);
      if (cached) return cached;
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id_negocio', businessId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    const clients = (data || []).map(this.normalizeClient);
    this.cache.set(cacheKey, clients);
    
    return clients;
  }

  async getClient(clientId: string, useCache = true): Promise<UnifiedClient | null> {
    const cacheKey = CacheKeys.CLIENT(clientId);
    
    if (useCache) {
      const cached = this.cache.get<UnifiedClient>(cacheKey);
      if (cached) return cached;
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) return null;

    const client = this.normalizeClient(data);
    this.cache.set(cacheKey, client);
    
    return client;
  }

  async createClient(businessId: string, clientData: Partial<UnifiedClient>): Promise<UnifiedClient> {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        id_negocio: businessId,
        business_id: businessId,
        nome: clientData.name,
        name: clientData.name,
        email: clientData.email,
        telefone: clientData.phone,
        phone: clientData.phone,
        data_nascimento: clientData.birth_date,
        birth_date: clientData.birth_date,
        genero: clientData.gender,
        gender: clientData.gender,
        endereco: clientData.address,
        address: clientData.address,
        cidade: clientData.city,
        city: clientData.city,
        estado: clientData.state,
        state: clientData.state,
        cep: clientData.zip_code,
        zip_code: clientData.zip_code,
        notas: clientData.notes,
        notes: clientData.notes,
        status: clientData.status || 'active',
        valor_total_gasto: 0,
        total_spent: 0,
        preferencias: clientData.preferences || {},
      })
      .select()
      .single();

    if (error) throw error;

    const client = this.normalizeClient(data);
    
    // Invalidate cache
    this.cache.invalidate(`clients:${businessId}`);
    
    return client;
  }

  // Appointments
  async getAppointments(businessId: string, date?: string, useCache = true): Promise<UnifiedAppointment[]> {
    const cacheKey = CacheKeys.APPOINTMENTS(businessId, date);
    
    if (useCache) {
      const cached = this.cache.get<UnifiedAppointment[]>(cacheKey);
      if (cached) return cached;
    }

    let query = supabase
      .from('bookings')
      .select(`
        *,
        clients!inner(nome, name),
        services(nome, name),
        employees(nome, name)
      `)
      .eq('business_id', businessId);

    if (date) {
      query = query.eq('booking_date', date);
    }

    const { data, error } = await query.order('booking_date', { ascending: true });

    if (error) throw error;

    const appointments = (data || []).map(this.normalizeAppointment);
    this.cache.set(cacheKey, appointments, 2 * 60 * 1000); // 2 minutes for appointments
    
    return appointments;
  }

  // Services
  async getServices(businessId: string, useCache = true): Promise<UnifiedService[]> {
    const cacheKey = CacheKeys.SERVICES(businessId);
    
    if (useCache) {
      const cached = this.cache.get<UnifiedService[]>(cacheKey);
      if (cached) return cached;
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .or(`business_id.eq.${businessId},id_negocio.eq.${businessId}`)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    const services = (data || []).map(this.normalizeService);
    this.cache.set(cacheKey, services);
    
    return services;
  }

  // Employees
  async getEmployees(businessId: string, useCache = true): Promise<UnifiedEmployee[]> {
    const cacheKey = CacheKeys.EMPLOYEES(businessId);
    
    if (useCache) {
      const cached = this.cache.get<UnifiedEmployee[]>(cacheKey);
      if (cached) return cached;
    }

    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id_negocio', businessId)
      .order('nome');

    if (error) throw error;

    const employees = (data || []).map(this.normalizeEmployee);
    this.cache.set(cacheKey, employees);
    
    return employees;
  }

  // Normalization methods
  private normalizeClient(data: any): UnifiedClient {
    return {
      id: data.id,
      business_id: data.business_id || data.id_negocio,
      name: data.nome || data.name || '',
      email: data.email || '',
      phone: data.telefone || data.phone || '',
      birth_date: data.data_nascimento || data.birth_date || '',
      gender: data.genero || data.gender || '',
      address: data.endereco || data.address || '',
      city: data.cidade || data.city || '',
      state: data.estado || data.state || '',
      zip_code: data.cep || data.zip_code || '',
      notes: data.notas || data.notes || '',
      status: data.status || 'active',
      total_spent: data.valor_total_gasto || data.total_spent || 0,
      last_visit: data.ultima_visita || data.last_visit,
      preferences: data.preferencias || data.preferences || {},
      created_at: data.criado_em || data.created_at,
      updated_at: data.atualizado_em || data.updated_at,
    };
  }

  private normalizeAppointment(data: any): UnifiedAppointment {
    return {
      id: data.id,
      business_id: data.business_id,
      client_id: data.client_id,
      service_id: data.service_id,
      employee_id: data.employee_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      duration: data.duration,
      price: data.price,
      status: data.status,
      notes: data.notes || '',
      payment_method: data.payment_method,
      rating: data.rating,
      feedback_comment: data.feedback_comment,
      reminder_sent: data.reminder_sent || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  private normalizeService(data: any): UnifiedService {
    return {
      id: data.id,
      business_id: data.business_id || data.id_negocio,
      name: data.nome || data.name || '',
      description: data.descricao || data.description || '',
      price: data.preco || data.price || 0,
      duration: data.duracao || data.duration || 60,
      category: data.category || 'Geral',
      is_active: data.is_active ?? data.ativo ?? true,
      image_url: data.image_url || data.imagem_url || '',
      created_at: data.criado_em || data.created_at,
      updated_at: data.atualizado_em || data.updated_at,
    };
  }

  private normalizeEmployee(data: any): UnifiedEmployee {
    return {
      id: data.id,
      business_id: data.business_id || data.id_negocio,
      name: data.nome || data.name || '',
      email: data.email || '',
      phone: data.telefone || data.phone || '',
      position: data.cargo || data.position || '',
      bio: data.bio || '',
      photo_url: data.foto_url || data.photo_url || '',
      specialties: data.especializacoes || data.specialties || [],
      commission_percentage: data.comissao_percentual || data.commission_percentage || 0,
      hire_date: data.data_contratacao || data.hire_date,
      status: data.status || 'active',
      created_at: data.criado_em || data.created_at,
      updated_at: data.atualizado_em || data.updated_at,
    };
  }

  // Cache invalidation methods
  invalidateClients(businessId: string): void {
    this.cache.invalidate(`clients:${businessId}`);
  }

  invalidateAppointments(businessId: string): void {
    this.cache.invalidate(`appointments:${businessId}`);
  }

  invalidateServices(businessId: string): void {
    this.cache.invalidate(`services:${businessId}`);
  }

  invalidateEmployees(businessId: string): void {
    this.cache.invalidate(`employees:${businessId}`);
  }

  invalidateAll(businessId: string): void {
    this.cache.invalidate(`.*:${businessId}`);
  }
}
