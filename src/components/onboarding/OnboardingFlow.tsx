import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingProgress from './OnboardingProgress';

const OnboardingFlow: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { 
    isOnboarding, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep, 
    completeOnboarding,
    skipOnboarding,
    shouldShowOnboarding
  } = useOnboarding();

  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOnboarding) {
      setIsVisible(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOnboarding]);

  // Don't render onboarding flow for unauthenticated users or if shouldn't show
  if (!isAuthenticated || !shouldShowOnboarding()) return null;

  if (!isVisible) return null;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 />;
      case 2:
        return <OnboardingStep2 />;
      case 3:
        return <OnboardingStep3 />;
      case 4:
        return <OnboardingStep4 />;
      default:
        return <OnboardingStep1 />;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
      isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Onboarding Container */}
      <div className="relative w-full max-w-4xl mx-2 sm:mx-4 bg-white dark:bg-gray-900 rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Welcome to LuxGen
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Let's get you set up in just a few steps
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSkip}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Skip for now
            </button>
          </div>
          
          {/* Progress Bar */}
          <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="animate-fadeIn">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </div>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep} of {totalSteps}
              </span>
              
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="hidden sm:inline">{currentStep === totalSteps ? 'Complete Setup' : 'Next Step'}</span>
                <span className="sm:hidden">{currentStep === totalSteps ? 'Complete' : 'Next'}</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 