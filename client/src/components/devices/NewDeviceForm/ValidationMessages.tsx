// client/src/components/devices/NewDeviceForm/ValidationMessages.tsx
import React from 'react';
import { useDeviceForm } from './DeviceFormContext';
import { AlertCircle, Check } from 'lucide-react';

const ValidationMessages: React.FC = () => {
  const { state } = useDeviceForm();
  const { validationState } = state;

  // Combine all errors from all sections
  const allErrors = [
    ...validationState.basicInfo,
    ...validationState.connection,
    ...validationState.registers,
    ...validationState.parameters,
    ...validationState.general,
  ];

  if (allErrors.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Please fix the following issues:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {allErrors.map((error, index) => (
                <li key={`${error.field}-${index}`}>{error.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationMessages;