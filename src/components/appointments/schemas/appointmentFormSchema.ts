
import * as z from "zod";

export const appointmentFormSchema = z.object({
  clientId: z.string({
    required_error: "Cliente é obrigatório",
  }),
  serviceId: z.string({
    required_error: "Serviço é obrigatório",
  }),
  professionalId: z.string({
    required_error: "Profissional é obrigatório",
  }),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  time: z.string({
    required_error: "Horário é obrigatório",
  }),
  endTime: z.string().optional(),
  duration: z.number().optional(),
  price: z.number().optional(),
  paymentMethod: z.string().optional(),
  status: z.string().optional().default("scheduled"),
  notes: z.string().optional(),
  isEmergency: z.boolean().optional(),
  emergencyReason: z.string().optional(),
  notifications: z.boolean().optional(),
  additionalServices: z
    .array(
      z.object({
        serviceId: z.string(),
        price: z.number().optional(),
        duration: z.number().optional(),
      })
    )
    .optional(),
  clientSignature: z.string().optional(),
  waiverSigned: z.boolean().optional(),
  termsAccepted: z.boolean().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
