
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
export { RecurringAppointmentService } from './appointment/RecurringAppointmentService';
export { GoogleCalendarService } from './calendar/GoogleCalendarService';
export { WhatsAppService } from './marketing/WhatsAppService';
export { CommissionService } from './commission/CommissionService';
