// client/src/components/core/Alert.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const alertVariants = cva('relative rounded-md border p-4', {
  variants: {
    variant: {
      default: 'bg-white border-gray-200 text-gray-900',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      title,
      dismissible,
      onDismiss,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    // Default icons based on variant
    const getDefaultIcon = () => {
      switch (variant) {
        case 'info':
          return <Info className='h-5 w-5' />;
        case 'success':
          return <CheckCircle className='h-5 w-5' />;
        case 'warning':
          return <AlertTriangle className='h-5 w-5' />;
        case 'error':
          return <AlertCircle className='h-5 w-5' />;
        default:
          return <Info className='h-5 w-5' />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant, className }))}
        {...props}
      >
        <div className='flex'>
          {icon !== undefined ? (
            icon
          ) : (
            <div className='flex-shrink-0 mr-3'>{getDefaultIcon()}</div>
          )}
          <div className='flex-1'>
            {title && <h3 className='text-sm font-medium mb-1'>{title}</h3>}
            <div className='text-sm'>{children}</div>
          </div>
          {dismissible && (
            <button
              type='button'
              className='ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              onClick={onDismiss}
              aria-label='Dismiss'
            >
              <span className='sr-only'>Dismiss</span>
              <X className='h-5 w-5' />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert, alertVariants };
