
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/ui/form-field";

interface WebsiteSectionProps {
  updateField: (name: string, value: string) => void;
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const WebsiteSection = ({
  updateField,
  getFieldValue,
  getFieldError
}: WebsiteSectionProps) => {
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
        onChange={(value) => updateField("website", value)}
        error={getFieldError("website") || ""}
      />
    </div>
  );
};
