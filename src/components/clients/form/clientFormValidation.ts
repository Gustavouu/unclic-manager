
import { ClientFormData, ClientFormErrors } from "./ClientForm";

export const validateClientForm = (client: ClientFormData): ClientFormErrors => {
  const errors: ClientFormErrors = {};
  
  if (!client.name.trim()) {
    errors.name = "Nome é obrigatório";
  }
  
  if (!client.email.trim()) {
    errors.email = "Email é obrigatório";
  } else if (!/\S+@\S+\.\S+/.test(client.email)) {
    errors.email = "Email inválido";
  }
  
  if (!client.phone.trim()) {
    errors.phone = "Telefone é obrigatório";
  }
  
  return errors;
};

export const getEmptyClientForm = (): ClientFormData => ({
  name: "",
  email: "",
  phone: "",
  city: "",
  gender: "",
  category: "Novo"
});
