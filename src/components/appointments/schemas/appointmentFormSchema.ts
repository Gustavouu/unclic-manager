
import * as z from "zod";

export const appointmentFormSchema = z.object({
  clientId: z.string({
    required_error: "O cliente é obrigatório.",
  }),
  serviceId: z.string({
    required_error: "O serviço é obrigatório.",
  }),
  professionalId: z.string({
    required_error: "O profissional é obrigatório.",
  }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  time: z.string({
    required_error: "O horário é obrigatório.",
  }),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
