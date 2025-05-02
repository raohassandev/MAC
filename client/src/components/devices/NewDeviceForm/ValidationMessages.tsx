// client/src/components/devices/NewDeviceForm/ValidationMessages.tsx
import React, { useContext } from 'react';
import { useDeviceForm } from './DeviceFormContext';
import { AlertCircle, XCircle, Info, ArrowRight } from 'lucide-react';
import { FormFieldRefsContext } from './FormFieldRefsContext';

// Group errors by section for better organization
const groupErrorsBySection = (errors: Array<{ field: string; message: string }>) => {
  const grouped: Record<string, string[]> = {
    device: [],
    connection: [],
    registers: [],
    parameters: [],
    other: []
  };

  // Map error field names to friendly messages
  const friendlyMessages: Record<string, string> = {
    'range_0_name': 'Range name is required',
    'param_0_registerIndex': 'Register index is required',
  };
  
  errors.forEach(error => {
    // Use friendly message if available
    const message = friendlyMessages[error.field] || error.message;
    
    if (error.field.includes('name') || error.field.includes('make') || error.field.includes('model')) {
      grouped.device.push(message);
    } else if (error.field.includes('ip') || error.field.includes('port') || error.field.includes('slave') || 
               error.field.includes('serial') || error.field.includes('baud')) {
      grouped.connection.push(message);
    } else if (error.field.includes('range')) {
      grouped.registers.push(message);
    } else if (error.field.includes('param')) {
      grouped.parameters.push(message);
    } else {
      grouped.other.push(message);
    }
  });

  // Return only sections that have errors
  return Object.entries(grouped).filter(([_, msgs]) => msgs.length > 0);
};

const ValidationMessages: React.FC = () => {
  const { state } = useDeviceForm();
  const { validationState } = state;
  const fieldRefs = useContext(FormFieldRefsContext);

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

  // Always use compact version to save space
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-red-800">
              Please fix before continuing:
            </h3>
            <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full ml-2">
              {allErrors.length}
            </span>
          </div>
          
          <ul className="mt-1 space-y-0.5 text-red-700">
            {groupedErrors.map(([section, messages]) => (
              <li key={section}>
                <span className="font-medium">{section}</span>
                <ul className="pl-4 space-y-0.5">
                  {messages.map((message, idx) => {
                    // Extract field name from the original errors array
                    const errorEntry = allErrors.find(err => err.message === message);
                    const fieldName = errorEntry?.field || '';
                    
                    return (
                      <li key={idx} className="flex items-start">
                        <button 
                          type="button"
                          onClick={() => fieldRefs.focusField(fieldName)}
                          className="flex items-start text-left hover:text-red-800 group"
                        >
                          <span className="mr-1">•</span> 
                          <span>{message}</span>
                          <ArrowRight size={12} className="ml-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationMessages;