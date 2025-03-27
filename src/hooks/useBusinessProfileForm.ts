
import { useState, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { mockSaveFunction, showSuccessToast, showErrorToast, createRequiredValidator, validateEmail, validatePhone } from "@/utils/formUtils";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const useBusinessProfileForm = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { businessData, updateBusinessData } = useOnboarding();
  
  const {
    updateField,
    validateAllFields,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched,
    resetForm,
    setInitialValues
  } = useFormValidation([
    { name: "businessName", value: "", validators: [createRequiredValidator("Nome do Negócio")] },
    { name: "businessEmail", value: "", validators: [createRequiredValidator("Email de Contato"), validateEmail] },
    { name: "businessPhone", value: "", validators: [createRequiredValidator("Telefone"), validatePhone] },
    { name: "businessAddress", value: "", validators: [createRequiredValidator("Endereço")] },
    { name: "facebookLink", value: "", validators: [] },
    { name: "instagramLink", value: "", validators: [] },
    { name: "linkedinLink", value: "", validators: [] },
    { name: "twitterLink", value: "", validators: [] },
  ]);

  // Load business data from onboarding when component mounts
  useEffect(() => {
    if (businessData) {
      setInitialValues({
        businessName: businessData.name || "",
        businessEmail: businessData.email || "",
        businessPhone: businessData.phone || "",
        businessAddress: businessData.address ? 
          `${businessData.address}, ${businessData.number || ''} - ${businessData.neighborhood || ''}, ${businessData.city || ''}, ${businessData.state || ''}` : "",
        facebookLink: "",
        instagramLink: "",
        linkedinLink: "",
        twitterLink: ""
      });
    }
  }, [businessData]);

  const handleSave = async () => {
    const isValid = validateAllFields();
    
    if (!isValid) {
      showErrorToast("Por favor, corrija os erros antes de salvar.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update onboarding context with the new values
      updateBusinessData({
        name: getFieldValue("businessName"),
        email: getFieldValue("businessEmail"),
        phone: getFieldValue("businessPhone")
        // Note: we're not updating address here as it would require parsing the combined address field
      });
      
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
