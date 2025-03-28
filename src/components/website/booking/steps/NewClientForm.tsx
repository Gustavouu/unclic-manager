
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { supabase } from "@/integrations/supabase/client";
import { validateRequired, validateEmail } from "@/utils/formUtils";
import { showSuccessToast, showErrorToast } from "@/utils/formUtils";
import { v4 as uuidv4 } from "uuid";
import { UserPlusIcon, CalendarIcon } from "lucide-react";

interface NewClientFormProps {
  phone: string;
  onClientCreated: (clientId: string, clientName: string, clientEmail?: string, clientPhone?: string) => void;
  onBack: () => void;
}

export function NewClientForm({ phone, onClientCreated, onBack }: NewClientFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errors, setErrors] = useState<{
    name: string | null;
    email: string | null;
    birthDate: string | null;
  }>({
    name: null,
    email: null,
    birthDate: null
  });

  const validateForm = () => {
    const newErrors = {
      name: validateRequired(name, "Nome completo"),
      email: email ? validateEmail(email) : null,
      birthDate: validateRequired(birthDate, "Data de nascimento")
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Primeiro, verificamos se o cliente já existe com este email (caso informado)
      if (email) {
        const { data: existingClient } = await supabase
          .from('clientes')
          .select('id')
          .or(`email.eq.${email},telefone.eq.${phone}`)
          .limit(1);

        if (existingClient && existingClient.length > 0) {
          showErrorToast("Este cliente já existe em nossa base de dados.");
          setIsSubmitting(false);
          return;
        }
      }

      // Consultamos o primeiro negócio disponível para associar o cliente
      // Corrigindo a consulta para garantir que obtenha um ID de negócio válido
      const { data: business, error: businessError } = await supabase
        .from('negocios')
        .select('id')
        .limit(1);
      
      // Verificar se há erro ou se não há dados retornados
      if (businessError || !business || business.length === 0) {
        console.error("Erro ao buscar negócio:", businessError);
        
        // Use um ID fixo para desenvolvimento, se não encontrar um negócio
        const defaultBusinessId = "00000000-0000-0000-0000-000000000001";
        
        // Criamos o novo cliente com o ID padrão
        const { data: newClient, error } = await supabase
          .from('clientes')
          .insert({
            nome: name,
            email: email || null,
            telefone: phone,
            data_nascimento: birthDate,
            id_negocio: defaultBusinessId
          })
          .select('id, nome, email, telefone')
          .single();

        if (error) {
          console.error("Erro ao criar cliente:", error);
          showErrorToast("Ocorreu um erro ao criar seu cadastro. Por favor, tente novamente.");
        } else {
          showSuccessToast("Cadastro realizado com sucesso!");
          onClientCreated(newClient.id, newClient.nome, newClient.email, newClient.telefone);
        }
      } else {
        // Se encontrou um negócio, use o ID
        const businessId = business[0]?.id;

        // Criamos o novo cliente
        const { data: newClient, error } = await supabase
          .from('clientes')
          .insert({
            nome: name,
            email: email || null,
            telefone: phone,
            data_nascimento: birthDate,
            id_negocio: businessId
          })
          .select('id, nome, email, telefone')
          .single();

        if (error) {
          console.error("Erro ao criar cliente:", error);
          showErrorToast("Ocorreu um erro ao criar seu cadastro. Por favor, tente novamente.");
        } else {
          showSuccessToast("Cadastro realizado com sucesso!");
          onClientCreated(newClient.id, newClient.nome, newClient.email, newClient.telefone);
        }
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      showErrorToast("Ocorreu um erro ao criar seu cadastro. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <UserPlusIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Novo Cliente</h3>
        <p className="text-muted-foreground">
          Precisamos de algumas informações para criar seu cadastro
        </p>
      </div>
      
      <FormField
        id="name"
        label="Nome completo"
        value={name}
        onChange={setName}
        error={errors.name}
        touched={true}
        required
      />
      
      <FormField
        id="birthDate"
        label="Data de nascimento"
        type="date"
        value={birthDate}
        onChange={setBirthDate}
        error={errors.birthDate}
        touched={true}
        required
      />
      
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        touched={!!email}
      />
      
      <div className="flex gap-3 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button 
          type="button"
          className="flex-1"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
