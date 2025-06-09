import { RRule } from 'rrule';
import { StandardizedAppointmentService } from './standardizedAppointmentService';
import type { AppointmentCreate } from '@/types/appointment';
import type { RecurringAppointmentOptions } from '@/types/recurrence';

export class RecurringAppointmentService {
  static async createRecurring(
    base: AppointmentCreate,
    options: RecurringAppointmentOptions
  ) {
    const rule = RRule.fromString(options.rule);
    const dates = rule.all().slice(0, options.occurrences || 50);

    const appointments = [];
    const service = StandardizedAppointmentService.getInstance();
    for (const date of dates) {
      const appointment = await service.create({
        ...base,
        date: date.toISOString().split('T')[0],
        start_time: base.start_time,
        end_time: base.end_time,
      });
      appointments.push(appointment);
    }
    return appointments;
  }
}
