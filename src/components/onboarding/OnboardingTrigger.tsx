import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingTrigger: React.FC = () => {
  const { startOnboarding, isOnboarding } = useOnboarding();

  if (isOnboarding) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={startOnboarding}
        className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        title="Start Onboarding"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    </div>
  );
};

export default OnboardingTrigger; 