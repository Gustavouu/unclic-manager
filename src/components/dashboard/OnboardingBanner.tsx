
import React, { useEffect, useState } from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { safeJsonParse } from '@/utils/databaseUtils';

interface OnboardingBannerProps {
  onDismiss: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ onDismiss }) => {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const { businessId, businessData, refreshBusinessData } = useTenant();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!businessId) {
        console.log('No business ID available, assuming onboarding is needed');
        setNeedsOnboarding(true);
        setIsVerifying(false);
        return;
      }

      try {
        console.log(`Verifying onboarding status for business: ${businessId}`);
        setIsVerifying(true);

        // First check if business data is available and status is active
        if (businessData && businessData.status === 'active') {
          console.log('Business is active, no need for onboarding');
          setNeedsOnboarding(false);
          setIsVerifying(false);
          return;
        }

        // Use the RPC function to check and fix onboarding status
        const { data: verificationResult, error: verificationError } = await supabase
          .rpc('verificar_completar_onboarding', {
            business_id_param: businessId
          });
        
        if (verificationError) {
          console.error('Error verifying onboarding:', verificationError);
          // Default to showing banner on error
          setNeedsOnboarding(true);
        } else {
          console.log('Onboarding verification result:', verificationResult);
          
          if (verificationResult) {
            // Parse the result safely
            const parsedResult = safeJsonParse(verificationResult, {});
            
            // Check for success and onboarding status
            const isSuccess = parsedResult.success === true;
            const isComplete = parsedResult.onboarding_complete === true;
            
            setNeedsOnboarding(!isComplete);
            
            // Refresh business data to get updated status
            await refreshBusinessData();
          } else {
            // Default to showing banner if response is unexpected
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
  }, [businessId, businessData, refreshBusinessData]);

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
