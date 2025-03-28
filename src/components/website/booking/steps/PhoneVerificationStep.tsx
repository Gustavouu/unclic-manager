
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { supabase } from "@/integrations/supabase/client";
import { formatPhone } from "@/utils/formUtils";
import { showErrorToast } from "@/utils/formUtils";
import { PhoneIcon, UserIcon, CalendarIcon } from "lucide-react";

interface PhoneVerificationStepProps {
  onClientFound: (clientId: string, clientName: string) => void;
  onNewClient: (phone: string) => void;
}

export function PhoneVerificationStep({ onClientFound, onNewClient }: PhoneVerificationStepProps) {
  const [phone, setPhone] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const handleVerifyPhone = async () => {
    if (!phone || phone.length < 14) {
      showErrorToast("Por favor, informe um número de telefone válido");
      return;
    }

    setIsChecking(true);

    try {
      // Consulta o cliente pelo telefone
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('telefone', phone)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Cliente não encontrado, vamos para o cadastro
          onNewClient(phone);
        } else {
          console.error("Erro ao verificar cliente:", error);
          showErrorToast("Ocorreu um erro ao verificar o telefone. Por favor, tente novamente.");
        }
      } else if (data) {
        // Cliente encontrado, prosseguir com o agendamento
        onClientFound(data.id, data.nome);
      }
    } catch (error) {
      console.error("Erro ao verificar cliente:", error);
      showErrorToast("Ocorreu um erro ao verificar o telefone. Por favor, tente novamente.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <PhoneIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Bem-vindo ao agendamento</h3>
        <p className="text-muted-foreground">
          Por favor, informe seu telefone para começarmos
        </p>
      </div>
      
      <FormField
        id="phone"
        label="Telefone"
        type="tel"
        placeholder="(00) 00000-0000"
        value={phone}
        onChange={handlePhoneChange}
        required
      />
      
      <Button 
        onClick={handleVerifyPhone} 
        className="w-full mt-4" 
        disabled={isChecking || phone.length < 14}
      >
        {isChecking ? "Verificando..." : "Continuar"}
      </Button>
    </div>
  );
}
