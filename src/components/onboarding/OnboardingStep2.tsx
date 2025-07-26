import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingStep2: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const goalOptions = [
    {
      id: 'communication',
      title: 'Communication Skills',
      description: 'Improve public speaking, active listening, and team communication',
      icon: '💬',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'leadership',
      title: 'Leadership Development',
      description: 'Build confidence, decision-making, and team management skills',
      icon: '👑',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'emotional-intelligence',
      title: 'Emotional Intelligence',
      description: 'Develop self-awareness, empathy, and relationship management',
      icon: '🧠',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'strategic-thinking',
      title: 'Strategic Thinking',
      description: 'Enhance problem-solving, planning, and long-term vision',
      icon: '🎯',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'team-building',
      title: 'Team Building',
      description: 'Learn to motivate, inspire, and develop high-performing teams',
      icon: '🤝',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'change-management',
      title: 'Change Management',
      description: 'Navigate organizational change and guide teams through transitions',
      icon: '🔄',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution',
      description: 'Handle difficult conversations and resolve team conflicts effectively',
      icon: '⚖️',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'time-management',
      title: 'Time Management',
      description: 'Prioritize tasks, delegate effectively, and maximize productivity',
      icon: '⏰',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const handleGoalToggle = (goalId: string) => {
    const currentGoals = onboardingData.goals;
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    
    updateOnboardingData({ goals: updatedGoals });
  };

  const isGoalSelected = (goalId: string) => onboardingData.goals.includes(goalId);

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          What are your goals? 🎯
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Select the areas where you'd like to grow as a leader. We'll customize your training experience based on your goals.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {goalOptions.map((goal, index) => (
            <div
              key={goal.id}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isGoalSelected(goal.id) 
                  ? 'ring-2 ring-primary-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  isGoalSelected(goal.id)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                {/* Selection Indicator */}
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  isGoalSelected(goal.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {isGoalSelected(goal.id) && (
                    <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Goal Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-lg flex items-center justify-center mb-4 text-2xl`}>
                  {goal.icon}
                </div>

                {/* Goal Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {goal.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {goal.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        {onboardingData.goals.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Great! You've selected <strong>{onboardingData.goals.length}</strong> goal{onboardingData.goals.length !== 1 ? 's' : ''}. 
                  We'll tailor your experience to focus on these areas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> Choose 2-4 goals for the best learning experience. You can always add or remove goals later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2; 