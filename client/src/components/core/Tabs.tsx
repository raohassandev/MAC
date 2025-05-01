// client/src/components/core/Tabs.tsx
import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'boxed' | 'pills';
  fullWidth?: boolean;
  tabClassName?: string;
  activeTabClassName?: string;
  disabledTabClassName?: string;
  contentClassName?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      tabs,
      activeTab,
      onChange,
      variant = 'default',
      fullWidth = false,
      tabClassName,
      activeTabClassName,
      disabledTabClassName,
      contentClassName,
      ...props
    },
    ref
  ) => {
    // Get the active tab content
    const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

    // Get class names based on variant
    const getTabListClassName = () => {
      switch (variant) {
        case 'boxed':
          return 'flex p-1 space-x-1 bg-gray-100 rounded-lg';
        case 'pills':
          return 'flex space-x-1';
        default:
          return 'flex border-b border-gray-200';
      }
    };

    const getTabClassName = (isActive: boolean, isDisabled: boolean) => {
      const baseClasses =
        'flex items-center justify-center px-4 py-2 text-sm font-medium focus:outline-none transition-colors';
      const widthClasses = fullWidth ? 'flex-1' : '';

      if (isDisabled) {
        return cn(
          baseClasses,
          widthClasses,
          'text-gray-400 cursor-not-allowed',
          disabledTabClassName
        );
      }

      switch (variant) {
        case 'boxed':
          return cn(
            baseClasses,
            widthClasses,
            isActive
              ? cn(
                  'bg-white text-gray-900 shadow rounded-md',
                  activeTabClassName
                )
              : cn('text-gray-600 hover:text-gray-900', tabClassName)
          );
        case 'pills':
          return cn(
            baseClasses,
            widthClasses,
            isActive
              ? cn('bg-blue-500 text-white rounded-md', activeTabClassName)
              : cn(
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md',
                  tabClassName
                )
          );
        default:
          return cn(
            baseClasses,
            widthClasses,
            'border-b-2',
            isActive
              ? cn('border-blue-500 text-blue-600', activeTabClassName)
              : cn(
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  tabClassName
                )
          );
      }
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className={getTabListClassName()} role='tablist'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role='tab'
              type='button'
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              className={getTabClassName(activeTab === tab.id, !!tab.disabled)}
              onClick={() => !tab.disabled && onChange(tab.id)}
            >
              {tab.icon && <span className='mr-2'>{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className={cn('mt-4', contentClassName)}
          role='tabpanel'
          id={`panel-${activeTab}`}
        >
          {activeContent}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs };
