// src/components/ui/Empty.tsx
import React from 'react';
import { cn } from '../../utils/cn';
import { SearchX, FileX, Box, AlertCircle } from 'lucide-react';

export type EmptyType = 'default' | 'search' | 'data' | 'file' | 'error';

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  type?: EmptyType;
  compact?: boolean;
  image?: string;
}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      title,
      description,
      icon,
      action,
      type = 'default',
      compact = false,
      image,
      ...props
    },
    ref
  ) => {
    // Default titles and descriptions based on type
    const defaultContent = {
      default: {
        title: 'No Data',
        description: 'No data to display at the moment.',
        icon: <Box size={40} />,
      },
      search: {
        title: 'No Results',
        description: 'No results found for your search.',
        icon: <SearchX size={40} />,
      },
      data: {
        title: 'No Data',
        description: 'No data available in this view.',
        icon: <Box size={40} />,
      },
      file: {
        title: 'No Files',
        description: 'No files have been uploaded yet.',
        icon: <FileX size={40} />,
      },
      error: {
        title: 'Error',
        description: 'An error occurred while loading data.',
        icon: <AlertCircle size={40} />,
      },
    };

    const displayTitle = title || defaultContent[type].title;
    const displayDescription = description || defaultContent[type].description;
    const displayIcon = icon || defaultContent[type].icon;

    const iconColors = {
      default: 'text-gray-400',
      search: 'text-gray-400',
      data: 'text-gray-400',
      file: 'text-gray-400',
      error: 'text-red-500',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          compact ? 'p-4' : 'p-8',
          className
        )}
        {...props}
      >
        {image ? (
          <img
            src={image}
            alt={displayTitle}
            className={cn(
              'object-contain mb-4',
              compact ? 'h-16 w-16' : 'h-32 w-32'
            )}
          />
        ) : (
          <div className={cn(iconColors[type], 'mb-4')}>{displayIcon}</div>
        )}

        <h3
          className={cn(
            'font-medium text-gray-900',
            compact ? 'text-base' : 'text-lg'
          )}
        >
          {displayTitle}
        </h3>

        {displayDescription && (
          <p
            className={cn(
              'text-gray-500 text-center mt-1 max-w-sm',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            {displayDescription}
          </p>
        )}

        {action && <div className='mt-4'>{action}</div>}
      </div>
    );
  }
);

Empty.displayName = 'Empty';
