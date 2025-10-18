import React, { useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface ModernFormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  help?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

const ModernFormField: React.FC<ModernFormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  help,
  required = false,
  disabled = false,
  icon,
  showPasswordToggle = false,
  onFocus,
  onBlur,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getInputClasses = () => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const errorClasses = error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500";
    const focusClasses = isFocused ? "ring-2 ring-blue-500 border-blue-500" : "";
    const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "";
    const iconClasses = icon ? "pl-10" : "";
    const passwordClasses = showPasswordToggle ? "pr-10" : "";
    
    return `${baseClasses} ${errorClasses} ${focusClasses} ${disabledClasses} ${iconClasses} ${passwordClasses} ${className}`;
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClasses()}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
        
        {value && !error && !disabled && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      
      {help && !error && (
        <p className="text-sm text-gray-500">{help}</p>
      )}
    </div>
  );
};

export default ModernFormField;
