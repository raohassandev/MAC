// client/src/components/devices/NewDeviceForm/ValidationMessages.tsx
import React from 'react';
import { useDeviceForm } from './DeviceFormContext';
import { AlertCircle, XCircle, Info } from 'lucide-react';

// Group errors by section for better organization
const groupErrorsBySection = (errors: Array<{ field: string; message: string }>) => {
  const grouped: Record<string, string[]> = {
    device: [],
    connection: [],
    registers: [],
    parameters: [],
    other: []
  };

  errors.forEach(error => {
    if (error.field.includes('name') || error.field.includes('make') || error.field.includes('model')) {
      grouped.device.push(error.message);
    } else if (error.field.includes('ip') || error.field.includes('port') || error.field.includes('slave') || 
               error.field.includes('serial') || error.field.includes('baud')) {
      grouped.connection.push(error.message);
    } else if (error.field.includes('range')) {
      grouped.registers.push(error.message);
    } else if (error.field.includes('param')) {
      grouped.parameters.push(error.message);
    } else {
      grouped.other.push(error.message);
    }
  });

  // Return only sections that have errors
  return Object.entries(grouped).filter(([_, msgs]) => msgs.length > 0);
};

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

  // Group errors by section
  const groupedErrors = groupErrorsBySection(allErrors);

  // If it's just one or two simple errors, display compact version
  if (allErrors.length <= 2 && groupedErrors.length === 1) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 rounded">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <div className="text-sm text-red-700">
            {allErrors.map((error, index) => (
              <span key={`${error.field}-${index}`}>{error.message}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For more complex validation cases, show detailed grouping
  return (
    <div className="bg-red-50 border border-red-200 p-4 mb-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800 flex items-center justify-between">
            <span>Please fix the following issues:</span>
            <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
              {allErrors.length} {allErrors.length === 1 ? 'error' : 'errors'}
            </span>
          </h3>
          
          <div className="mt-2 space-y-3">
            {groupedErrors.map(([section, messages]) => (
              <div key={section} className="border-t border-red-200 pt-2 first:border-t-0 first:pt-0">
                <h4 className="text-xs font-medium text-red-800 uppercase mb-1">
                  {section} {messages.length > 1 && `(${messages.length})`}
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {messages.map((message, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1">•</span> {message}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-red-200 flex items-start">
            <Info size={14} className="text-red-700 mr-1 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              All fields with errors must be corrected before you can save the device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationMessages;