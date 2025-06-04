
import { supabase } from '@/integrations/supabase/client';
import { OptimizedCache, CacheKeys } from '../cache/OptimizedCache';
import type { UnifiedClient, UnifiedAppointment, UnifiedService, UnifiedEmployee } from '@/types/unified';

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

  // Client operations
  async getClients(businessId: string): Promise<UnifiedClient[]> {
    const cacheKey = CacheKeys.CLIENTS(businessId);
    const cached = this.cache.get<UnifiedClient[]>(cacheKey);
    
    if (cached) return cached;

    const { data, error } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const clients = (data || []).map(client => ({
      ...client,
      status: (client.status as 'active' | 'inactive') || 'active'
    })) as UnifiedClient[];
    
    this.cache.set(cacheKey, clients, 5 * 60 * 1000); // 5 minutes
    return clients;
  }

  async getClient(clientId: string): Promise<UnifiedClient> {
    const cacheKey = CacheKeys.CLIENT(clientId);
    const cached = this.cache.get<UnifiedClient>(cacheKey);
    
    if (cached) return cached;

    const { data, error } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) throw error;

    const client = {
      ...data,
      status: (data.status as 'active' | 'inactive') || 'active'
    } as UnifiedClient;

    this.cache.set(cacheKey, client, 5 * 60 * 1000);
    return client;
  }

  async createClient(businessId: string, clientData: Partial<UnifiedClient>): Promise<UnifiedClient> {
    const { data, error } = await supabase
      .from('clients_unified')
      .insert({
        business_id: businessId,
        name: clientData.name || '',
        email: clientData.email,
        phone: clientData.phone,
        birth_date: clientData.birth_date,
        gender: clientData.gender,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zip_code,
        notes: clientData.notes,
        status: clientData.status || 'active',
        total_spent: clientData.total_spent || 0,
        preferences: clientData.preferences || {},
      })
      .select()
      .single();

    if (error) throw error;

    const client = {
      ...data,
      status: (data.status as 'active' | 'inactive') || 'active'
    } as UnifiedClient;

    this.invalidateClients(businessId);
    return client;
  }

  // Appointment operations
  async getAppointments(businessId: string, date?: string): Promise<UnifiedAppointment[]> {
    const cacheKey = CacheKeys.APPOINTMENTS(businessId, date);
    const cached = this.cache.get<UnifiedAppointment[]>(cacheKey);
    
    if (cached) return cached;

    let query = supabase
      .from('appointments_unified')
      .select('*')
      .eq('business_id', businessId);

    if (date) {
      query = query.eq('booking_date', date);
    }

    const { data, error } = await query.order('booking_date', { ascending: true });

    if (error) throw error;

    const appointments = (data || []).map(appointment => ({
      ...appointment,
      status: (appointment.status as 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show') || 'scheduled'
    })) as UnifiedAppointment[];
    
    this.cache.set(cacheKey, appointments, 2 * 60 * 1000); // 2 minutes for real-time data
    return appointments;
  }

  // Service operations
  async getServices(businessId: string): Promise<UnifiedService[]> {
    const cacheKey = CacheKeys.SERVICES(businessId);
    const cached = this.cache.get<UnifiedService[]>(cacheKey);
    
    if (cached) return cached;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    const services = data?.map(service => ({
      id: service.id,
      business_id: service.business_id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      is_active: service.is_active,
      image_url: service.image_url,
      created_at: service.created_at,
      updated_at: service.updated_at,
    })) || [];

    this.cache.set(cacheKey, services, 10 * 60 * 1000); // 10 minutes
    return services;
  }

  // Employee operations
  async getEmployees(businessId: string): Promise<UnifiedEmployee[]> {
    const cacheKey = CacheKeys.EMPLOYEES(businessId);
    const cached = this.cache.get<UnifiedEmployee[]>(cacheKey);
    
    if (cached) return cached;

    const { data, error } = await supabase
      .from('employees_unified')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'active')
      .order('name');

    if (error) throw error;

    const employees = (data || []).map(employee => ({
      ...employee,
      status: (employee.status as 'active' | 'inactive') || 'active'
    })) as UnifiedEmployee[];
    
    this.cache.set(cacheKey, employees, 10 * 60 * 1000); // 10 minutes
    return employees;
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

  // Clear all cache for a business
  invalidateAllForBusiness(businessId: string): void {
    this.cache.invalidate(`.*:${businessId}`);
  }
}
