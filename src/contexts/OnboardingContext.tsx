import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  shouldShowOnboarding: () => boolean;
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
  const { isAuthenticated, user } = useAuth();
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

  // Check if user needs onboarding on mount - only for authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      setIsOnboarding(false);
      return;
    }

    // Add a small delay to prevent flashing on page load
    const timer = setTimeout(() => {
      const userOnboardingKey = user?.id ? `onboardingCompleted_${user.id}` : 'onboardingCompleted';
      const userHasCompletedOnboarding = localStorage.getItem(userOnboardingKey);
      
      // Only show onboarding if user is authenticated and hasn't completed it
      const shouldShowOnboarding = !userHasCompletedOnboarding && isAuthenticated;
      
      if (shouldShowOnboarding) {
        setIsOnboarding(true);
      } else {
        setIsOnboarding(false);
      }
    }, 100); // Small delay to prevent flashing

    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.id]);

  const startOnboarding = () => {
    if (!isAuthenticated) {
      console.warn('Cannot start onboarding: user not authenticated');
      return;
    }
    setIsOnboarding(true);
    setCurrentStep(1);
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    const userOnboardingKey = user?.id ? `onboardingCompleted_${user.id}` : 'onboardingCompleted';
    localStorage.setItem(userOnboardingKey, 'true');
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
  };

  const skipOnboarding = () => {
    setIsOnboarding(false);
    const userOnboardingKey = user?.id ? `onboardingCompleted_${user.id}` : 'onboardingCompleted';
    localStorage.setItem(userOnboardingKey, 'true');
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

  const shouldShowOnboarding = () => {
    if (!isAuthenticated) return false;
    const userOnboardingKey = user?.id ? `onboardingCompleted_${user.id}` : 'onboardingCompleted';
    const userHasCompletedOnboarding = localStorage.getItem(userOnboardingKey);
    return !userHasCompletedOnboarding;
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
    shouldShowOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}; 