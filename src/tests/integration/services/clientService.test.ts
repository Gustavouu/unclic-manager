import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ClientService } from '@/services/client/clientService';
import { BusinessService } from '@/services/business/businessService';
import { supabase } from '@/lib/supabase';
import type { Client, ClientCreate, ClientUpdate } from '@/types/client';

describe('ClientService Integration', () => {
  let clientService: ClientService;
  let businessService: BusinessService;
  let testBusinessId: string;
  let testClientId: string;

  beforeAll(async () => {
    clientService = ClientService.getInstance();
    businessService = BusinessService.getInstance();

    // Cria um negócio de teste
    const business = await businessService.create({
      name: 'Test Business',
      admin_email: 'test@business.com',
      phone: '+5511999999999',
      zip_code: '12345-678',
      address: 'Test Address',
      address_number: '123',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'Test State',
      timezone: 'America/Sao_Paulo',
      settings: {
        allow_remote_queue: true,
        remote_queue_limit: 10,
        require_advance_payment: false,
        minimum_notice_time: 30,
        maximum_days_in_advance: 30,
        allow_simultaneous_appointments: false,
        require_manual_confirmation: false,
        block_no_show_clients: false,
        send_email_confirmation: true,
        send_reminders: true,
        reminder_hours: 24,
        send_followup_message: true,
        followup_hours: 24,
        cancellation_policy_hours: 24,
        no_show_fee: 0,
        primary_color: '#000000',
        secondary_color: '#FFFFFF',
        logo_url: '',
        banner_url: '',
        cancellation_policy: '',
        cancellation_message: '',
      },
    });
    testBusinessId = business.id;
  });

  describe('Client CRUD', () => {
    it('should create, read, update and delete a client', async () => {
      // Create
      const clientData: ClientCreate = {
        business_id: testBusinessId,
        name: 'Test Client',
        email: 'test@client.com',
        phone: '+5511999999999',
      };

      const createdClient = await clientService.create(clientData);
      testClientId = createdClient.id;

      expect(createdClient).toMatchObject(clientData);

      // Read
      const retrievedClient = await clientService.getById(testClientId);
      expect(retrievedClient).toEqual(createdClient);

      // Update
      const updatedData: ClientUpdate = {
        name: 'Updated Client',
        phone: '+5511988888888',
      };

      const updatedClient = await clientService.update(testClientId, updatedData);
      expect(updatedClient).toMatchObject({
        ...createdClient,
        ...updatedData,
      });

      // Delete
      await clientService.delete(testClientId);
      await expect(clientService.getById(testClientId)).rejects.toThrow();
    });
  });

  describe('Client Search', () => {
    it('should search clients with various parameters', async () => {
      // Cria alguns clientes de teste
      const clients = await Promise.all([
        clientService.create({
          business_id: testBusinessId,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+5511999999999',
        }),
        clientService.create({
          business_id: testBusinessId,
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+5511988888888',
        }),
      ]);

      // Testa busca por negócio
      const businessResults = await clientService.search({ business_id: testBusinessId });
      expect(businessResults).toHaveLength(2);

      // Testa busca por nome
      const nameResults = await clientService.search({ business_id: testBusinessId, name: 'John' });
      expect(nameResults).toHaveLength(1);

      // Testa busca por email
      const emailResults = await clientService.search({ business_id: testBusinessId, email: 'jane@example.com' });
      expect(emailResults).toHaveLength(1);

      // Limpa os clientes de teste
      await Promise.all(clients.map(c => clientService.delete(c.id)));
    });
  });

  describe('Client Stats', () => {
    it('should get client statistics', async () => {
      // Cria um cliente de teste
      const client = await clientService.create({
        business_id: testBusinessId,
        name: 'Test Client',
        email: 'test@client.com',
        phone: '+5511999999999',
      });

      // Cria alguns agendamentos de teste
      await Promise.all([
        supabase.from('appointments').insert({
          business_id: testBusinessId,
          professional_id: '00000000-0000-0000-0000-000000000000',
          service_id: '00000000-0000-0000-0000-000000000000',
          client_id: client.id,
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T10:30:00Z',
          status: 'completed',
          price: 50,
        }),
        supabase.from('appointments').insert({
          business_id: testBusinessId,
          professional_id: '00000000-0000-0000-0000-000000000000',
          service_id: '00000000-0000-0000-0000-000000000000',
          client_id: client.id,
          start_time: '2024-01-01T11:00:00Z',
          end_time: '2024-01-01T11:30:00Z',
          status: 'cancelled',
          price: 50,
        }),
      ]);

      // Obtém estatísticas
      const stats = await clientService.getStats(client.id);
      expect(stats).toMatchObject({
        totalAppointments: 2,
        completedAppointments: 1,
        cancelledAppointments: 1,
        noShowAppointments: 0,
        totalSpent: 50,
        lastAppointment: '2024-01-01T10:00:00Z',
        favoriteService: null,
        favoriteProfessional: null,
      });

      // Limpa os dados de teste
      await clientService.delete(client.id);
    });
  });

  afterAll(async () => {
    // Limpa todos os dados de teste
    await businessService.delete(testBusinessId);
  });
}); 