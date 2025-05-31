
import React, { createContext, useContext, useState, useEffect } from 'react';
import { OnboardingContextType, OnboardingMethod, OnboardingStatus } from './types';
import { useBusinessDataState } from './hooks/useBusinessDataState';
import { useServicesState } from './hooks/useServicesState';
import { useStaffState } from './hooks/useStaffState';
import { useBusinessHoursState } from './hooks/useBusinessHoursState';
import { useCompletion } from './hooks/useCompletion';
import { usePersistence } from './hooks/usePersistence';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingMethod, setOnboardingMethod] = useState<OnboardingMethod>(null);
  const [status, setStatus] = useState<OnboardingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const { businessData, updateBusinessData } = useBusinessDataState({
    id: '',
    name: '',
    description: '',
    logoUrl: '',
    phone: '',
    address: '',
    addressNumber: '',
    city: '',
    state: '',
    zipCode: '',
    adminEmail: '',
    neighborhood: '',
    ownerName: '',
    businessType: '',
  });

  const { services, addService, updateService, removeService } = useServicesState();
  const { staff, addStaff, updateStaff, removeStaff } = useStaffState();
  const { businessHours, updateBusinessHours } = useBusinessHoursState();
  const { completeOnboarding } = useCompletion(businessData, services, staff, businessHours);
  const { saveProgress, loadProgress } = usePersistence(
    currentStep,
    businessData,
    services,
    staff,
    businessHours,
    onboardingMethod
  );

  // Fix businessData normalization
  const normalizedBusinessData = {
    ...businessData,
    zipCode: businessData.zipCode || businessData.cep || '',
    addressNumber: businessData.addressNumber || businessData.number || '',
    adminEmail: businessData.adminEmail || businessData.email || '',
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setOnboardingMethod(null);
    setStatus('idle');
    setError(null);
    updateBusinessData({
      id: '',
      name: '',
      description: '',
      logoUrl: '',
      phone: '',
      address: '',
      addressNumber: '',
      city: '',
      state: '',
      zipCode: '',
      adminEmail: '',
      neighborhood: '',
      ownerName: '',
      businessType: '',
    });
  };

  const value: OnboardingContextType = {
    currentStep,
    businessData: normalizedBusinessData,
    services,
    staff,
    businessHours,
    isComplete: status === 'complete',
    onboardingMethod,
    status,
    error,
    setCurrentStep,
    updateBusinessData,
    addService,
    updateService,
    removeService,
    addStaff,
    updateStaff,
    removeStaff,
    updateBusinessHours,
    setOnboardingMethod,
    completeOnboarding,
    saveProgress,
    loadProgress,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
