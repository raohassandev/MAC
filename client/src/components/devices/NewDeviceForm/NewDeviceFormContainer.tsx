// client/src/components/devices/NewDeviceForm/NewDeviceFormContainer.tsx
import React, { useState} from 'react';
import { DeviceFormProvider, useDeviceForm } from './DeviceFormContext';
// import FormTabs from './FormTabs';
// import FormFooter from './FormFooter';
// import ConnectionSettings from './ConnectionSettings';
// import RegisterConfiguration from './RegisterConfiguration';
// import DataReaderTab from './DataReaderTab';
import { convertFormToDeviceData } from '../../../utils/TypeAdapter';
import ConnectionSettings from './ConnectionSettings';
import RegisterConfiguration from './RegisterConfiguration';
import DataReaderTab from './DataReaderTab';
import FormTabs from './FormTabs';
import FormFooter from './FormFooter';

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

  const handleSubmitForm = () => {
    const deviceData = convertFormToDeviceData(
      state.deviceBasics,
      state.connectionSettings,
      state.registerRanges,
      state.parameters
    );
    
    onSubmit(deviceData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit Device' : 'Add New Device'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure the device settings, registers, and data reading parameters.
        </p>
      </div>

      <FormTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      <div className="p-6">
        {activeTab === 'connection' && <ConnectionSettings />}
        {activeTab === 'registers' && <RegisterConfiguration />}
        {activeTab === 'parameters' && <DataReaderTab />}
      </div>

      <FormFooter
        onCancel={onClose}
        onNext={() => {
          const nextTabIndex = tabs.findIndex(tab => tab.id === activeTab) + 1;
          if (nextTabIndex < tabs.length) {
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