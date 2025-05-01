// src/components/ui/Table.tsx
import React from 'react';
import { cn } from '../../utils/cn';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className='overflow-x-auto'>
        <table
          ref={ref}
          className={cn('min-w-full divide-y divide-gray-200', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <thead ref={ref} className={cn('bg-gray-50', className)} {...props}>
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('bg-white divide-y divide-gray-200', className)}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, onClick, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(onClick && 'cursor-pointer hover:bg-gray-50', className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead };

// Define a type for the composite table component
export type TableType = typeof Table & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  Head: typeof TableHead;
};

// Assign the sub-components to the main component
(Table as TableType).Header = TableHeader;
(Table as TableType).Body = TableBody;
(Table as TableType).Row = TableRow;
(Table as TableType).Cell = TableCell;
(Table as TableType).Head = TableHead;

// Export the properly typed Table component
export default Table as TableType;
