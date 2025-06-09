import { RRule } from 'rrule';
import { AppointmentService } from './appointmentService';
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
    for (const date of dates) {
      const appointment = await AppointmentService.getInstance().create({
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
