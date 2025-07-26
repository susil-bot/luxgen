import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { Send, Mail, Bell, Zap, Star, CreditCard, Search, Star as StarIcon, CheckCircle } from 'lucide-react';

export interface FeedbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (feedback: { rating: number; message: string; category: string }) => void;
}

export const SendFeedbackModal: React.FC<FeedbackFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && message.trim()) {
      onSubmit?.({ rating, message: message.trim(), category });
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Feedback"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your experience?
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  <StarIcon className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement Suggestion</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Tell us what you think..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={rating === 0 || !message.trim()}
            className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Send Feedback
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (email: string, preferences: string[]) => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe?.(email.trim(), preferences);
      onClose();
    }
  };

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscribe to Newsletter"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
            <Mail className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stay Updated
          </h3>
          <p className="text-gray-600">
            Get the latest updates, tips, and insights delivered to your inbox.
          </p>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to receive?
            </label>
            <div className="space-y-2">
              {[
                'Product Updates',
                'Training Tips',
                'Industry News',
                'Special Offers'
              ].map((pref) => (
                <label key={pref} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.includes(pref)}
                    onChange={() => togglePreference(pref)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{pref}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!email.trim()}
            className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Subscribe
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  title = "Important Announcement",
  message = "We have some important news to share with you.",
  type = 'info'
}) => {
  const typeStyles = {
    info: { icon: Bell, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    success: { icon: Bell, bgColor: 'bg-green-100', textColor: 'text-green-600' },
    warning: { icon: Bell, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    error: { icon: Bell, bgColor: 'bg-red-100', textColor: 'text-red-600' }
  };

  const IconComponent = typeStyles[type].icon;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className={`flex-shrink-0 p-3 rounded-lg ${typeStyles[type].bgColor}`}>
            <IconComponent className={`h-6 w-6 ${typeStyles[type].textColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (integration: string) => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const integrations = [
    { id: 'slack', name: 'Slack', description: 'Connect with your Slack workspace', icon: '💬' },
    { id: 'zoom', name: 'Zoom', description: 'Integrate with Zoom meetings', icon: '📹' },
    { id: 'google', name: 'Google Calendar', description: 'Sync with Google Calendar', icon: '📅' },
    { id: 'microsoft', name: 'Microsoft Teams', description: 'Connect with Teams', icon: '💼' }
  ];

  const handleConnect = (integrationId: string) => {
    onConnect?.(integrationId);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect Integrations"
      size="lg"
    >
      <div className="p-6">
        <p className="text-gray-600 mb-6">
          Connect your favorite tools to enhance your training experience.
        </p>
        
        <div className="grid gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleConnect(integration.id)}
                className="px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  version?: string;
  features?: Array<{ title: string; description: string; type: 'new' | 'improved' | 'fixed' }>;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isOpen,
  onClose,
  version = "v2.1.0",
  features = [
    { title: "Enhanced Search", description: "Improved search functionality with better results", type: 'new' as const },
    { title: "Dark Mode", description: "Added dark mode support for better user experience", type: 'new' as const },
    { title: "Performance", description: "Faster loading times and better responsiveness", type: 'improved' as const },
    { title: "Bug Fixes", description: "Fixed various minor issues and bugs", type: 'fixed' as const }
  ]
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'improved': return 'bg-blue-100 text-blue-800';
      case 'fixed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`What's New in ${version}`}
      size="lg"
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
            <Star className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600">
            Check out the latest features and improvements we've added to make your experience better.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(feature.type)}`}>
                {feature.type}
              </span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onUpgrade?: (plan: string) => void;
}

export const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  isOpen,
  onClose,
  currentPlan = "Basic",
  onUpgrade
}) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9',
      features: ['Up to 10 trainees', 'Basic analytics', 'Email support'],
      current: currentPlan === 'Basic'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$29',
      features: ['Up to 50 trainees', 'Advanced analytics', 'Priority support', 'Custom branding'],
      current: currentPlan === 'Professional'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      features: ['Unlimited trainees', 'Full analytics suite', '24/7 support', 'Custom integrations'],
      current: currentPlan === 'Enterprise'
    }
  ];

  const handleUpgrade = (planId: string) => {
    onUpgrade?.(planId);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Your Plan"
      size="xl"
    >
      <div className="p-6">
        <p className="text-gray-600 mb-6 text-center">
          Choose the plan that best fits your needs. You can change your plan at any time.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 border rounded-lg ${
                plan.current 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="text-3xl font-bold text-purple-600 mt-2">{plan.price}</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.current}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  plan.current
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {plan.current ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export interface QuickFindModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: { id: string; title: string; type: string }) => void;
}

export const QuickFindModal: React.FC<QuickFindModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: Search },
    { id: 'trainees', name: 'Trainees', icon: Search },
    { id: 'courses', name: 'Courses', icon: Search },
    { id: 'sessions', name: 'Sessions', icon: Search },
    { id: 'reports', name: 'Reports', icon: Search }
  ];

  const items = [
    { id: '1', title: 'John Doe', type: 'trainee', category: 'trainees' },
    { id: '2', title: 'Leadership Fundamentals', type: 'course', category: 'courses' },
    { id: '3', title: 'Session 1: Introduction', type: 'session', category: 'sessions' },
    { id: '4', title: 'Monthly Progress Report', type: 'report', category: 'reports' },
    { id: '5', title: 'Jane Smith', type: 'trainee', category: 'trainees' },
    { id: '6', title: 'Advanced Communication', type: 'course', category: 'courses' }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (item: any) => {
    onSelect?.(item);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Find"
      size="lg"
    >
      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for trainees, courses, sessions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {item.type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No results found
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}; 