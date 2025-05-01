// src/components/ui/Switch.tsx
import React from 'react';
import { cn } from '../../utils/cn';

// Omit the size property from the HTML input to avoid type conflict
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  labelPlacement?: 'start' | 'end';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      size = 'md',
      error,
      labelPlacement = 'end',
      checked,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const id = React.useId();

    const sizeClasses = {
      sm: {
        container: 'h-4 w-7',
        thumb: 'h-3 w-3',
        translate: checked ? 'translate-x-3' : 'translate-x-1',
      },
      md: {
        container: 'h-5 w-10',
        thumb: 'h-4 w-4',
        translate: checked ? 'translate-x-5' : 'translate-x-1',
      },
      lg: {
        container: 'h-6 w-12',
        thumb: 'h-5 w-5',
        translate: checked ? 'translate-x-6' : 'translate-x-1',
      },
    };

    const renderLabel = () => {
      if (!label && !description) return null;

      return (
        <div
          className={cn(
            'text-sm',
            labelPlacement === 'start' ? 'mr-3 text-right' : 'ml-3'
          )}
        >
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'font-medium text-gray-700',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn('text-gray-500', label && 'mt-1')}>
              {description}
            </p>
          )}
        </div>
      );
    };

    // Fix the onChange handler to properly handle synthetic events
    const handleChange = (isChecked: boolean) => {
      if (onChange) {
        // Create a synthetic event with the correct target structure
        const syntheticEvent = {
          target: { checked: isChecked },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    };

    return (
      <div
        className={cn(
          'flex items-center',
          labelPlacement === 'start' ? 'justify-between' : '',
          className
        )}
      >
        {labelPlacement === 'start' && renderLabel()}

        <div className='inline-flex flex-shrink-0'>
          <input
            type='checkbox'
            id={id}
            className='sr-only'
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.checked)}
            {...props}
          />
          <button
            type='button'
            role='switch'
            aria-checked={checked}
            onClick={() => {
              if (disabled) return;

              const input = document.getElementById(id) as HTMLInputElement;
              if (input) {
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }

              handleChange(!checked);
            }}
            className={cn(
              'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              checked ? 'bg-blue-600' : 'bg-gray-200',
              disabled && 'opacity-50 cursor-not-allowed',
              sizeClasses[size].container
            )}
          >
            <span className='sr-only'>
              {checked ? 'Enable' : 'Disable'} {label}
            </span>
            <span
              aria-hidden='true'
              className={cn(
                'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                sizeClasses[size].thumb,
                sizeClasses[size].translate
              )}
            />
          </button>
        </div>

        {labelPlacement === 'end' && renderLabel()}

        {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
