import React from 'react';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import OnboardingTrigger from '../onboarding/OnboardingTrigger';

const ProtectedLayout: React.FC = () => {
  return (
    <>
      <OnboardingFlow />
      <OnboardingTrigger />
    </>
  );
};

export default ProtectedLayout; 