import React, { useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Settings, List, Activity } from 'lucide-react';
import { useDeviceForm } from './DeviceFormContext';
import ConnectionSettings from './tabs/ConnectionSettings';
import RegisterConfiguration from './tabs/RegisterConfiguration';
import DataReaderTab from './tabs/DataReaderTab';

const FormTabs: React.FC = () => {
  const { state, dispatch } = useDeviceForm();

  // Clear specific errors when you're on specific tabs
  useEffect(() => {
    if (state.uiState.currentTab === 'registers') {
      // Clear register-related errors when on the register tab
      if (
        state.uiState.error ===
        'You must define at least one register range before proceeding'
      ) {
        dispatch({ type: 'SET_ERROR', error: null });
      }

      // If we've added at least one register range, clear that validation
      if (state.registerRanges.length > 0) {
        // Dispatch a clear validation action for register-related errors
        dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
      }
    }
  }, [state.uiState.currentTab, state.registerRanges.length]);

  // This function handles tab navigation with minimum validation
  const handleTabChange = (value: string) => {
    // Always allow tab change regardless of validation state
    // We'll show validation errors but not block navigation
    dispatch({ type: 'SET_CURRENT_TAB', tab: value });

    // If moving forward, run validation to show errors
    const tabOrder = ['connection', 'registers', 'data'];
    const currentTabIndex = tabOrder.indexOf(state.uiState.currentTab);
    const newTabIndex = tabOrder.indexOf(value);

    if (newTabIndex > currentTabIndex) {
      // Validate but don't block
      dispatch({ type: 'VALIDATE_FORM' });
      // Show validation summary if there are errors
      if (!state.validationState.isValid) {
        dispatch({ type: 'TOGGLE_VALIDATION_SUMMARY', show: true });
      }
    }
  };

  return (
    <Tabs.Root
      defaultValue='connection'
      value={state.uiState.currentTab}
      onValueChange={handleTabChange}
    >
      <Tabs.List className='flex space-x-4 border-b border-gray-200 mb-4'>
        <Tabs.Trigger
          value='connection'
          className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
            ${
              state.uiState.currentTab === 'connection'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <Settings size={16} />
          Connection
        </Tabs.Trigger>
        <Tabs.Trigger
          value='registers'
          className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
            ${
              state.uiState.currentTab === 'registers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <List size={16} />
          Registers
        </Tabs.Trigger>

        <Tabs.Trigger
          value='data'
          className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
            ${
              state.uiState.currentTab === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <Activity size={16} />
          Data Reader
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value='connection'>
        <ConnectionSettings />
      </Tabs.Content>

      <Tabs.Content value='registers'>
        <RegisterConfiguration />
      </Tabs.Content>

      <Tabs.Content value='data'>
        <DataReaderTab />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default FormTabs;
