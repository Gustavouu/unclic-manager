// Serviços de Negócio
export * from './business/businessService';
export * from './business/InitializationService';

// Serviços de Cliente
export * from './client/clientService';
export * from './client/clientProfileService';
export * from './client/clientPreferencesService';

// Serviços de Agendamento
export * from './appointment/appointmentService';
export * from './appointment/availabilityService';
export * from './appointment/scheduleService';

// Serviços de Profissional
export * from './professional/professionalService';
export * from './professional/professionalScheduleService';
export * from './professional/professionalCommissionService';

// Serviços de Serviço
export * from './service/serviceService';
export * from './service/serviceCategoryService';
export * from './service/servicePriceService';

// Serviços Financeiros
export * from './finance/transactionService';
export * from './finance/paymentService';
export * from './finance/commissionService';
export * from './finance/financialReportService';

// Serviços de Estoque
export * from './inventory/inventoryService';
export * from './inventory/stockService';
export * from './inventory/productService';

// Serviços de Fidelidade
export * from './loyalty/loyaltyService';
export * from './loyalty/loyaltyProgramService';
export * from './loyalty/loyaltyPointsService';

// Serviços de Notificação
export * from './notifications/notificationService';
export * from './notifications/emailService';
export * from './notifications/smsService';

// Serviços de Webhook
export * from './webhook/webhookService';
export * from './webhook/paymentWebhookService';

// Serviços de Relatório
export * from './reports/businessReportService';
export * from './reports/financialReportService';
export * from './reports/performanceReportService';

// Serviços de Configuração
export * from './settings/businessSettingsService';
export * from './settings/integrationSettingsService'; 