// client/src/components/devices/NewDeviceForm/NewDeviceFormContainer.tsx
import React, { useState, useEffect } from 'react';
import { convertFormToDeviceData } from '../../../utils/TypeAdapter';
import ConnectionSettings from './ConnectionSettings';
import RegisterConfiguration from './RegisterConfiguration';
import DataReaderTab from './DataReaderTab';
import FormTabs from './FormTabs';
import FormFooter from './FormFooter';
import { DeviceFormProvider, useDeviceForm } from './DeviceFormContext';
import { validateDeviceForm, convertValidationErrorsToState } from './validation';
import ValidationMessages from './ValidationMessages';
import FormGuide from './FormGuide';

interface NewDeviceFormContainerProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

// Inner form component that can access context
const DeviceFormContent: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
  isEditing: boolean;
}> = ({ onClose, onSubmit, isEditing }) => {
  const { state } = useDeviceForm();
  const [activeTab, setActiveTab] = useState('connection');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'connection', label: 'Connection Settings' },
    { id: 'registers', label: 'Register Configuration' },
    { id: 'parameters', label: 'Data Reader' },
  ];

  // Validate the form when tab changes or on submit
  const validateForm = () => {
    const validationErrors = validateDeviceForm(state);
    const validationState = convertValidationErrorsToState(validationErrors);
    
    // Update validation state in context
    if (activeTab === 'connection') {
      // Only show connection errors when on connection tab
      const connectionValidation = {
        ...validationState,
        basicInfo: [],
        registers: [],
        parameters: [],
      };
      actions.setUIState({ validationErrors: connectionValidation });
    } else if (activeTab === 'registers') {
      // Only show register errors when on registers tab
      const registersValidation = {
        ...validationState,
        basicInfo: [],
        connection: [],
        parameters: [],
      };
      actions.setUIState({ validationErrors: registersValidation });
    } else if (activeTab === 'parameters') {
      // Show all errors when on parameters tab (last tab)
      actions.setUIState({ validationErrors: validationState });
    }
    
    return validationErrors.isValid;
  };
  
  // Run validation when tab changes
  useEffect(() => {
    validateForm();
  }, [activeTab]);
  
  const handleSubmitForm = () => {
    // Run full validation before submitting
    const isValid = validateForm();
    
    if (!isValid) {
      // Display error message or highlight the tab with errors
      console.error('Please fix validation errors before submitting');
      return;
    }
    
    const deviceData = convertFormToDeviceData(
      state.deviceBasics,
      state.connectionSettings,
      state.registerRanges,
      state.parameters
    );
    
    onSubmit(deviceData);
  };

  return (
    <div className="w-full">
      {/* Header removed as it's now in the parent modal */}

      <FormTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Display validation messages */}
          <ValidationMessages />
          
          {activeTab === 'connection' && <ConnectionSettings />}
          {activeTab === 'registers' && <RegisterConfiguration />}
          {activeTab === 'parameters' && <DataReaderTab />}
        </div>
        
        {/* Right sidebar with guide */}
        <div className="md:col-span-1">
          <FormGuide activeTab={activeTab} />
        </div>
      </div>

      <FormFooter
        onCancel={onClose}
        onNext={() => {
          // Validate current tab before proceeding
          const isValid = validateForm();
          
          // Only proceed if validation passed or we're not on the last tab
          const nextTabIndex = tabs.findIndex(tab => tab.id === activeTab) + 1;
          if (nextTabIndex < tabs.length) {
            // We can go to next tab even with errors
            setActiveTab(tabs[nextTabIndex].id);
          }
        }}
        onPrevious={() => {
          const prevTabIndex = tabs.findIndex(tab => tab.id === activeTab) - 1;
          if (prevTabIndex >= 0) {
            setActiveTab(tabs[prevTabIndex].id);
          }
        }}
        onSubmit={handleSubmitForm}
        isLastStep={activeTab === 'parameters'}
        isFirstStep={activeTab === 'connection'}
      />
    </div>
  );
};

// Main container component that provides context
const NewDeviceFormContainer: React.FC<NewDeviceFormContainerProps> = ({
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  // Parse initialData into form state format if provided
  const formattedInitialData = initialData ? {
    deviceBasics: {
      name: initialData.name || '',
      make: initialData.make || '',
      model: initialData.model || '',
      description: initialData.description || '',
      enabled: initialData.enabled !== undefined ? initialData.enabled : true,
      tags: initialData.tags || [],
    },
    connectionSettings: {
      type: initialData.connectionType || 'tcp',
      ip: initialData.ip || '',
      port: initialData.port?.toString() || '502',
      slaveId: initialData.slaveId?.toString() || '1',
      serialPort: initialData.serialPort || '',
      baudRate: initialData.baudRate?.toString() || '9600',
      dataBits: initialData.dataBits?.toString() || '8',
      stopBits: initialData.stopBits?.toString() || '1',
      parity: initialData.parity || 'none',
    },
    registerRanges: initialData.registerRanges || [],
    parameters: initialData.parameterConfigs || [],
  } : undefined;

  return (
    <DeviceFormProvider initialData={formattedInitialData}>
      <DeviceFormContent
        onClose={onClose}
        onSubmit={onSubmit}
        isEditing={isEditing}
      />
    </DeviceFormProvider>
  );
};

export default NewDeviceFormContainer;