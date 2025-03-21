
import { z } from "zod";

export const appointmentFormSchema = z.object({
  clientId: z.string({
    required_error: "Selecione um cliente",
  }),
  serviceId: z.string({
    required_error: "Selecione um serviço",
  }),
  professionalId: z.string({
    required_error: "Selecione um profissional",
  }),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string({
    required_error: "Selecione um horário",
  }),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
