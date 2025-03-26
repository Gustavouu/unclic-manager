
import { useState } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { mockSaveFunction, showSuccessToast, showErrorToast, createRequiredValidator, validateEmail, validatePhone } from "@/utils/formUtils";

export const useBusinessProfileForm = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    updateField,
    validateAllFields,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched,
    resetForm
  } = useFormValidation([
    { name: "businessName", value: "Salão de Beleza", validators: [createRequiredValidator("Nome do Negócio")] },
    { name: "businessEmail", value: "contato@salaodebeleza.com", validators: [createRequiredValidator("Email de Contato"), validateEmail] },
    { name: "businessPhone", value: "(11) 99999-9999", validators: [createRequiredValidator("Telefone"), validatePhone] },
    { name: "businessAddress", value: "Rua Exemplo, 123", validators: [createRequiredValidator("Endereço")] },
    { name: "facebookLink", value: "", validators: [] },
    { name: "instagramLink", value: "", validators: [] },
    { name: "linkedinLink", value: "", validators: [] },
    { name: "twitterLink", value: "", validators: [] },
  ]);

  const handleSave = async () => {
    const isValid = validateAllFields();
    
    if (!isValid) {
      showErrorToast("Por favor, corrija os erros antes de salvar.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await mockSaveFunction();
      
      if (success) {
        showSuccessToast("Perfil do negócio atualizado com sucesso!");
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    showSuccessToast("Formulário restaurado ao estado inicial");
  };

  const formProps = {
    updateField,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched
  };

  return {
    isSaving,
    handleSave,
    handleCancel,
    formProps
  };
};
