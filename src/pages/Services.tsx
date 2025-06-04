
import React from 'react';
import { ServicesManager } from '@/components/services/ServicesManager';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

const Services = () => {
  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <ServicesManager />
      </div>
    </OnboardingRedirect>
  );
};

export default Services;
