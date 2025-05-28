
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DateTimeSelect } from './DateTimeSelect';
import { AppointmentFormValues } from '../schemas/appointmentFormSchema';
import { cn } from '@/lib/utils';

interface DateTimeSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
  professionalId?: string;
  className?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimeSelectWrapper({
  form,
  serviceId,
  professionalId,
  className,
  error,
  label,
  placeholder,
  disabled
}: DateTimeSelectWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <DateTimeSelect
        form={form}
        onTimeChange={() => {
          // Handle time change if needed
        }}
        minAdvanceTime={30}
        maxFutureDays={30}
        businessHours={{
          segunda: { enabled: true, start: "09:00", end: "18:00" },
          terca: { enabled: true, start: "09:00", end: "18:00" },
          quarta: { enabled: true, start: "09:00", end: "18:00" },
          quinta: { enabled: true, start: "09:00", end: "18:00" },
          sexta: { enabled: true, start: "09:00", end: "18:00" },
          sabado: { enabled: true, start: "09:00", end: "15:00" },
          domingo: { enabled: false, start: "00:00", end: "00:00" }
        }}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
