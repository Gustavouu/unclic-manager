
import { z } from "zod";

export const appointmentFormSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  serviceId: z.string().min(1, "Serviço é obrigatório"),
  professionalId: z.string().min(1, "Profissional é obrigatório"),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  time: z.string().min(1, "Horário é obrigatório"),
  endTime: z.string().optional(),
  status: z.string().default("scheduled"),
  paymentMethod: z.string().default("cash"),
  notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
