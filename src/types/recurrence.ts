export interface RecurringAppointmentOptions {
  rule: string; // iCal RRULE string
  occurrences?: number;
  endDate?: string;
}
