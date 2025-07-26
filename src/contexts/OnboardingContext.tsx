import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  onboardingData: OnboardingData;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  skipOnboarding: () => void;
}

interface OnboardingData {
  fullName: string;
  role: string;
  organization: string;
  teamSize: string;
  goals: string[];
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    emailUpdates: boolean;
  };
}

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
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    fullName: '',
    role: '',
    organization: '',
    teamSize: '',
    goals: [],
    preferences: {
      notifications: true,
      darkMode: false,
      emailUpdates: true,
    },
  });

  const totalSteps = 4;

  // Check if user needs onboarding on mount
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    const isNewUser = !hasCompletedOnboarding;
    
    if (isNewUser) {
      setIsOnboarding(true);
    }
  }, []);

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep(1);
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
  };

  const skipOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const value: OnboardingContextType = {
    isOnboarding,
    currentStep,
    totalSteps,
    onboardingData,
    startOnboarding,
    completeOnboarding,
    nextStep,
    prevStep,
    goToStep,
    updateOnboardingData,
    skipOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}; 