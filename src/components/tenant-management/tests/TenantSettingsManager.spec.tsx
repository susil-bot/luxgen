import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TenantSettingsManager from '../TenantSettingsManager';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../services/apiClient', () => ({
  put: jest.fn(),
}));

const mockTenant = {
  id: 'tenant-1',
  name: 'Test Company',
  slug: 'test-company',
  domain: 'test.com',
  status: 'active',
  plan: {
    type: 'professional',
    name: 'Professional',
    pricing: { monthly: 99, yearly: 999, currency: 'USD' },
    limits: { users: 100, storage: 100, apiCalls: 10000, customDomains: 2, integrations: 10 },
  },
  settings: {
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      supportEmail: 'support@test.com',
    },
    security: {
      mfaRequired: false,
      sessionTimeout: 240,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        preventCommonPasswords: true,
        maxAge: 90,
      },
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    features: {
      enableAI: true,
      enableAnalytics: true,
      enableIntegrations: true,
      enableCustomDomain: false,
      enableSSO: false,
      enableAuditLogs: false,
    },
  },
  limits: {
    current: { users: 25, storage: 10, apiCalls: 5000, customDomains: 1, integrations: 3 },
    usage: { storageUsed: 10, apiCallsUsed: 5000, lastReset: new Date() },
  },
  metadata: {
    industry: 'Technology',
    size: 'medium',
    region: 'North America',
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD',
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

describe('TenantSettingsManager', () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  const defaultProps = {
    tenant: mockTenant,
    isOpen: true,
    onClose: mockOnClose,
    onUpdate: mockOnUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders when open', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      expect(screen.getByText('Tenant Settings')).toBeInTheDocument();
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Branding')).toBeInTheDocument();
    });

    test('does not render when closed', () => {
      render(<TenantSettingsManager {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Tenant Settings')).not.toBeInTheDocument();
    });

    test('displays tenant name in header', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      expect(screen.getByText('Tenant Settings')).toBeInTheDocument();
    });

    test('shows settings tabs', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Branding')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Integrations')).toBeInTheDocument();
      expect(screen.getByText('Billing')).toBeInTheDocument();
      expect(screen.getByText('Usage & Limits')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    test('starts with general tab active', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    test('can switch to security tab', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const securityTab = screen.getByText('Security');
      fireEvent.click(securityTab);
      
      await waitFor(() => {
        expect(screen.getByText('Security Settings')).toBeInTheDocument();
      });
    });

    test('can switch to branding tab', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const brandingTab = screen.getByText('Branding');
      fireEvent.click(brandingTab);
      
      await waitFor(() => {
        expect(screen.getByText('Branding settings coming soon...')).toBeInTheDocument();
      });
    });

    test('can switch to notifications tab', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const notificationsTab = screen.getByText('Notifications');
      fireEvent.click(notificationsTab);
      
      await waitFor(() => {
        expect(screen.getByText('Notification settings coming soon...')).toBeInTheDocument();
      });
    });
  });

  describe('General Settings', () => {
    test('displays company name field', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      expect(companyNameInput).toBeInTheDocument();
    });

    test('displays domain field', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const domainInput = screen.getByDisplayValue('test.com');
      expect(domainInput).toBeInTheDocument();
    });

    test('displays timezone selector', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const timezoneSelect = screen.getByDisplayValue('Eastern Time');
      expect(timezoneSelect).toBeInTheDocument();
    });

    test('displays language selector', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const languageSelect = screen.getByDisplayValue('English');
      expect(languageSelect).toBeInTheDocument();
    });

    test('validates required company name', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: '' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Company name is required')).toBeInTheDocument();
      });
    });

    test('validates domain format', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const domainInput = screen.getByDisplayValue('test.com');
      fireEvent.change(domainInput, { target: { value: 'invalid-domain' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid domain')).toBeInTheDocument();
      });
    });
  });

  describe('Security Settings', () => {
    beforeEach(async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const securityTab = screen.getByText('Security');
      fireEvent.click(securityTab);
      
      await waitFor(() => {
        expect(screen.getByText('Security Settings')).toBeInTheDocument();
      });
    });

    test('displays MFA toggle', () => {
      const mfaCheckbox = screen.getByRole('checkbox', { name: /multi-factor authentication/i });
      expect(mfaCheckbox).toBeInTheDocument();
      expect(mfaCheckbox).not.toBeChecked();
    });

    test('displays session timeout field', () => {
      const timeoutInput = screen.getByDisplayValue('240');
      expect(timeoutInput).toBeInTheDocument();
    });

    test('displays password policy settings', () => {
      expect(screen.getByText('Password Policy')).toBeInTheDocument();
      expect(screen.getByText('Minimum Length')).toBeInTheDocument();
      expect(screen.getByText('Require uppercase letters')).toBeInTheDocument();
      expect(screen.getByText('Require lowercase letters')).toBeInTheDocument();
      expect(screen.getByText('Require numbers')).toBeInTheDocument();
    });

    test('allows toggling MFA', () => {
      const mfaCheckbox = screen.getByRole('checkbox', { name: /multi-factor authentication/i });
      fireEvent.click(mfaCheckbox);
      expect(mfaCheckbox).toBeChecked();
    });

    test('allows changing session timeout', () => {
      const timeoutInput = screen.getByDisplayValue('240');
      fireEvent.change(timeoutInput, { target: { value: '120' } });
      expect(timeoutInput).toHaveValue(120);
    });

    test('allows changing password policy', () => {
      const minLengthInput = screen.getByDisplayValue('8');
      fireEvent.change(minLengthInput, { target: { value: '10' } });
      expect(minLengthInput).toHaveValue(10);
    });

    test('validates session timeout range', async () => {
      const timeoutInput = screen.getByDisplayValue('240');
      fireEvent.change(timeoutInput, { target: { value: '10' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Session timeout must be between 15 and 1440 minutes')).toBeInTheDocument();
      });
    });

    test('validates password minimum length', async () => {
      const minLengthInput = screen.getByDisplayValue('8');
      fireEvent.change(minLengthInput, { target: { value: '3' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Minimum password length must be at least 6 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Form State Management', () => {
    test('tracks changes and shows unsaved indicator', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    });

    test('disables save button when no changes', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeDisabled();
    });

    test('enables save button when changes are made', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).not.toBeDisabled();
    });

    test('clears errors when user starts typing', async () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: '' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Company name is required')).toBeInTheDocument();
      });
      
      fireEvent.change(companyNameInput, { target: { value: 'New Company' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Company name is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Save Functionality', () => {
    test('saves settings successfully', async () => {
      const mockApiClient = require('../../../services/apiClient');
      mockApiClient.put.mockResolvedValue({
        success: true,
        data: { ...mockTenant, name: 'Updated Company' },
      });

      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockApiClient.put).toHaveBeenCalledWith(
          `/api/tenants/${mockTenant.id}`,
          expect.objectContaining({
            name: 'Updated Company',
          })
        );
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Settings saved successfully!');
      });
    });

    test('handles save errors', async () => {
      const mockApiClient = require('../../../services/apiClient');
      mockApiClient.put.mockRejectedValue(new Error('API Error'));

      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('An error occurred while saving settings');
      });
    });

    test('shows loading state during save', async () => {
      const mockApiClient = require('../../../services/apiClient');
      mockApiClient.put.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    test('closes without confirmation when no changes', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('shows confirmation when closing with unsaved changes', async () => {
      // Mock confirm dialog
      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => true);

      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(window.confirm).toHaveBeenCalledWith('You have unsaved changes. Are you sure you want to close?');
      expect(mockOnClose).toHaveBeenCalled();
      
      window.confirm = originalConfirm;
    });

    test('does not close when user cancels confirmation', async () => {
      // Mock confirm dialog
      const originalConfirm = window.confirm;
      window.confirm = jest.fn(() => false);

      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
      
      window.confirm = originalConfirm;
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('supports keyboard navigation', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Changes');
      saveButton.focus();
      expect(saveButton).toHaveFocus();
    });

    test('has proper focus management', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    test('adapts to different screen sizes', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-6xl');
    });

    test('maintains functionality on mobile', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    test('calls onUpdate when settings are saved', async () => {
      const mockApiClient = require('../../../services/apiClient');
      const updatedTenant = { ...mockTenant, name: 'Updated Company' };
      mockApiClient.put.mockResolvedValue({
        success: true,
        data: updatedTenant,
      });

      render(<TenantSettingsManager {...defaultProps} />);
      
      const companyNameInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyNameInput, { target: { value: 'Updated Company' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(updatedTenant);
      });
    });

    test('calls onClose when modal is closed', () => {
      render(<TenantSettingsManager {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
}); 