
import { useState, useCallback } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { toast } from "sonner";

type FieldErrors = {
  [key: string]: string | null;
};

type TouchedFields = {
  [key: string]: boolean;
};

export const useBusinessProfileForm = () => {
  const { businessData, updateBusinessData, saveProgress } = useOnboarding();
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    businessName: businessData.name || "",
    businessEmail: businessData.email || "",
    businessPhone: businessData.phone || "",
    businessAddress: businessData.address || "",
    businessWebsite: businessData.website || "",
    facebookLink: businessData.socialMedia?.facebook || "",
    instagramLink: businessData.socialMedia?.instagram || "",
    linkedinLink: businessData.socialMedia?.linkedin || "",
    twitterLink: businessData.socialMedia?.twitter || "",
  });
  
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const validate = () => {
    const newErrors: FieldErrors = {};
    
    // Required fields
    if (!formValues.businessName) {
      newErrors.businessName = "Nome do negócio é obrigatório";
    }
    
    if (!formValues.businessEmail) {
      newErrors.businessEmail = "Email é obrigatório";
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.businessEmail)) {
      newErrors.businessEmail = "Email inválido";
    }
    
    if (!formValues.businessPhone) {
      newErrors.businessPhone = "Telefone é obrigatório";
    }
    
    // Website validation (optional field)
    if (formValues.businessWebsite && !/^(https?:\/\/)?\S+\.\S+/.test(formValues.businessWebsite)) {
      newErrors.businessWebsite = "Website inválido";
    }
    
    // Social media validations (optional fields)
    if (formValues.facebookLink && !formValues.facebookLink.includes("facebook.com")) {
      newErrors.facebookLink = "URL do Facebook inválida";
    }
    
    if (formValues.instagramLink && !formValues.instagramLink.includes("instagram.com") && !formValues.instagramLink.startsWith("@")) {
      newErrors.instagramLink = "URL do Instagram inválida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const updateField = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const getFieldValue = (name: string) => formValues[name as keyof typeof formValues] || "";
  
  const getFieldError = (name: string) => errors[name] || null;
  
  const hasFieldBeenTouched = (name: string) => touched[name] || false;
  
  const handleSave = async () => {
    // Mark all fields as touched for validation
    const allTouched = Object.keys(formValues).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    
    setTouched(allTouched);
    
    if (!validate()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update onboarding context with form values
      updateBusinessData({
        name: formValues.businessName,
        email: formValues.businessEmail,
        phone: formValues.businessPhone,
        address: formValues.businessAddress,
        website: formValues.businessWebsite,
        socialMedia: {
          facebook: formValues.facebookLink,
          instagram: formValues.instagramLink,
          linkedin: formValues.linkedinLink,
          twitter: formValues.twitterLink
        }
      });
      
      // Save the updated data
      await saveProgress();
      toast.success("Perfil do negócio salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar o perfil do negócio:", error);
      toast.error("Ocorreu um erro ao salvar o perfil");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    // Reset form to original business data
    setFormValues({
      businessName: businessData.name || "",
      businessEmail: businessData.email || "",
      businessPhone: businessData.phone || "",
      businessAddress: businessData.address || "",
      businessWebsite: businessData.website || "",
      facebookLink: businessData.socialMedia?.facebook || "",
      instagramLink: businessData.socialMedia?.instagram || "",
      linkedinLink: businessData.socialMedia?.linkedin || "",
      twitterLink: businessData.socialMedia?.twitter || "",
    });
    
    // Clear touched state and errors
    setTouched({});
    setErrors({});
    toast.info("Alterações descartadas");
  };
  
  return {
    isSaving,
    handleSave,
    handleCancel,
    formProps: {
      updateField,
      getFieldValue,
      getFieldError,
      hasFieldBeenTouched
    }
  };
};
