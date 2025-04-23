import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const OnboardingControls: React.FC = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    isComplete, 
    saveProgress,
    businessData,
    services,
    staffMembers,
    businessHours,
    hasStaff
  } = useOnboarding();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleNext = () => {
    // Validar dados do estabelecimento antes de avançar
    if (currentStep === 0) {
      if (!businessData.name || !businessData.email || !businessData.phone) {
        toast.error("Preencha os campos obrigatórios para continuar");
        return;
      }
      if (!businessData.cep || !businessData.address || !businessData.number) {
        toast.error("Preencha o endereço completo para continuar");
        return;
      }
    }
    
    // Avançar para próximo passo
    if (currentStep < 4) {
      // Salva progresso antes de avançar
      saveProgress();
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      // Salva progresso antes de voltar
      saveProgress();
      setCurrentStep(currentStep - 1);
    }
  };
  
  const createBusinessSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };
  
  const handleFinish = async () => {
    if (!isComplete()) {
      toast.error("Preencha todas as informações obrigatórias antes de finalizar");
      return;
    }
    
    if (!user) {
      toast.error("Você precisa estar autenticado para criar um negócio");
      navigate("/login");
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Criando novo negócio:", businessData);
      
      // Gerar slug do negócio
      const slug = createBusinessSlug(businessData.name);
      
      // 1. Criar o registro do negócio
      const { data: businessRecord, error: businessError } = await supabase
        .from('negocios')
        .insert([
          {
            nome: businessData.name,
            email_admin: businessData.email,
            telefone: businessData.phone,
            endereco: businessData.address,
            numero: businessData.number,
            bairro: businessData.neighborhood,
            cidade: businessData.city,
            estado: businessData.state,
            cep: businessData.cep,
            slug: slug,
            status: 'ativo'
          }
        ])
        .select('id')
        .single();
      
      if (businessError || !businessRecord) {
        console.error("Erro ao criar negócio:", businessError);
        throw new Error(businessError?.message || "Erro ao criar negócio");
      }
      
      const businessId = businessRecord.id;
      console.log("Negócio criado com ID:", businessId);
      
      // 2. Atualizar o perfil do usuário com o ID do negócio
      const { error: userError } = await supabase
        .from('usuarios')
        .update({ id_negocio: businessId })
        .eq('id', user.id);
      
      if (userError) {
        console.error("Erro ao atualizar perfil do usuário:", userError);
        throw new Error(userError.message);
      }
      
      // 3. Criar o perfil de acesso do usuário (administrador)
      const { error: profileError } = await supabase
        .from('perfis_acesso')
        .insert([
          {
            id_usuario: user.id,
            id_negocio: businessId,
            e_administrador: true,
            acesso_configuracoes: true,
            acesso_agendamentos: true,
            acesso_clientes: true,
            acesso_financeiro: true,
            acesso_estoque: true,
            acesso_marketing: true,
            acesso_relatorios: true
          }
        ]);
      
      if (profileError) {
        console.error("Erro ao criar perfil de acesso:", profileError);
        throw new Error(profileError.message);
      }
      
      // 4. Criar serviços
      if (services.length > 0) {
        const servicesData = services.map(service => ({
          id_negocio: businessId,
          nome: service.name,
          descricao: service.description || null,
          preco: service.price,
          duracao: service.duration,
          ativo: true
        }));
        
        const { error: servicesError } = await supabase
          .from('servicos')
          .insert(servicesData);
        
        if (servicesError) {
          console.error("Erro ao criar serviços:", servicesError);
          toast.error("Alguns serviços podem não ter sido salvos corretamente");
        }
      }
      
      // 5. Criar funcionários (se aplicável)
      if (hasStaff && staffMembers.length > 0) {
        const staffData = staffMembers.map(staff => ({
          id_negocio: businessId,
          nome: staff.name,
          email: staff.email || null,
          telefone: staff.phone || null,
          especializacoes: staff.specialties || null,
          status: 'ativo'
        }));
        
        const { error: staffError } = await supabase
          .from('funcionarios')
          .insert(staffData);
        
        if (staffError) {
          console.error("Erro ao criar funcionários:", staffError);
          toast.error("Alguns funcionários podem não ter sido salvos corretamente");
        }
      }
      
      toast.success("Estabelecimento configurado com sucesso!");
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Erro ao finalizar configuração:", error);
      toast.error(error.message || "Erro ao finalizar configuração");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={handlePrevious} 
        disabled={currentStep === 0 || isSaving}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      
      <Button
        onClick={currentStep === 4 ? handleFinish : handleNext}
        variant={currentStep === 4 ? "default" : "default"}
        disabled={isSaving}
      >
        {currentStep === 4 ? (
          <>
            {isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Finalizar
              </>
            )}
          </>
        ) : (
          <>
            Avançar <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
