
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getPaymentMethodLabel = (method: string | null): string => {
  if (!method) return "Não informado";
  
  switch (method) {
    case "credit_card": return "Cartão de Crédito";
    case "debit_card": return "Cartão de Débito";
    case "pix": return "PIX";
    case "bank_slip": return "Boleto";
    case "cash": return "Dinheiro";
    default: return method;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  } catch (e) {
    return "Data inválida";
  }
};
