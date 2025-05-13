
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/ui/form-field";

interface SocialMediaSectionProps {
  updateField: (name: string, value: string) => void;
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const SocialMediaSection = ({
  updateField,
  getFieldValue,
  getFieldError
}: SocialMediaSectionProps) => {
  return (
    <div className="space-y-4">
      <Separator />
      
      <h3 className="text-lg font-medium">Redes Sociais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="facebook-link"
          label="Facebook"
          type="url"
          placeholder="https://www.facebook.com/seunegocio"
          value={getFieldValue("facebookLink")}
          onChange={(value) => updateField("facebookLink", value)}
          error={getFieldError("facebookLink") || ""}
        />
        
        <FormField
          id="instagram-link"
          label="Instagram"
          type="url"
          placeholder="https://www.instagram.com/seunegocio"
          value={getFieldValue("instagramLink")}
          onChange={(value) => updateField("instagramLink", value)}
          error={getFieldError("instagramLink") || ""}
        />
        
        <FormField
          id="linkedin-link"
          label="LinkedIn"
          type="url"
          placeholder="https://www.linkedin.com/company/seunegocio"
          value={getFieldValue("linkedinLink")}
          onChange={(value) => updateField("linkedinLink", value)}
          error={getFieldError("linkedinLink") || ""}
        />
        
        <FormField
          id="twitter-link"
          label="Twitter"
          type="url"
          placeholder="https://twitter.com/seunegocio"
          value={getFieldValue("twitterLink")}
          onChange={(value) => updateField("twitterLink", value)}
          error={getFieldError("twitterLink") || ""}
        />
      </div>
    </div>
  );
};
