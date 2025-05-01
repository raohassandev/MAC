// src/components/ui/Form.tsx
import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

// Form Main Container
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form ref={ref} className={cn('space-y-4', className)} {...props}>
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

// Form Group (for vertical layout of form fields)
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

// Form Row (for horizontal layout of form fields)
export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormRow.displayName = 'FormRow';

// Form Label
export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-gray-700', className)}
        {...props}
      >
        {children}
        {required && <span className='ml-1 text-red-500'>*</span>}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

// Form Input
export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      error,
      label,
      hint,
      required,
      startIcon,
      endIcon,
      showPasswordToggle,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType =
      showPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    return (
      <div className='space-y-1'>
        {label && (
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <div className='relative'>
          {startIcon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              startIcon ? 'pl-10' : '',
              endIcon || showPasswordToggle ? 'pr-10' : '',
              error ? 'border-red-300' : 'border-gray-300',
              className
            )}
            {...props}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {endIcon && !showPasswordToggle && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400'>
              {endIcon}
            </div>
          )}
        </div>
        {hint && !error && <p className='text-xs text-gray-500'>{hint}</p>}
        {error && (
          <p className='flex items-center text-xs text-red-600'>
            <AlertCircle size={12} className='mr-1 flex-shrink-0' />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// Form Textarea
export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  required?: boolean;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ className, error, label, hint, required, ...props }, ref) => {
  return (
    <div className='space-y-1'>
      {label && (
        <FormLabel htmlFor={props.id} required={required}>
          {label}
        </FormLabel>
      )}
      <textarea
        ref={ref}
        className={cn(
          'block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
          error ? 'border-red-300' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {hint && !error && <p className='text-xs text-gray-500'>{hint}</p>}
      {error && (
        <p className='flex items-center text-xs text-red-600'>
          <AlertCircle size={12} className='mr-1 flex-shrink-0' />
          {error}
        </p>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

// Form Select
export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  hint?: string;
  required?: boolean;
  options: FormSelectOption[];
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, error, label, hint, required, options, ...props }, ref) => {
    return (
      <div className='space-y-1'>
        {label && (
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <select
          ref={ref}
          className={cn(
            'block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
            error ? 'border-red-300' : 'border-gray-300',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className='text-xs text-gray-500'>{hint}</p>}
        {error && (
          <p className='flex items-center text-xs text-red-600'>
            <AlertCircle size={12} className='mr-1 flex-shrink-0' />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

// Form Checkbox
export interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const FormCheckbox = React.forwardRef<
  HTMLInputElement,
  FormCheckboxProps
>(({ className, error, label, hint, ...props }, ref) => {
  return (
    <div className='space-y-1'>
      <div className='flex items-start'>
        <div className='flex items-center h-5'>
          <input
            ref={ref}
            type='checkbox'
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
              error ? 'border-red-300' : '',
              className
            )}
            {...props}
          />
        </div>
        {label && (
          <div className='ml-3 text-sm'>
            <label
              htmlFor={props.id}
              className={cn(
                'font-medium text-gray-700',
                props.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
            {hint && <p className='text-gray-500'>{hint}</p>}
          </div>
        )}
      </div>
      {error && (
        <p className='flex items-center text-xs text-red-600 ml-7'>
          <AlertCircle size={12} className='mr-1 flex-shrink-0' />
          {error}
        </p>
      )}
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

// Form Radio Group
export interface FormRadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface FormRadioGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: FormRadioOption[];
  error?: string;
  label?: string;
  hint?: string;
  required?: boolean;
  inline?: boolean;
}

export const FormRadioGroup = React.forwardRef<
  HTMLDivElement,
  FormRadioGroupProps
>(
  (
    {
      className,
      options,
      error,
      label,
      hint,
      required,
      inline,
      name,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <div className={cn('space-y-2', inline && 'flex space-x-6 space-y-0')}>
          {options.map((option) => (
            <div key={option.value} className='flex items-start'>
              <div className='flex items-center h-5'>
                <input
                  type='radio'
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  disabled={option.disabled}
                  className={cn(
                    'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500',
                    error ? 'border-red-300' : ''
                  )}
                  {...props}
                />
              </div>
              <div className='ml-3 text-sm'>
                <label
                  htmlFor={`${name}-${option.value}`}
                  className={cn(
                    'font-medium text-gray-700',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className='text-gray-500'>{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {hint && !error && <p className='text-xs text-gray-500'>{hint}</p>}
        {error && (
          <p className='flex items-center text-xs text-red-600'>
            <AlertCircle size={12} className='mr-1 flex-shrink-0' />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormRadioGroup.displayName = 'FormRadioGroup';

// Form Actions (for form buttons)
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex justify-end space-x-3 pt-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormActions.displayName = 'FormActions';

// Form Helper
export interface FormHelperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const FormHelper = React.forwardRef<HTMLDivElement, FormHelperProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-sm text-gray-500', className)}
        {...props}
      >
        {icon && <span className='mr-1 inline-block'>{icon}</span>}
        {children}
      </div>
    );
  }
);

FormHelper.displayName = 'FormHelper';
