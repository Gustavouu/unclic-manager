
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TenantProvider } from '@/contexts/TenantContext';
import { OnboardingProvider } from '@/contexts/onboarding/OnboardingContext';

// Add any providers here
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TenantProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </TenantProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
