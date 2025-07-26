import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'manage' | 'status';
  value: boolean | string;
  action?: string;
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'comments',
      label: 'Comments and replies',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      type: 'toggle',
      value: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      type: 'toggle',
      value: true,
    },
    {
      id: 'mentions',
      label: 'Mentions',
      description: 'Excepteur sint occaecat cupidatat non in culpa qui officia deserunt mollit.',
      type: 'toggle',
      value: false,
    },
    {
      id: 'shares-content',
      label: 'Shares of my content',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      type: 'manage',
      value: false,
      action: 'Manage',
    },
    {
      id: 'team-invites',
      label: 'Team invites',
      description: 'Excepteur sint occaecat cupidatat non in culpa qui officia deserunt mollit.',
      type: 'manage',
      value: false,
      action: 'Manage',
    },
    {
      id: 'smart-connection',
      label: 'Smart connection',
      description: 'Excepteur sint occaecat cupidatat non in culpa qui officia deserunt mollit.',
      type: 'status',
      value: 'Active',
      action: 'Disable',
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  const handleAction = (id: string) => {
    // Handle manage/disable actions
    console.log(`Action clicked for ${id}`);
  };

  const renderSetting = (setting: NotificationSetting) => {
    return (
      <div key={setting.id} className="border-b border-gray-200 py-6 last:border-b-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {setting.label}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {setting.description}
            </p>
          </div>
          
          <div className="ml-6 flex items-center">
            {setting.type === 'toggle' && (
              <button
                onClick={() => handleToggle(setting.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  setting.value ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
            
            {setting.type === 'manage' && (
              <button
                onClick={() => handleAction(setting.id)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {setting.action}
              </button>
            )}
            
            {setting.type === 'status' && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-green-600 font-medium">
                  {setting.value}
                </span>
                <button
                  onClick={() => handleAction(setting.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {setting.action}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const businessSettingsLinks = [
    { label: 'My Account', href: '/app/settings/account' },
    { label: 'My Notifications', href: '/app/settings/notifications', active: true },
    { label: 'Connected Apps', href: '/app/settings/connected-apps' },
    { label: 'Plans', href: '/app/settings/plans' },
    { label: 'Billing & Invoices', href: '/app/settings/billing' },
  ];

  const experienceLinks = [
    { label: 'Give Feedback', href: '/app/settings/feedback' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Settings
        </h1>
        <h2 className="text-lg text-gray-600">
          My Notifications
        </h2>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        {/* Business Settings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            BUSINESS SETTINGS
          </h3>
          <nav className="flex space-x-8">
            {businessSettingsLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium border-b-2 py-2 ${
                    isActive || link.active
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            EXPERIENCE
          </h3>
          <nav className="flex space-x-8">
            {experienceLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium border-b-2 py-2 ${
                    isActive
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Notification Settings
          </h3>
        </div>
        
        <div className="px-6 py-4">
          {/* General Section */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              General
            </h4>
            <div className="space-y-0">
              {settings.slice(0, 2).map(renderSetting)}
            </div>
          </div>

          {/* Mentions Section */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Mentions
            </h4>
            <div className="space-y-0">
              {renderSetting(settings[2])}
            </div>
          </div>

          {/* Shares Section */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Shares
            </h4>
            <div className="space-y-0">
              {settings.slice(3, 5).map(renderSetting)}
            </div>
          </div>

          {/* Smart Connection Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Smart connection
            </h4>
            <div className="space-y-0">
              {renderSetting(settings[5])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 