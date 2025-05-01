// FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
}) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      {children}
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};
