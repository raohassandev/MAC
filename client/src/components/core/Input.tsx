// client/src/components/core/Input.tsx
import React from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff, Search, X } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  type?: string;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      clearable,
      onClear,
      type = 'text',
      showPasswordToggle,
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

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
          </label>
        )}
        <div className='relative rounded-md shadow-sm'>
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              icon ? 'pl-10' : '',
              clearable || showPasswordToggle ? 'pr-10' : '',
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : '',
              className
            )}
            {...props}
          />
          {clearable && props.value && (
            <button
              type='button'
              onClick={handleClear}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
            >
              <X size={16} />
            </button>
          )}
          {showPasswordToggle && type === 'password' && (
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

// Search input component that extends the base Input component
export interface SearchInputProps extends Omit<InputProps, 'icon' | 'type'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, clearable = true, onClear, ...props }, ref) => {
    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      if (onSearch) {
        onSearch('');
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value);
      }
    };

    return (
      <Input
        ref={ref}
        type='text'
        icon={<Search size={16} />}
        clearable={clearable}
        onClear={handleClear}
        onKeyDown={handleKeyDown}
        className={cn('w-full', className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
