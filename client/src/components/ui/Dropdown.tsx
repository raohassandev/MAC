// src/components/ui/Dropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DropdownItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  danger?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    {
      className,
      icon,
      disabled,
      selected,
      danger,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center px-4 py-2 text-sm cursor-pointer transition-colors',
          selected
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100',
          danger && 'text-red-600 hover:bg-red-50',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {icon && <span className='mr-2 text-gray-500'>{icon}</span>}
        <span className='flex-grow'>{children}</span>
        {selected && <Check size={16} className='ml-2 text-blue-600' />}
      </div>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

export interface DropdownSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('h-px my-1 bg-gray-200', className)}
      {...props}
    />
  );
});

DropdownSeparator.displayName = 'DropdownSeparator';

export interface DropdownLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  DropdownLabelProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

DropdownLabel.displayName = 'DropdownLabel';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  width = 'md',
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const widthClasses = {
    auto: 'w-auto',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className='relative inline-block'>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'inline-flex',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-10 mt-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 overflow-hidden',
            alignmentClasses[align],
            widthClasses[width],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export interface DropdownButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(
  (
    {
      className,
      iconRight = <ChevronDown size={16} />,
      iconLeft,
      children,
      variant = 'outline',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
      ghost: 'text-gray-700 hover:bg-gray-100',
    };

    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {iconLeft && <span className='mr-2'>{iconLeft}</span>}
        {children}
        {iconRight && <span className='ml-2'>{iconRight}</span>}
      </button>
    );
  }
);

DropdownButton.displayName = 'DropdownButton';
