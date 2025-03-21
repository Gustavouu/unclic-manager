
import { ProfessionalFormData, ProfessionalFormErrors } from "./ProfessionalForm";

export const validateProfessionalForm = (professional: ProfessionalFormData): ProfessionalFormErrors => {
  const errors: ProfessionalFormErrors = {};
  
  if (!professional.name.trim()) {
    errors.name = "Nome é obrigatório";
  }
  
  if (!professional.email.trim()) {
    errors.email = "Email é obrigatório";
  } else if (!/\S+@\S+\.\S+/.test(professional.email)) {
    errors.email = "Email inválido";
  }
  
  if (!professional.phone.trim()) {
    errors.phone = "Telefone é obrigatório";
  }
  
  if (!professional.role) {
    errors.role = "Função é obrigatória";
  }
  
  if (!professional.specialty) {
    errors.specialty = "Especialidade é obrigatória";
  }
  
  if (!professional.status) {
    errors.status = "Status é obrigatório";
  }
  
  if (!professional.hireDate) {
    errors.hireDate = "Data de contratação é obrigatória";
  }
  
  if (!professional.commission) {
    errors.commission = "Comissão é obrigatória";
  } else {
    const commissionValue = parseFloat(professional.commission);
    if (isNaN(commissionValue) || commissionValue < 0 || commissionValue > 100) {
      errors.commission = "Comissão deve ser um valor entre 0 e 100";
    }
  }
  
  return errors;
};

export const getEmptyProfessionalForm = (): ProfessionalFormData => ({
  name: "",
  email: "",
  phone: "",
  role: "",
  specialty: "",
  status: "active",
  hireDate: "",
  commission: "20"
});
