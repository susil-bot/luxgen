import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '../../types';
import { mongoDBUserService } from '../../services/MongoDBUserService';
import { useTheme } from '../../contexts/ThemeContext';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<UserType, 'id' | 'createdAt' | 'lastLogin'>) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user' as UserType['role'],
    tenantId: 'tenant-1',
    isActive: true,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Theme-based input styling
  const getInputClasses = () => {
    return `w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
      theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-300'
    } ${
      theme.colors.border.focus ? `focus:ring-[${theme.colors.border.focus}]` : 'focus:ring-primary-500'
    } ${
      theme.colors.text.primary ? `text-[${theme.colors.text.primary}]` : 'text-gray-900'
    } ${
      theme.colors.background.primary ? `bg-[${theme.colors.background.primary}]` : 'bg-white'
    } placeholder-gray-500`;
  };

  const getSelectClasses = () => {
    return `w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
      theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-300'
    } ${
      theme.colors.border.focus ? `focus:ring-[${theme.colors.border.focus}]` : 'focus:ring-primary-500'
    } ${
      theme.colors.text.primary ? `text-[${theme.colors.text.primary}]` : 'text-gray-900'
    } ${
      theme.colors.background.primary ? `bg-[${theme.colors.background.primary}]` : 'bg-white'
    }`;
  };

  const roles = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access and control' },
    { value: 'admin', label: 'Admin', description: 'Organization-level management' },
    { value: 'trainer', label: 'Trainer', description: 'Training content creation and delivery' },
    { value: 'user', label: 'User', description: 'Basic user access' },
  ];

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (formData.email && formData.email.includes('@')) {
        try {
          const isAvailable = await mongoDBUserService.checkUserUniqueness(formData.email);
          setEmailAvailable(isAvailable);
        } catch (error) {
          setEmailAvailable(null);
        }
      } else {
        setEmailAvailable(null);
      }
    };

    const timeoutId = setTimeout(checkEmailAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      tenantId: 'tenant-1',
      isActive: true,
    });
    setErrors([]);
    setIsSubmitting(false);
    setEmailAvailable(null);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const validation = mongoDBUserService.validateUserData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (emailAvailable === false) {
      setErrors(['Email address is already in use']);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
      setErrors([error instanceof Error ? error.message : 'Failed to create user']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmailStatusIcon = () => {
    if (emailAvailable === null) return null;
    
    if (emailAvailable) {
      return <CheckCircle className={`w-4 h-4 ${
        theme.colors.success[500] ? `text-[${theme.colors.success[500]}]` : 'text-green-500'
      }`} />;
    } else {
      return <AlertCircle className={`w-4 h-4 ${
        theme.colors.error[500] ? `text-[${theme.colors.error[500]}]` : 'text-red-500'
      }`} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
          theme.colors.background.modal ? `bg-[${theme.colors.background.modal}]` : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${
            theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${
                theme.colors.text.primary ? `text-[${theme.colors.text.primary}]` : 'text-gray-900'
              }`}>
                Create New User
              </h3>
              <button
                onClick={onClose}
                className={`text-gray-400 hover:text-gray-600 transition-colors`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className={`border rounded-lg p-4 ${
                theme.colors.error[50] ? `bg-[${theme.colors.error[50]}]` : 'bg-red-50'
              } ${
                theme.colors.border.error ? `border-[${theme.colors.border.error}]` : 'border-red-200'
              }`}>
                <div className="flex">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    theme.colors.error[400] ? `text-[${theme.colors.error[400]}]` : 'text-red-400'
                  }`} />
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      theme.colors.error[800] ? `text-[${theme.colors.error[800]}]` : 'text-red-800'
                    }`}>
                      Please fix the following errors:
                    </h3>
                    <ul className={`mt-2 text-sm list-disc list-inside ${
                      theme.colors.error[700] ? `text-[${theme.colors.error[700]}]` : 'text-red-700'
                    }`}>
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className={`block text-sm font-medium mb-2 ${
                theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
              }`}>
                First Name *
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className={`block text-sm font-medium mb-2 ${
                theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
              }`}>
                Last Name *
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
              }`}>
                Email Address *
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter email address"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getEmailStatusIcon()}
                </div>
              </div>
              {emailAvailable === false && (
                <p className={`mt-1 text-sm ${
                  theme.colors.error[600] ? `text-[${theme.colors.error[600]}]` : 'text-red-600'
                }`}>This email address is already in use</p>
              )}
              {emailAvailable === true && (
                <p className={`mt-1 text-sm ${
                  theme.colors.success[600] ? `text-[${theme.colors.success[600]}]` : 'text-green-600'
                }`}>Email address is available</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className={`block text-sm font-medium mb-2 ${
                theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
              }`}>
                Role *
              </label>
              <div className="relative">
                <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-400'
                }`} />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as UserType['role'])}
                  className={getSelectClasses()}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className={`mt-1 text-sm ${
                theme.colors.text.tertiary ? `text-[${theme.colors.text.tertiary}]` : 'text-gray-500'
              }`}>
                {roles.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className={`rounded focus:ring-2 focus:border-transparent ${
                    theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-300'
                  } ${
                    theme.colors.primary[600] ? `text-[${theme.colors.primary[600]}]` : 'text-primary-600'
                  } ${
                    theme.colors.primary[500] ? `focus:ring-[${theme.colors.primary[500]}]` : 'focus:ring-primary-500'
                  }`}
                />
                <span className={`ml-2 text-sm ${
                  theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
                }`}>User is active</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-colors ${
                  theme.colors.border.primary ? `border-[${theme.colors.border.primary}]` : 'border-gray-300'
                } ${
                  theme.colors.text.secondary ? `text-[${theme.colors.text.secondary}]` : 'text-gray-700'
                } ${
                  theme.colors.gray[500] ? `focus:ring-[${theme.colors.gray[500]}]` : 'focus:ring-gray-500'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || emailAvailable === false}
                className={`flex-1 px-4 py-2 text-white rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors ${
                  theme.colors.primary[600] ? `bg-[${theme.colors.primary[600]}]` : 'bg-primary-600'
                } ${
                  theme.colors.primary[700] ? `hover:bg-[${theme.colors.primary[700]}]` : 'hover:bg-primary-700'
                } ${
                  theme.colors.primary[500] ? `focus:ring-[${theme.colors.primary[500]}]` : 'focus:ring-primary-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal; 