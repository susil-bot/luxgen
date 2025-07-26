import React from 'react';
import { NavLink } from 'react-router-dom';

const Feedback: React.FC = () => {
  const businessSettingsLinks = [
    { label: 'My Account', href: '/app/settings/account' },
    { label: 'My Notifications', href: '/app/settings/notifications' },
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
          Give Feedback
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

      {/* Feedback Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Share Your Feedback
          </h3>
        </div>
        
        <div className="px-6 py-8">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-4">Feedback functionality will be implemented here.</p>
            <p className="text-sm">This will include feedback forms, feature requests, and bug reporting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 