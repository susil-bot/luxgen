// Form validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  private rules: Record<string, ValidationRule> = {};
  private errors: ValidationErrors = {};

  addRule(field: string, rule: ValidationRule): FormValidator {
    this.rules[field] = rule;
    return this;
  }

  validate(field: string, value: any): string | null {
    const rule = this.rules[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `${field} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `${field} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${field} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  validateAll(data: Record<string, any>): ValidationErrors {
    this.errors = {};
    
    for (const field in this.rules) {
      const error = this.validate(field, data[field]);
      if (error) {
        this.errors[field] = error;
      }
    }

    return this.errors;
  }

  getErrors(): ValidationErrors {
    return this.errors;
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getError(field: string): string | null {
    return this.errors[field] || null;
  }

  clearErrors(): void {
    this.errors = {};
  }

  clearError(field: string): void {
    delete this.errors[field];
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d+)?$/
};

// Common validation rules
export const CommonRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: ValidationPatterns.email 
  },
  phone: { 
    required: true, 
    pattern: ValidationPatterns.phone 
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  title: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 2000
  },
  url: {
    pattern: ValidationPatterns.url
  }
};

// Job Post specific validation rules
export const JobPostRules = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 2000
  },
  department: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  location: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  type: {
    required: true,
    custom: (value: string) => {
      const validTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
      return validTypes.includes(value) ? null : 'Invalid job type';
    }
  },
  salary: {
    custom: (value: any) => {
      if (!value) return null;
      if (typeof value === 'number' && value < 0) return 'Salary must be positive';
      if (typeof value === 'string' && value.trim() === '') return null;
      return null;
    }
  },
  skills: {
    custom: (value: string[]) => {
      if (!Array.isArray(value)) return 'Skills must be an array';
      if (value.length === 0) return null;
      if (value.length > 20) return 'Maximum 20 skills allowed';
      return null;
    }
  },
  requirements: {
    minLength: 10,
    maxLength: 1000
  },
  benefits: {
    custom: (value: string[]) => {
      if (!Array.isArray(value)) return 'Benefits must be an array';
      if (value.length > 15) return 'Maximum 15 benefits allowed';
      return null;
    }
  }
};

// Hook for form validation
export const useFormValidation = (rules: Record<string, ValidationRule>) => {
  const validator = new FormValidator();
  
  // Add rules to validator
  Object.entries(rules).forEach(([field, rule]) => {
    validator.addRule(field, rule);
  });

  const validateField = (field: string, value: any): string | null => {
    return validator.validate(field, value);
  };

  const validateForm = (data: Record<string, any>): ValidationErrors => {
    return validator.validateAll(data);
  };

  const getErrors = (): ValidationErrors => {
    return validator.getErrors();
  };

  const hasErrors = (): boolean => {
    return validator.hasErrors();
  };

  return {
    validateField,
    validateForm,
    getErrors,
    hasErrors,
    validator
  };
};
