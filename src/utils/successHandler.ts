import React from 'react';
import { useNotifications } from '../components/common/NotificationSystem';

// Success Types
export interface SuccessAction {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
}

export interface SuccessMessage {
  title: string;
  message: string;
  action?: SuccessAction;
  duration?: number;
  autoDismiss?: boolean;
}

// Success Categories
export type SuccessCategory = 
  | 'authentication'
  | 'registration'
  | 'profile'
  | 'settings'
  | 'data'
  | 'operation'
  | 'general';

// Success Handler Class
export class SuccessHandler {
  private static instance: SuccessHandler;
  private notifications: any;

  private constructor() {}

  static getInstance(): SuccessHandler {
    if (!SuccessHandler.instance) {
      SuccessHandler.instance = new SuccessHandler();
    }
    return SuccessHandler.instance;
  }

  setNotifications(notifications: any) {
    this.notifications = notifications;
  }

  // Handle authentication success
  handleAuthSuccess(user: any, context?: string): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Welcome Back!',
      `Successfully signed in as ${user.firstName || user.email}`,
      {
        duration: 4000,
        action: {
          label: 'View Profile',
          onClick: () => window.location.href = '/profile'
        }
      }
    );
  }

  // Handle registration success
  handleRegistrationSuccess(user: any, requiresVerification: boolean = false): void {
    if (!this.notifications) return;

    if (requiresVerification) {
      this.notifications.showSuccess(
        'Account Created Successfully!',
        'Please check your email for verification instructions.',
        {
          duration: 6000,
          action: {
            label: 'Resend Email',
            onClick: async () => {
              try {
                // Import the API service dynamically to avoid circular dependencies
                const apiServices = (await import('../services/apiServices')).default;
                
                // Get the email and registrationId from localStorage
                const userEmail = localStorage.getItem('pendingVerificationEmail') || 
                                 JSON.parse(localStorage.getItem('userDetails') || '{}').email;
                const registrationId = localStorage.getItem('registrationId');
                
                if (!userEmail) {
                  this.notifications.showError('Error', 'Email address not found. Please try registering again.');
                  return;
                }
                
                if (!registrationId) {
                  this.notifications.showError('Error', 'Registration ID not found. Please try registering again.');
                  return;
                }
                
                const response = await apiServices.resendVerificationEmail({ 
                  email: userEmail, 
                  registrationId: registrationId 
                });
                
                if (response.success) {
                  this.notifications.showSuccess('Email Sent', 'Verification email has been resent successfully.');
                } else {
                  this.notifications.showError('Error', response.message || 'Failed to resend verification email.');
                }
              } catch (error) {
                console.error('Error resending verification email:', error);
                this.notifications.showError('Error', 'Failed to resend verification email. Please try again later.');
              }
            }
          }
        }
      );
    } else {
      this.notifications.showSuccess(
        'Account Created Successfully!',
        'Your account has been created successfully. You are now signed in.',
        {
          duration: 5000,
          action: {
            label: 'Get Started',
            onClick: () => window.location.href = '/dashboard'
          }
        }
      );
    }
  }

  // Handle profile update success
  handleProfileUpdateSuccess(field?: string): void {
    if (!this.notifications) return;

    const message = field 
      ? `Your ${field} has been updated successfully.`
      : 'Your profile has been updated successfully.';

    this.notifications.showSuccess(
      'Profile Updated',
      message,
      {
        duration: 4000,
        action: {
          label: 'View Profile',
          onClick: () => window.location.href = '/profile'
        }
      }
    );
  }

  // Handle settings update success
  handleSettingsUpdateSuccess(setting?: string): void {
    if (!this.notifications) return;

    const message = setting 
      ? `Your ${setting} settings have been updated successfully.`
      : 'Your settings have been updated successfully.';

    this.notifications.showSuccess(
      'Settings Updated',
      message,
      { duration: 4000 }
    );
  }

  // Handle data operation success
  handleDataSuccess(operation: string, item?: string): void {
    if (!this.notifications) return;

    const message = item 
      ? `${operation} completed successfully for ${item}.`
      : `${operation} completed successfully.`;

    this.notifications.showSuccess(
      'Operation Successful',
      message,
      { duration: 4000 }
    );
  }

  // Handle general success
  handleGeneralSuccess(title: string, message: string, options?: Partial<SuccessMessage>): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(title, message, {
      duration: options?.duration || 4000,
      action: options?.action
    });
  }

  // Handle logout success
  handleLogoutSuccess(): void {
    if (!this.notifications) return;

    this.notifications.showInfo(
      'Logged Out',
      'You have been successfully logged out.',
      { duration: 3000 }
    );
  }

  // Handle email verification success
  handleEmailVerificationSuccess(): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Email Verified!',
      'Your email has been verified successfully. You can now sign in.',
      {
        duration: 5000,
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/login'
        }
      }
    );
  }

  // Handle password reset success
  handlePasswordResetSuccess(): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Password Reset',
      'Your password has been reset successfully. You can now sign in with your new password.',
      {
        duration: 5000,
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/login'
        }
      }
    );
  }

  // Handle invitation success
  handleInvitationSuccess(email: string): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Invitation Sent',
      `Invitation has been sent to ${email} successfully.`,
      { duration: 4000 }
    );
  }

  // Handle bulk operation success
  handleBulkOperationSuccess(operation: string, count: number): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Bulk Operation Complete',
      `${operation} completed successfully for ${count} items.`,
      { duration: 5000 }
    );
  }

  // Handle export success
  handleExportSuccess(format: string, filename?: string, downloadUrl?: string): void {
    if (!this.notifications) return;

    // Store export data for download functionality
    if (downloadUrl) {
      localStorage.setItem('lastExportUrl', downloadUrl);
    }
    if (filename) {
      localStorage.setItem('lastExportFilename', filename);
    }

    const message = filename 
      ? `Your ${format.toUpperCase()} file "${filename}" has been exported successfully.`
      : `Your ${format.toUpperCase()} file has been exported successfully.`;

    this.notifications.showSuccess(
      'Export Complete',
      message,
      {
        duration: 5000,
        action: {
          label: 'Download',
          onClick: () => {
            try {
              // Get the download URL from localStorage or create a blob URL
              const downloadUrl = localStorage.getItem('lastExportUrl');
              const downloadFilename = localStorage.getItem('lastExportFilename') || 'exported-data';
              
              if (downloadUrl) {
                // Create a temporary link element to trigger download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = downloadFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.notifications.showSuccess('Download Started', 'Your file download has begun.');
              } else {
                // Fallback: create a sample download (for demo purposes)
                const sampleData = 'Sample exported data\nThis is a placeholder for actual exported content.';
                const blob = new Blob([sampleData], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `${downloadFilename}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up the blob URL
                URL.revokeObjectURL(url);
                
                this.notifications.showSuccess('Download Started', 'Sample file download has begun.');
              }
            } catch (error) {
              console.error('Error downloading file:', error);
              this.notifications.showError('Download Error', 'Failed to download the file. Please try again.');
            }
          }
        }
      }
    );
  }

  // Handle import success
  handleImportSuccess(count: number, type: string): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Import Complete',
      `Successfully imported ${count} ${type} items.`,
      { duration: 5000 }
    );
  }

  // Handle connection success
  handleConnectionSuccess(service: string): void {
    if (!this.notifications) return;

    this.notifications.showSuccess(
      'Connection Established',
      `Successfully connected to ${service}.`,
      { duration: 4000 }
    );
  }

  // Handle sync success
  handleSyncSuccess(items?: number): void {
    if (!this.notifications) return;

    const message = items 
      ? `Successfully synchronized ${items} items.`
      : 'Synchronization completed successfully.';

    this.notifications.showSuccess(
      'Sync Complete',
      message,
      { duration: 4000 }
    );
  }

  // Clear stored data (call this when user logs out or session ends)
  clearStoredData(): void {
    localStorage.removeItem('pendingVerificationEmail');
    localStorage.removeItem('registrationId');
    localStorage.removeItem('lastExportUrl');
    localStorage.removeItem('lastExportFilename');
  }

  // Generic success handler
  handleSuccess(category: SuccessCategory, data: any, context?: string): void {
    switch (category) {
      case 'authentication':
        this.handleAuthSuccess(data.user, context);
        break;
      case 'registration':
        this.handleRegistrationSuccess(data.user, data.requiresVerification);
        break;
      case 'profile':
        this.handleProfileUpdateSuccess(data.field);
        break;
      case 'settings':
        this.handleSettingsUpdateSuccess(data.setting);
        break;
      case 'data':
        this.handleDataSuccess(data.operation, data.item);
        break;
      case 'operation':
        this.handleGeneralSuccess(data.title, data.message, data.options);
        break;
      default:
        this.handleGeneralSuccess('Success', 'Operation completed successfully.');
    }
  }
}

// Hook for using success handler with notifications
export const useSuccessHandler = () => {
  const notifications = useNotifications();
  const successHandler = SuccessHandler.getInstance();
  
  // Set notifications when hook is used
  React.useEffect(() => {
    successHandler.setNotifications(notifications);
  }, [notifications]);

  return {
    handleAuthSuccess: (user: any, context?: string) => 
      successHandler.handleAuthSuccess(user, context),
    handleRegistrationSuccess: (user: any, requiresVerification?: boolean) => 
      successHandler.handleRegistrationSuccess(user, requiresVerification),
    handleProfileUpdateSuccess: (field?: string) => 
      successHandler.handleProfileUpdateSuccess(field),
    handleSettingsUpdateSuccess: (setting?: string) => 
      successHandler.handleSettingsUpdateSuccess(setting),
    handleDataSuccess: (operation: string, item?: string) => 
      successHandler.handleDataSuccess(operation, item),
    handleGeneralSuccess: (title: string, message: string, options?: Partial<SuccessMessage>) => 
      successHandler.handleGeneralSuccess(title, message, options),
    handleLogoutSuccess: () => 
      successHandler.handleLogoutSuccess(),
    handleEmailVerificationSuccess: () => 
      successHandler.handleEmailVerificationSuccess(),
    handlePasswordResetSuccess: () => 
      successHandler.handlePasswordResetSuccess(),
    handleInvitationSuccess: (email: string) => 
      successHandler.handleInvitationSuccess(email),
    handleBulkOperationSuccess: (operation: string, count: number) => 
      successHandler.handleBulkOperationSuccess(operation, count),
    handleExportSuccess: (format: string, filename?: string) => 
      successHandler.handleExportSuccess(format, filename),
    handleImportSuccess: (count: number, type: string) => 
      successHandler.handleImportSuccess(count, type),
    handleConnectionSuccess: (service: string) => 
      successHandler.handleConnectionSuccess(service),
    handleSyncSuccess: (items?: number) => 
      successHandler.handleSyncSuccess(items),
    handleSuccess: (category: SuccessCategory, data: any, context?: string) => 
      successHandler.handleSuccess(category, data, context),
  };
};

// Utility functions for common success patterns
export const createSuccessAction = (label: string, onClick: () => void, type: 'primary' | 'secondary' = 'primary'): SuccessAction => ({
  label,
  onClick,
  type,
});

export const createSuccessMessage = (title: string, message: string, options?: Partial<SuccessMessage>): SuccessMessage => ({
  title,
  message,
  duration: options?.duration || 4000,
  autoDismiss: options?.autoDismiss ?? true,
  action: options?.action,
});

// Success message templates
export const SUCCESS_MESSAGES = {
  LOGIN: (user: any) => ({
    title: 'Welcome Back!',
    message: `Successfully signed in as ${user.firstName || user.email}`,
    action: createSuccessAction('View Profile', () => window.location.href = '/profile')
  }),
  REGISTRATION: (requiresVerification: boolean = false) => ({
    title: 'Account Created Successfully!',
    message: requiresVerification 
      ? 'Please check your email for verification instructions.'
      : 'Your account has been created successfully. You are now signed in.',
    action: requiresVerification 
      ? createSuccessAction('Resend Email', () => console.log('Resend email'))
      : createSuccessAction('Get Started', () => window.location.href = '/dashboard')
  }),
  PROFILE_UPDATE: (field?: string) => ({
    title: 'Profile Updated',
    message: field 
      ? `Your ${field} has been updated successfully.`
      : 'Your profile has been updated successfully.',
    action: createSuccessAction('View Profile', () => window.location.href = '/profile')
  }),
  SETTINGS_UPDATE: (setting?: string) => ({
    title: 'Settings Updated',
    message: setting 
      ? `Your ${setting} settings have been updated successfully.`
      : 'Your settings have been updated successfully.'
  }),
  DATA_OPERATION: (operation: string, item?: string) => ({
    title: 'Operation Successful',
    message: item 
      ? `${operation} completed successfully for ${item}.`
      : `${operation} completed successfully.`
  }),
  LOGOUT: {
    title: 'Logged Out',
    message: 'You have been successfully logged out.'
  },
  EMAIL_VERIFICATION: {
    title: 'Email Verified!',
    message: 'Your email has been verified successfully. You can now sign in.',
    action: createSuccessAction('Sign In', () => window.location.href = '/login')
  },
  PASSWORD_RESET: {
    title: 'Password Reset',
    message: 'Your password has been reset successfully. You can now sign in with your new password.',
    action: createSuccessAction('Sign In', () => window.location.href = '/login')
  }
}; 