
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { fetchAddressByCEP } from "@/utils/addressUtils";
import { toast } from "sonner";
import { useState } from "react";
import { formatPhone } from "@/utils/formUtils";

interface GeneralInfoSectionProps {
  updateField: (name: string, value: string) => void;
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const GeneralInfoSection = ({ 
  updateField, 
  getFieldValue, 
  getFieldError
}: GeneralInfoSectionProps) => {
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const handleFetchAddress = async () => {
    const cep = prompt("Digite o CEP:");
    if (!cep) return;

    setIsFetchingAddress(true);
    try {
      const addressData = await fetchAddressByCEP(cep);
      
      if (addressData.error) {
        toast.error(addressData.error);
        return;
      }
      
      if (addressData.street) {
        const fullAddress = `${addressData.street}, ${addressData.neighborhood || ''} - ${addressData.city || ''}, ${addressData.state || ''}`;
        updateField("businessAddress", fullAddress);
        toast.success("Endereço preenchido com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao buscar endereço pelo CEP");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    updateField("businessPhone", formattedPhone);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Gerais</h3>
      
      <FormField
        id="business-name"
        label="Nome do Negócio"
        value={getFieldValue("businessName")}
        onChange={(value) => updateField("businessName", value)}
        error={getFieldError("businessName") || ""}
        required
      />
      
      <FormField
        id="business-email"
        label="Email de Contato"
        type="email"
        value={getFieldValue("businessEmail")}
        onChange={(value) => updateField("businessEmail", value)}
        error={getFieldError("businessEmail") || ""}
        required
      />
      
      <div className="space-y-2">
        <Label htmlFor="business-phone" className={getFieldError("businessPhone") ? "text-destructive" : ""}>
          Telefone<span className="text-destructive ml-1">*</span>
        </Label>
        <Input 
          id="business-phone" 
          type="tel"
          value={getFieldValue("businessPhone")}
          onChange={handlePhoneChange}
          placeholder="(00) 00000-0000"
          className={getFieldError("businessPhone") ? "border-destructive" : ""}
        />
        {getFieldError("businessPhone") && (
          <p className="text-sm font-medium text-destructive">{getFieldError("businessPhone")}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="business-address">Endereço</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="business-address" 
            type="text" 
            value={getFieldValue("businessAddress")}
            onChange={(e) => updateField("businessAddress", e.target.value)}
            className="flex-1" 
          />
          <Button 
            variant="outline" 
            size="icon" 
            type="button" 
            onClick={handleFetchAddress}
            disabled={isFetchingAddress}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        {getFieldError("businessAddress") && (
          <p className="text-sm font-medium text-destructive">{getFieldError("businessAddress")}</p>
        )}
      </div>
    </div>
  );
};
