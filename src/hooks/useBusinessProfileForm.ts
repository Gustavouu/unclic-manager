
import { useState, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { mockSaveFunction, showSuccessToast, showErrorToast, createRequiredValidator, validateEmail, validatePhone, formatPhone } from "@/utils/formUtils";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const useBusinessProfileForm = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { businessData, updateBusinessData } = useOnboarding();
  
  const formValidation = useFormValidation([
    { name: "businessName", value: "", validators: [createRequiredValidator("Nome do Negócio")] },
    { name: "businessEmail", value: "", validators: [createRequiredValidator("Email de Contato"), validateEmail] },
    { name: "businessPhone", value: "", validators: [createRequiredValidator("Telefone"), validatePhone] },
    { name: "businessAddress", value: "", validators: [createRequiredValidator("Endereço")] },
    { name: "facebookLink", value: "", validators: [] },
    { name: "instagramLink", value: "", validators: [] },
    { name: "linkedinLink", value: "", validators: [] },
    { name: "twitterLink", value: "", validators: [] },
  ]);

  const {
    updateField,
    validateAllFields,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched,
    resetForm,
    fields
  } = formValidation;

  // Load business data from onboarding when component mounts
  useEffect(() => {
    if (businessData) {
      // Instead of using setInitialValues, we'll manually update each field
      if (businessData.name) {
        updateField("businessName", businessData.name);
      }
      if (businessData.email) {
        updateField("businessEmail", businessData.email);
      }
      if (businessData.phone) {
        // Format the phone number with mask
        updateField("businessPhone", formatPhone(businessData.phone));
      }
      if (businessData.address) {
        const addressStr = `${businessData.address}, ${businessData.number || ''} - ${businessData.neighborhood || ''}, ${businessData.city || ''}, ${businessData.state || ''}`;
        updateField("businessAddress", addressStr);
      }
      // Set social media links if they exist
      if (businessData.socialMedia?.facebook) {
        updateField("facebookLink", businessData.socialMedia.facebook);
      }
      if (businessData.socialMedia?.instagram) {
        updateField("instagramLink", businessData.socialMedia.instagram);
      }
      if (businessData.socialMedia?.linkedin) {
        updateField("linkedinLink", businessData.socialMedia.linkedin);
      }
      if (businessData.socialMedia?.twitter) {
        updateField("twitterLink", businessData.socialMedia.twitter);
      }
    }
  }, [businessData, updateField]);

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
        phone: getFieldValue("businessPhone").replace(/\D/g, ''), // Remove mask before saving
        // Note: we're not updating address here as it would require parsing the combined address field
        socialMedia: {
          facebook: getFieldValue("facebookLink"),
          instagram: getFieldValue("instagramLink"),
          linkedin: getFieldValue("linkedinLink"),
          twitter: getFieldValue("twitterLink")
        }
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
