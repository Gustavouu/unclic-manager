
import React, { useEffect, useState } from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

interface OnboardingBannerProps {
  onDismiss: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ onDismiss }) => {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const { businessId } = useTenant();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!businessId) {
        setNeedsOnboarding(true);
        setIsVerifying(false);
        return;
      }

      try {
        setIsVerifying(true);

        // Use our new RPC function to check onboarding status
        const { data: verificationResult, error: verificationError } = await supabase
          .rpc('verificar_completar_onboarding', {
            business_id_param: businessId
          });
        
        if (verificationError) {
          console.error('Error verifying onboarding:', verificationError);
          
          // Check if business is active via direct query as fallback
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('status')
            .eq('id', businessId)
            .maybeSingle();
          
          if (businessError) {
            console.error('Error checking business status:', businessError);
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(businessData?.status !== 'active');
          }
        } else {
          // Use the verification result - now with the correct property access
          if (verificationResult && typeof verificationResult === 'object') {
            setNeedsOnboarding(!verificationResult.onboarding_complete);
            
            if (verificationResult.onboarding_complete) {
              console.log('Onboarding is complete');
            } else {
              console.log('Onboarding is incomplete, missing steps:', verificationResult.missing_steps);
            }
          } else {
            console.log('Unexpected verification result format:', verificationResult);
            setNeedsOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error in checkOnboardingStatus:', error);
        setNeedsOnboarding(true);
      } finally {
        setIsVerifying(false);
      }
    };

    checkOnboardingStatus();
  }, [businessId]);

  const handleCompleteSetup = () => {
    window.location.href = '/onboarding';
  };

  // If we're still verifying or onboarding is not needed, don't show the banner
  if (isVerifying || !needsOnboarding) {
    return null;
  }

  return (
    <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6 relative">
      <button 
        onClick={onDismiss} 
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/10"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Complete seu perfil</h3>
          <p className="text-sm text-muted-foreground">
            Configure seu negócio e comece a receber agendamentos!
          </p>
        </div>
        <Button 
          size="sm" 
          className="md:w-auto w-full"
          onClick={handleCompleteSetup}
        >
          Completar configuração
        </Button>
      </div>
    </div>
  );
};
