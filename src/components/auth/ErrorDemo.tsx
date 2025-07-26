import React, { useState } from 'react';
import ErrorDisplay from '../common/ErrorDisplay';

const ErrorDemo: React.FC = () => {
  const [selectedError, setSelectedError] = useState<string>('');

  const errorScenarios = {
    // Login Errors
    'USER_NOT_FOUND': {
      response: { status: 404, data: { code: 'USER_NOT_FOUND', message: 'User not found' } }
    },
    'INVALID_CREDENTIALS': {
      response: { status: 401, data: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }
    },
    'ACCOUNT_LOCKED': {
      response: { status: 423, data: { code: 'ACCOUNT_LOCKED', message: 'Account locked' } }
    },
    'EMAIL_NOT_VERIFIED': {
      response: { status: 403, data: { code: 'EMAIL_NOT_VERIFIED', message: 'Email not verified' } }
    },
    'TENANT_NOT_FOUND': {
      response: { status: 404, data: { code: 'TENANT_NOT_FOUND', message: 'Tenant not found' } }
    },

    // Registration Errors
    'EMAIL_ALREADY_EXISTS': {
      response: { status: 409, data: { code: 'EMAIL_ALREADY_EXISTS', message: 'Email already exists' } }
    },
    'WEAK_PASSWORD': {
      response: { status: 400, data: { code: 'WEAK_PASSWORD', message: 'Password too weak' } }
    },
    'DOMAIN_NOT_ALLOWED': {
      response: { status: 403, data: { code: 'DOMAIN_NOT_ALLOWED', message: 'Domain not allowed' } }
    },
    'PHONE_ALREADY_EXISTS': {
      response: { status: 409, data: { code: 'PHONE_ALREADY_EXISTS', message: 'Phone already exists' } }
    },

    // Network/Server Errors
    'NETWORK_ERROR': {
      message: 'Network Error',
      code: 'NETWORK_ERROR'
    },
    'RATE_LIMIT_EXCEEDED': {
      response: { status: 429, data: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } }
    },
    'SERVER_ERROR': {
      response: { status: 500, data: { code: 'SERVER_ERROR', message: 'Internal server error' } }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Error Examples</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Error Selector */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Error Scenario</h2>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Login Errors</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSelectedError('USER_NOT_FOUND')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">User Not Found</div>
                <div className="text-sm text-gray-600">No account with this email</div>
              </button>
              
              <button
                onClick={() => setSelectedError('INVALID_CREDENTIALS')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Invalid Credentials</div>
                <div className="text-sm text-gray-600">Wrong email or password</div>
              </button>
              
              <button
                onClick={() => setSelectedError('ACCOUNT_LOCKED')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Account Locked</div>
                <div className="text-sm text-gray-600">Too many failed attempts</div>
              </button>
              
              <button
                onClick={() => setSelectedError('EMAIL_NOT_VERIFIED')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Email Not Verified</div>
                <div className="text-sm text-gray-600">Need to verify email first</div>
              </button>
              
              <button
                onClick={() => setSelectedError('TENANT_NOT_FOUND')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Tenant Not Found</div>
                <div className="text-sm text-gray-600">Organization domain not found</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Registration Errors</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSelectedError('EMAIL_ALREADY_EXISTS')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Email Already Exists</div>
                <div className="text-sm text-gray-600">Account already registered</div>
              </button>
              
              <button
                onClick={() => setSelectedError('WEAK_PASSWORD')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Weak Password</div>
                <div className="text-sm text-gray-600">Password doesn't meet requirements</div>
              </button>
              
              <button
                onClick={() => setSelectedError('DOMAIN_NOT_ALLOWED')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Domain Not Allowed</div>
                <div className="text-sm text-gray-600">Email domain not permitted</div>
              </button>
              
              <button
                onClick={() => setSelectedError('PHONE_ALREADY_EXISTS')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Phone Already Exists</div>
                <div className="text-sm text-gray-600">Phone number already registered</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">System Errors</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSelectedError('NETWORK_ERROR')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Network Error</div>
                <div className="text-sm text-gray-600">Connection failed</div>
              </button>
              
              <button
                onClick={() => setSelectedError('RATE_LIMIT_EXCEEDED')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Rate Limited</div>
                <div className="text-sm text-gray-600">Too many requests</div>
              </button>
              
              <button
                onClick={() => setSelectedError('SERVER_ERROR')}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Server Error</div>
                <div className="text-sm text-gray-600">Internal server error</div>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Error Display</h2>
          
          {selectedError ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Login Form Context</h3>
                <ErrorDisplay
                  error={errorScenarios[selectedError as keyof typeof errorScenarios]}
                  context="login"
                  onDismiss={() => setSelectedError('')}
                  onAction={(action) => {
                    console.log('Action clicked:', action);
                    alert(`Action: ${action}`);
                  }}
                />
              </div>
              
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Registration Form Context</h3>
                <ErrorDisplay
                  error={errorScenarios[selectedError as keyof typeof errorScenarios]}
                  context="register"
                  onDismiss={() => setSelectedError('')}
                  onAction={(action) => {
                    console.log('Action clicked:', action);
                    alert(`Action: ${action}`);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>Select an error scenario from the left to see how it's displayed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDemo; 