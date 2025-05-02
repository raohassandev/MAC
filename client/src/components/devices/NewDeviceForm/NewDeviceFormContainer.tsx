// client/src/components/devices/NewDeviceForm/NewDeviceFormContainer.tsx
import React, { useState} from 'react';
// import { DeviceFormProvider, useDeviceForm } from '../../DeviceFormContext';
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
import { DeviceFormProvider, useDeviceForm } from './DeviceFormContext';

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
    <div className="w-full">
      {/* Header removed as it's now in the parent modal */}

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