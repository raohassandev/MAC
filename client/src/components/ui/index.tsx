import { AlertCircle, Loader } from 'lucide-react';

// client/src/components/ui/index.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseClass =
    'flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    warning:
      'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
  };

  const sizeClasses = {
    sm: 'py-1 px-2 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  const classes = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader
          size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
          className='animate-spin mr-2'
        />
      ) : icon ? (
        <span className='mr-2'>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

interface CardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {title && (
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold'>{title}</h3>
        </div>
      )}
      <div className='p-6'>{children}</div>
      {footer && (
        <div className='px-6 py-4 border-t border-gray-200'>{footer}</div>
      )}
    </div>
  );
};

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  className = '',
}) => {
  const typeClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className={`rounded-md border p-4 ${typeClasses[type]} ${className}`}>
      <div className='flex items-start'>
        <AlertCircle className='flex-shrink-0 mr-3 h-5 w-5' />
        <div>
          {title && <h3 className='text-sm font-medium'>{title}</h3>}
          <p className='text-sm mt-1'>{message}</p>
        </div>
      </div>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div>
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
          className={`block w-full rounded-md border-gray-300 ${
            icon ? 'pl-10' : 'pl-3'
          } ${
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'focus:ring-blue-500 focus:border-blue-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
        </label>
      )}
      <select
        className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
            : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className='text-center py-12 px-4 bg-white rounded-lg border border-gray-200'>
      {icon && <div className='mx-auto mb-4 text-gray-400'>{icon}</div>}
      <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
      {description && (
        <p className='mt-2 text-sm text-gray-500'>{description}</p>
      )}
      {action && <div className='mt-6'>{action}</div>}
    </div>
  );
};

interface TabsProps {
  tabs: Array<{
    id: string;
    label: string | React.ReactNode;
    content: React.ReactNode;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div>
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className='py-4'>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
  selectedRowIds?: string[];
  idField?: keyof T;
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  className?: string;
  emptyState?: React.ReactNode;
}

export function Table<T>({
  data,
  columns,
  onRowClick,
  selectedRowIds,
  idField,
  onSelectRow,
  onSelectAll,
  className = '',
  emptyState,
}: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {selectedRowIds && onSelectRow && idField && (
              <th scope='col' className='relative px-6 py-3 w-10'>
                <input
                  type='checkbox'
                  className='absolute h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  checked={
                    data.length > 0 && selectedRowIds.length === data.length
                  }
                  onChange={onSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {selectedRowIds && onSelectRow && idField && (
                <td className='px-6 py-4 whitespace-nowrap w-10'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={selectedRowIds.includes(String(item[idField]))}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectRow(String(item[idField]));
                    }}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={`${index}-${column.key.toString()}`}
                  className='px-6 py-4 whitespace-nowrap'
                >
                  {column.render
                    ? column.render(item)
                    : item[column.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
