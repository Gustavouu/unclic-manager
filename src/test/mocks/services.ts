import { vi } from 'vitest';

export const mockAppointmentService = {
  getAppointments: vi.fn(),
  createAppointment: vi.fn(),
  updateAppointment: vi.fn(),
  deleteAppointment: vi.fn(),
};

export const mockClientService = {
  getClients: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
};

export const mockProfessionalService = {
  getProfessionals: vi.fn(),
  createProfessional: vi.fn(),
  updateProfessional: vi.fn(),
  deleteProfessional: vi.fn(),
};

export const mockServiceService = {
  getServices: vi.fn(),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
};

export const mockProductService = {
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
};

export const mockFinanceService = {
  getFinancialData: vi.fn(),
  getTransactions: vi.fn(),
  createTransaction: vi.fn(),
}; 