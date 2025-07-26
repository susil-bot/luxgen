import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingStep1: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    updateOnboardingData({ [field]: value });
  };

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          Welcome to LuxGen! 👋
        </h2>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
          Let's start by getting to know you better. This will help us personalize your experience and set up your account just right.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="fullName"
              value={onboardingData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-sm sm:text-base"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Role *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <select
              id="role"
              value={onboardingData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-sm sm:text-base"
              required
            >
              <option value="">Select your role</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
              <option value="executive">Executive</option>
              <option value="hr-professional">HR Professional</option>
              <option value="trainer">Trainer</option>
              <option value="consultant">Consultant</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organization *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <input
              type="text"
              id="organization"
              value={onboardingData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-sm sm:text-base"
              placeholder="Enter your organization name"
              required
            />
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-2">
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Team Size *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <select
              id="teamSize"
              value={onboardingData.teamSize}
              onChange={(e) => handleInputChange('teamSize', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-sm sm:text-base"
              required
            >
              <option value="">Select team size</option>
              <option value="1-10">1-10 people</option>
              <option value="11-50">11-50 people</option>
              <option value="51-200">51-200 people</option>
              <option value="201-1000">201-1000 people</option>
              <option value="1000+">1000+ people</option>
            </select>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                Don't worry, you can always update this information later in your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep1; 