
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TimeSlot {
  time: string;
  available: boolean;
}

interface UseAvailableTimeSlotsParams {
  employeeId?: string;
  serviceId?: string;
  date?: string;
  businessId?: string;
}

export const useAvailableTimeSlots = ({
  employeeId,
  serviceId,
  date,
  businessId
}: UseAvailableTimeSlotsParams) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: true
        });
      }
    }

    return slots;
  };

  const fetchAvailableTimeSlots = async () => {
    if (!employeeId || !date || !businessId) {
      setTimeSlots(generateTimeSlots());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch existing appointments for the employee on the selected date
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, end_time, duration')
        .eq('employee_id', employeeId)
        .eq('booking_date', date)
        .not('status', 'eq', 'cancelled');

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      const allSlots = generateTimeSlots();
      const bookedTimes = new Set<string>();

      // Mark booked times
      if (appointments) {
        appointments.forEach((appointment: any) => {
          const startTime = appointment.start_time;
          const duration = appointment.duration || 60;
          
          // Calculate end time based on start time and duration
          const [startHour, startMinute] = startTime.split(':').map(Number);
          const startTotalMinutes = startHour * 60 + startMinute;
          const endTotalMinutes = startTotalMinutes + duration;
          
          // Mark all slots within this appointment as booked
          for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 30) {
            const hour = Math.floor(minutes / 60);
            const minute = minutes % 60;
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            bookedTimes.add(timeString);
          }
        });
      }

      // Update availability
      const availableSlots = allSlots.map(slot => ({
        ...slot,
        available: !bookedTimes.has(slot.time)
      }));

      setTimeSlots(availableSlots);
    } catch (err: any) {
      console.error('Error fetching available time slots:', err);
      setError(err.message || 'Failed to fetch available time slots');
      setTimeSlots(generateTimeSlots()); // Fallback to all available
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableTimeSlots();
  }, [employeeId, serviceId, date, businessId]);

  return {
    timeSlots,
    isLoading,
    error,
    refetch: fetchAvailableTimeSlots
  };
};
