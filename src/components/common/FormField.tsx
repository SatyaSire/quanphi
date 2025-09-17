import React, { forwardRef } from 'react';
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  disabled?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

interface TextAreaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  placeholder?: string;
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface RadioFieldProps extends BaseFieldProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FieldWrapper: React.FC<{
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  children: React.ReactNode;
}> = ({ label, error, required, className = '', helpText, children }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <ExclamationCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    type = 'text', 
    error, 
    className = '', 
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    const inputClasses = `
      block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }
    `;

    return (
      <FieldWrapper {...props} error={error} className={className}>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            disabled={props.disabled}
            autoComplete={props.autoComplete}
            required={props.required}
          />
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

InputField.displayName = 'InputField';

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ error, className = '', rows = 3, ...props }, ref) => {
    const textareaClasses = `
      block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      resize-vertical
      ${error 
        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }
    `;

    return (
      <FieldWrapper {...props} error={error} className={className}>
        <textarea
          ref={ref}
          rows={rows}
          className={textareaClasses}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          disabled={props.disabled}
          required={props.required}
        />
      </FieldWrapper>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ error, className = '', placeholder, children, ...props }, ref) => {
    const selectClasses = `
      block w-full px-3 py-2 border rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }
    `;

    return (
      <FieldWrapper {...props} error={error} className={className}>
        <select
          ref={ref}
          className={selectClasses}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          disabled={props.disabled}
          required={props.required}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      </FieldWrapper>
    );
  }
);

SelectField.displayName = 'SelectField';

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <FieldWrapper error={error} className={className}>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={`
              h-4 w-4 rounded border-gray-300 text-blue-600 
              focus:ring-blue-500 focus:ring-offset-0 transition-colors
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-300' : ''}
            `}
            checked={props.checked}
            onChange={props.onChange}
            onBlur={props.onBlur}
            disabled={props.disabled}
            required={props.required}
          />
          {props.label && (
            <label className="ml-2 block text-sm text-gray-700">
              {props.label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

export const RadioField = forwardRef<HTMLInputElement, RadioFieldProps>(
  ({ error, className = '', name, value, ...props }, ref) => {
    return (
      <FieldWrapper error={error} className={className}>
        <div className="flex items-center">
          <input
            ref={ref}
            type="radio"
            name={name}
            value={value}
            className={`
              h-4 w-4 border-gray-300 text-blue-600 
              focus:ring-blue-500 focus:ring-offset-0 transition-colors
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-300' : ''}
            `}
            checked={props.checked}
            onChange={props.onChange}
            onBlur={props.onBlur}
            disabled={props.disabled}
            required={props.required}
          />
          {props.label && (
            <label className="ml-2 block text-sm text-gray-700">
              {props.label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

RadioField.displayName = 'RadioField';

// Date input field
export const DateField = forwardRef<HTMLInputElement, Omit<InputFieldProps, 'type'>>(
  (props, ref) => {
    return <InputField ref={ref} {...props} type="text" />;
  }
);

DateField.displayName = 'DateField';