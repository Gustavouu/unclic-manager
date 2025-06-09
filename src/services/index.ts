
// Export main services
export { authService } from './auth/authService';

// Export client service functions
export {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  getClientById,
  findClientByEmail,
  findClientByPhone
} from './clientService';

export { WaitlistService } from './waitlist/WaitlistService';
export { RecurringAppointmentService } from './appointments/RecurringAppointmentService';
export { GoogleCalendarService } from './calendar/GoogleCalendarService';
export { IcalCalendarService } from './calendar/IcalCalendarService';
export { OutlookCalendarService } from './calendar/OutlookCalendarService';
export { WhatsAppService } from './marketing/WhatsAppService';
export { MarketingIntegrationService } from './marketing/MarketingIntegrationService';
export { CommissionService } from './commission/CommissionService';
export { RefundService } from './payment/RefundService';
export { NfeService } from './payment/NfeService';
export { POSPaymentService } from './payment/POSPaymentService';
