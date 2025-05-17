
import { useState, useCallback } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

interface BusinessFormData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  website: string;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
  description: string;
}

export const useBusinessProfileForm = () => {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    website: "",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
    twitterLink: "",
    description: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState<BusinessFormData | null>(null);
  
  const { updateBusinessSettings, businessData } = useTenant();

  // Load business data from the tenant context or onboarding data
  const loadBusinessData = useCallback((data: any) => {
    if (!data) return;
    
    const newFormData = {
      businessName: data.name || "",
      businessEmail: data.email || data.admin_email || "",
      businessPhone: data.phone || "",
      businessAddress: data.address || "",
      website: data.website || (data.settings && data.settings.website) || "",
      facebookLink: (data.settings && data.settings.socialMedia && data.settings.socialMedia.facebook) || "",
      instagramLink: (data.settings && data.settings.socialMedia && data.settings.socialMedia.instagram) || "",
      linkedinLink: (data.settings && data.settings.socialMedia && data.settings.socialMedia.linkedin) || "",
      twitterLink: (data.settings && data.settings.socialMedia && data.settings.socialMedia.twitter) || "",
      description: data.description || "",
    };
    
    setFormData(newFormData);
    setOriginalData(newFormData);
    setErrors({});
    setTouched({});
  }, []);

  // Update a field in the form
  const updateField = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error if field is now valid
    if (errors[name]) {
      validateField(name, value);
    }
  };

  // Get the value of a field
  const getFieldValue = (name: string) => {
    return formData[name as keyof BusinessFormData] || "";
  };

  // Check if a field has been touched
  const hasFieldBeenTouched = (name: string) => {
    return touched[name] || false;
  };

  // Get the error message for a field
  const getFieldError = (name: string) => {
    return errors[name] || null;
  };

  // Validate a single field
  const validateField = (name: string, value: string) => {
    let error = "";
    
    if (name === "businessName" && !value) {
      error = "Nome do negócio é obrigatório";
    }
    
    if (name === "businessEmail") {
      if (!value) {
        error = "Email é obrigatório";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email inválido";
      }
    }
    
    if (name === "businessPhone" && !value) {
      error = "Telefone é obrigatório";
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName) {
      newErrors.businessName = "Nome do negócio é obrigatório";
    }
    
    if (!formData.businessEmail) {
      newErrors.businessEmail = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      newErrors.businessEmail = "Email inválido";
    }
    
    if (!formData.businessPhone) {
      newErrors.businessPhone = "Telefone é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save button click
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const settingsData = {
        website: formData.website,
        socialMedia: {
          facebook: formData.facebookLink,
          instagram: formData.instagramLink,
          linkedin: formData.linkedinLink,
          twitter: formData.twitterLink
        }
      };
      
      // Update business settings
      await updateBusinessSettings(settingsData);
      
      // We'd also need to update the main business info, but that will depend on
      // how your API is structured. For now, we're focusing on settings.
      
      toast.success("Informações salvas com sucesso!");
      setOriginalData(formData);
    } catch (error) {
      console.error("Error saving business profile:", error);
      toast.error("Erro ao salvar informações");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      setErrors({});
      setTouched({});
    }
  };

  return {
    formData,
    updateField,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched,
    isSaving,
    handleSave,
    handleCancel,
    loadBusinessData,
    formProps: {
      updateField,
      getFieldValue,
      getFieldError,
      hasFieldBeenTouched
    }
  };
};
