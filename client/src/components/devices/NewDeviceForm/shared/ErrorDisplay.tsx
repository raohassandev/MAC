// ErrorDisplay.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { DeviceFormValidation, getAllErrors } from '../../../../utils/formValidation';

interface ErrorDisplayProps {
  message?: string;
  validation?: DeviceFormValidation;
  show?: boolean;
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  validation,
  show = true,
  onClose,
}) => {
  // If it's a simple error message
  if (message && show) {
    return (
      <div className='mx-4 mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded'>
        <div className='flex items-center'>
          <AlertCircle size={20} className='text-red-500 mr-2' />
          <span className='text-red-700'>{message}</span>
        </div>
      </div>
    );
  }

  // If it's validation errors
  if (validation && show && getAllErrors(validation).length > 0) {
    return (
      <div className='mx-4 mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded'>
        <div className='flex items-start'>
          <AlertCircle size={20} className='text-red-500 mr-2 mt-1' />
          <div>
            <h3 className='font-medium text-red-800'>
              Please fix the following issues:
            </h3>
            <ul className='mt-2 list-disc list-inside text-red-700'>
              {getAllErrors(validation).map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
            {onClose && (
              <button
                onClick={onClose}
                className='mt-2 text-red-700 underline hover:text-red-800'
              >
                Hide
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ErrorDisplay;
