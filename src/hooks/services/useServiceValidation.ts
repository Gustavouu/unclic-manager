
import { z } from 'zod';

export const serviceValidationSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  description: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  duration: z.coerce.number()
    .min(1, 'Duração deve ser pelo menos 1 minuto')
    .max(480, 'Duração máxima de 8 horas'),
  price: z.coerce.number()
    .min(0, 'Preço não pode ser negativo')
    .max(99999.99, 'Preço máximo de R$ 99.999,99'),
  category: z.string()
    .min(1, 'Categoria é obrigatória')
    .default('Geral'),
  commission_percentage: z.coerce.number()
    .min(0, 'Comissão não pode ser negativa')
    .max(100, 'Comissão não pode ser maior que 100%')
    .optional()
    .default(0),
  image_url: z.string().optional(),
});

export type ServiceValidationData = z.infer<typeof serviceValidationSchema>;

export const useServiceValidation = () => {
  const validateService = (data: unknown) => {
    try {
      return serviceValidationSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new Error(`Dados inválidos: ${formattedErrors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  };

  const validatePartialService = (data: unknown) => {
    try {
      return serviceValidationSchema.partial().parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new Error(`Dados inválidos: ${formattedErrors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  };

  return {
    validateService,
    validatePartialService,
    schema: serviceValidationSchema,
  };
};
