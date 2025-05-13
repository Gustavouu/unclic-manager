
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface GeneralInfoSectionProps {
  getFieldValue: (name: string) => string;
  getFieldError: (name: string) => string | null;
  updateField: (name: string, value: string) => void;
  hasFieldBeenTouched: (name: string) => boolean;
}

export const GeneralInfoSection = ({
  getFieldValue,
  getFieldError,
  updateField,
  hasFieldBeenTouched
}: GeneralInfoSectionProps) => {
  const { businessData } = useCurrentBusiness();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Sincronizar os valores iniciais com os dados do negócio
  useEffect(() => {
    if (businessData) {
      setName(businessData.nome || "");
      setEmail(businessData.email_admin || "");
      setPhone(businessData.telefone || "");
      setAddress(businessData.endereco || "");
      
      // Atualizar os campos do formulário com os dados do negócio
      updateField("businessName", businessData.nome || "");
      updateField("businessEmail", businessData.email_admin || "");
      updateField("businessPhone", businessData.telefone || "");
      updateField("businessAddress", businessData.endereco || "");
    }
  }, [businessData]);
  
  const hasError = (fieldName: string) => {
    return getFieldError(fieldName) && hasFieldBeenTouched(fieldName);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-medium">Informações Gerais</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">
            Nome do Negócio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Nome da sua empresa"
            value={getFieldValue("businessName")}
            onChange={(e) => updateField("businessName", e.target.value)}
            className={hasError("businessName") ? "border-red-500" : ""}
          />
          {hasError("businessName") && (
            <p className="text-sm text-red-500">{getFieldError("businessName")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessEmail"
            type="email"
            placeholder="Email principal de contato"
            value={getFieldValue("businessEmail")}
            onChange={(e) => updateField("businessEmail", e.target.value)}
            className={hasError("businessEmail") ? "border-red-500" : ""}
          />
          {hasError("businessEmail") && (
            <p className="text-sm text-red-500">{getFieldError("businessEmail")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPhone">
            Telefone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessPhone"
            placeholder="(XX) XXXXX-XXXX"
            value={getFieldValue("businessPhone")}
            onChange={(e) => updateField("businessPhone", e.target.value)}
            className={hasError("businessPhone") ? "border-red-500" : ""}
          />
          {hasError("businessPhone") && (
            <p className="text-sm text-red-500">{getFieldError("businessPhone")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">Endereço</Label>
          <Input
            id="businessAddress"
            placeholder="Endereço completo"
            value={getFieldValue("businessAddress")}
            onChange={(e) => updateField("businessAddress", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
