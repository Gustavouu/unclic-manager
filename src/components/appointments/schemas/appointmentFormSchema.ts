import * as z from "zod";
import { addMinutes, isBefore, isAfter, startOfDay, addDays } from "date-fns";
import { AppointmentStatus } from "../types";

// Configurações (podem vir do banco de dados)
const DIAS_MAXIMOS_FUTURO = 30;
const TEMPO_MINIMO_ANTECEDENCIA = 30; // minutos

// Esquema de validação para agendamentos com regras mais robustas
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
  }).refine((date) => {
    // Não permite datas passadas
    return !isBefore(date, startOfDay(new Date()));
  }, "Data não pode ser no passado")
  .refine((date) => {
    // Não permite datas além do limite configurado
    return !isAfter(date, addDays(new Date(), DIAS_MAXIMOS_FUTURO));
  }, `Data não pode ser mais de ${DIAS_MAXIMOS_FUTURO} dias no futuro`),
  time: z.string({
    required_error: "Selecione um horário",
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  notes: z.string().optional(),
  status: z.enum(["agendado", "confirmado", "cancelado", "concluido", "pendente"] as const, {
    required_error: "Selecione um status",
  }),
  paymentMethod: z.enum(["local", "pix", "credit_card", "debit_card", "transfer"], {
    required_error: "Selecione uma forma de pagamento",
  }),
  notifications: z.object({
    sendConfirmation: z.boolean().default(true),
    sendReminder: z.boolean().default(true),
  }),
  // Campos calculados internamente
  duration: z.number().min(1, "Duração inválida").optional(),
  price: z.number().min(0, "Preço inválido").optional(),
  // Campo para múltiplos serviços
  additionalServices: z.array(z.object({
    serviceId: z.string().optional(),
    duration: z.number().optional(),
    price: z.number().optional(),
  })).optional(),
  // Campo para casos especiais
  isEmergency: z.boolean().default(false),
  emergencyReason: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
