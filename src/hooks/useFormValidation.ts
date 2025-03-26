
import { useState } from "react";

export type ValidationErrors = {
  [key: string]: string | null;
};

export interface FormField {
  name: string;
  value: string;
  validators: ((value: string) => string | null)[];
}

export const useFormValidation = (initialFields: FormField[]) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Atualiza o valor de um campo
  const updateField = (name: string, value: string) => {
    setFields(prev => prev.map(field => 
      field.name === name ? { ...field, value } : field
    ));
    
    // Marca o campo como tocado
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Valida o campo ao alterar
    validateField(name, value);
  };
  
  // Valida um único campo
  const validateField = (name: string, value: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return;
    
    let fieldError: string | null = null;
    
    for (const validator of field.validators) {
      const error = validator(value);
      if (error) {
        fieldError = error;
        break;
      }
    }
    
    setErrors(prev => ({ ...prev, [name]: fieldError }));
    return fieldError === null;
  };
  
  // Valida todos os campos
  const validateAllFields = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      let fieldError: string | null = null;
      
      for (const validator of field.validators) {
        const error = validator(field.value);
        if (error) {
          fieldError = error;
          isValid = false;
          break;
        }
      }
      
      newErrors[field.name] = fieldError;
    });
    
    setErrors(newErrors);
    
    // Marca todos os campos como tocados durante a validação completa
    const newTouched: { [key: string]: boolean } = {};
    fields.forEach(field => {
      newTouched[field.name] = true;
    });
    setTouched(newTouched);
    
    return isValid;
  };
  
  // Reseta o formulário
  const resetForm = () => {
    setFields(initialFields);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };
  
  // Obtém o valor de um campo
  const getFieldValue = (name: string) => {
    const field = fields.find(f => f.name === name);
    return field ? field.value : "";
  };
  
  // Obtém o erro de um campo
  const getFieldError = (name: string) => {
    return errors[name] || null;
  };
  
  // Verifica se um campo foi tocado
  const hasFieldBeenTouched = (name: string) => {
    return !!touched[name];
  };
  
  return {
    fields,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateField,
    validateAllFields,
    resetForm,
    getFieldValue,
    getFieldError,
    hasFieldBeenTouched
  };
};
