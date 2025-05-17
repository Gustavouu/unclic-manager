
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/ui/form-field";
import { useEffect, useState } from "react";

interface WebsiteSectionProps {
  updateField: (name: string, value: string) => void;
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const WebsiteSection = ({
  updateField,
  getFieldValue,
  getFieldError,
  hasFieldBeenTouched
}: WebsiteSectionProps) => {
  // State to track website field
  const [isValid, setIsValid] = useState(true);
  const websiteValue = getFieldValue("website");
  const websiteError = getFieldError("website");
  
  // Validate website URL when it changes
  useEffect(() => {
    if (!websiteValue) {
      setIsValid(true);
      return;
    }
    
    try {
      // Try to create a URL to validate
      // We add https:// if protocol is missing
      const urlToTest = websiteValue.includes('://') ? 
        websiteValue : `https://${websiteValue}`;
      
      new URL(urlToTest);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  }, [websiteValue]);
  
  // Handle website input changes
  const handleWebsiteChange = (value: string) => {
    // Allow empty value
    if (!value) {
      updateField("website", "");
      return;
    }
    
    // Normalize the URL - add https:// if no protocol is specified
    let normalizedValue = value;
    if (!value.includes('://')) {
      normalizedValue = `https://${value}`;
    }
    
    updateField("website", normalizedValue);
  };
  
  return (
    <div className="space-y-4">
      <Separator />
      
      <h3 className="text-lg font-medium">Website</h3>
      
      <FormField
        id="website"
        label="URL do Website"
        type="url"
        placeholder="https://www.seunegoico.com.br"
        value={getFieldValue("website")}
        onChange={handleWebsiteChange}
        error={websiteError || (!isValid && hasFieldBeenTouched("website") ? "URL inválida" : "")}
        hint="Inclua o seu website para que os clientes possam encontrar mais informações sobre o seu negócio."
      />
      
      {websiteValue && isValid && !websiteError && (
        <div className="text-sm text-muted-foreground mt-1">
          <a
            href={websiteValue}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Abrir site em nova aba
          </a>
        </div>
      )}
    </div>
  );
};
