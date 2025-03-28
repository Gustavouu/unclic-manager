
import { useState, useEffect } from "react";
import { StepWelcome } from "./steps/StepWelcome";
import { BookingFormFlow } from "./BookingFormFlow";
import { BookingFlowProps } from "./types";
import { BookingProgress } from "./flow/BookingProgress";
import { StepNavigator } from "./flow/StepNavigator";
import { StepContent } from "./flow/StepContent";
import { CloseButton } from "./flow/CloseButton";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function WebsiteBookingFlow({ 
  businessName,
  closeFlow 
}: BookingFlowProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null);

  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        // Fetch business info including config
        const { data: business, error } = await supabase
          .from('negocios')
          .select(`
            id,
            nome,
            telefone,
            email_admin,
            configuracoes_negocio (*)
          `)
          .order('criado_em', { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        setBusinessData(business);
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessData();
  }, []);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));
  
  const getStepTitle = () => {
    switch (step) {
      case 0: return "Bem-vindo";
      case 1: return "Fazer Agendamento";
      default: return "";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 mb-16 px-4 bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-16 px-4 bg-white rounded-xl shadow-lg p-6 relative">
      <CloseButton onClick={closeFlow} />
      <StepNavigator step={step} prevStep={prevStep} />

      <BookingProgress step={step} getStepTitle={getStepTitle} />
      
      <StepContent step={step}>
        {step === 0 && (
          <StepWelcome 
            businessName={businessData?.nome || businessName} 
            nextStep={nextStep} 
          />
        )}
        {step === 1 && (
          <BookingFormFlow onComplete={closeFlow} />
        )}
      </StepContent>
    </div>
  );
}
