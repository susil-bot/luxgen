import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingStep3: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePreferenceChange = (key: string, value: boolean) => {
    updateOnboardingData({
      preferences: {
        ...onboardingData.preferences,
        [key]: value
      }
    });
  };

  const preferenceOptions = [
    {
      key: 'notifications',
      title: 'Push Notifications',
      description: 'Get real-time updates about your training progress and new content',
      icon: '🔔',
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'darkMode',
      title: 'Dark Mode',
      description: 'Prefer a darker interface? We\'ll remember your choice',
      icon: '🌙',
      color: 'from-purple-500 to-purple-600'
    },
    {
      key: 'emailUpdates',
      title: 'Email Updates',
      description: 'Receive weekly summaries and personalized recommendations',
      icon: '📧',
      color: 'from-green-500 to-green-600'
    }
  ];

  const ToggleSwitch: React.FC<{ 
    enabled: boolean; 
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
  }> = ({ enabled, onChange, disabled = false }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        enabled 
          ? 'bg-primary-600' 
          : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          Customize Your Experience ⚙️
        </h2>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
          Let's personalize your LuxGen experience. You can change these settings anytime.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        {preferenceOptions.map((option, index) => (
          <div
            key={option.key}
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-md ${
              onboardingData.preferences[option.key as keyof typeof onboardingData.preferences]
                ? 'ring-2 ring-primary-500/20'
                : ''
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Icon */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${option.color} rounded-lg flex items-center justify-center text-xl sm:text-2xl`}>
                  {option.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
              
              {/* Toggle */}
              <div className="ml-4">
                <ToggleSwitch
                  enabled={onboardingData.preferences[option.key as keyof typeof onboardingData.preferences] as boolean}
                  onChange={(enabled) => handlePreferenceChange(option.key, enabled)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Preview Section */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Your Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  onboardingData.preferences.notifications
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {onboardingData.preferences.notifications ? 'On' : 'Off'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time updates enabled
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  onboardingData.preferences.darkMode
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {onboardingData.preferences.darkMode ? 'Dark' : 'Light'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interface preference set
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Updates</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  onboardingData.preferences.emailUpdates
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {onboardingData.preferences.emailUpdates ? 'On' : 'Off'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Weekly summaries enabled
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> These preferences will be applied immediately and can be changed anytime in your settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep3; 