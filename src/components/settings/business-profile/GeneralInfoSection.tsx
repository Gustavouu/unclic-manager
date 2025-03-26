
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { fetchAddressByCEP } from "@/utils/addressUtils";
import { toast } from "sonner";
import { useState } from "react";

interface GeneralInfoSectionProps {
  updateField: (name: string, value: string) => void;
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const GeneralInfoSection = ({ 
  updateField, 
  getFieldValue, 
  getFieldError, 
  hasFieldBeenTouched 
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Gerais</h3>
      
      <FormField
        id="business-name"
        label="Nome do Negócio"
        value={getFieldValue("businessName")}
        onChange={(value) => updateField("businessName", value)}
        error={getFieldError("businessName")}
        touched={hasFieldBeenTouched("businessName")}
        required
      />
      
      <FormField
        id="business-email"
        label="Email de Contato"
        type="email"
        value={getFieldValue("businessEmail")}
        onChange={(value) => updateField("businessEmail", value)}
        error={getFieldError("businessEmail")}
        touched={hasFieldBeenTouched("businessEmail")}
        required
      />
      
      <FormField
        id="business-phone"
        label="Telefone"
        type="tel"
        value={getFieldValue("businessPhone")}
        onChange={(value) => updateField("businessPhone", value)}
        error={getFieldError("businessPhone")}
        touched={hasFieldBeenTouched("businessPhone")}
        required
      />
      
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
        {getFieldError("businessAddress") && hasFieldBeenTouched("businessAddress") && (
          <p className="text-sm font-medium text-destructive">{getFieldError("businessAddress")}</p>
        )}
      </div>
    </div>
  );
};
