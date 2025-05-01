// src/components/ui/Badge.tsx
import React from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      icon,
      removable = false,
      onRemove,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-purple-100 text-purple-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-indigo-100 text-indigo-800',
      outline: 'bg-transparent border border-gray-300 text-gray-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onRemove) {
        onRemove();
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full whitespace-nowrap',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('mr-1.5 h-2 w-2 rounded-full', {
              'bg-gray-400': variant === 'default' || variant === 'outline',
              'bg-blue-500': variant === 'primary',
              'bg-purple-500': variant === 'secondary',
              'bg-green-500': variant === 'success',
              'bg-red-500': variant === 'danger',
              'bg-yellow-500': variant === 'warning',
              'bg-indigo-500': variant === 'info',
            })}
          />
        )}

        {icon && (
          <span className={cn('mr-1', size === 'sm' ? 'text-xs' : '')}>
            {icon}
          </span>
        )}

        {children}

        {removable && (
          <button
            type='button'
            className={cn(
              'ml-1 -mr-1 h-4 w-4 rounded-full flex items-center justify-center focus:outline-none',
              {
                'hover:bg-gray-200 focus:bg-gray-200':
                  variant === 'default' || variant === 'outline',
                'hover:bg-blue-200 focus:bg-blue-200': variant === 'primary',
                'hover:bg-purple-200 focus:bg-purple-200':
                  variant === 'secondary',
                'hover:bg-green-200 focus:bg-green-200': variant === 'success',
                'hover:bg-red-200 focus:bg-red-200': variant === 'danger',
                'hover:bg-yellow-200 focus:bg-yellow-200':
                  variant === 'warning',
                'hover:bg-indigo-200 focus:bg-indigo-200': variant === 'info',
              }
            )}
            onClick={handleRemove}
            aria-label='Remove'
          >
            <X className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
