// client/src/components/core/Checkbox.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      checkboxClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const id = React.useId();

    return (
      <div className={cn('flex items-start', className)}>
        <div className='flex items-center h-5'>
          <input
            id={id}
            type='checkbox'
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
              error && 'border-red-300 text-red-900 focus:ring-red-500',
              checkboxClassName
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className='ml-3 text-sm'>
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'font-medium text-gray-700',
                  props.disabled && 'opacity-50 cursor-not-allowed',
                  error && 'text-red-900',
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {description && <p className='text-gray-500'>{description}</p>}
            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };

export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  label,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className='text-sm font-medium text-gray-700'>{label}</div>
      )}
      <div className='space-y-2'>{children}</div>
    </div>
  );
};

export { CheckboxGroup };

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  toggleClassName?: string;
  labelClassName?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      label,
      description,
      error,
      toggleClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const id = React.useId();

    return (
      <div className={cn('flex items-start', className)}>
        <div className='flex items-center h-5'>
          <input
            id={id}
            type='checkbox'
            className='sr-only'
            ref={ref}
            {...props}
          />
          <button
            type='button'
            onClick={() => {
              const input = document.getElementById(id) as HTMLInputElement;
              if (input && !props.disabled) {
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }}
            aria-checked={props.checked}
            disabled={props.disabled}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
              props.checked ? 'bg-blue-600' : 'bg-gray-200',
              props.disabled && 'opacity-50 cursor-not-allowed',
              toggleClassName
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform',
                props.checked ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        {(label || description) && (
          <div className='ml-3 text-sm'>
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'font-medium text-gray-700',
                  props.disabled && 'opacity-50 cursor-not-allowed',
                  error && 'text-red-900',
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {description && <p className='text-gray-500'>{description}</p>}
            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };
