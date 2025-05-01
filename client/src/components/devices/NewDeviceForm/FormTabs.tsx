import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Settings, List, Activity } from 'lucide-react';
import { useDeviceForm } from './DeviceFormContext';
import ConnectionSettings from './tabs/ConnectionSettings';
import RegisterConfiguration from './tabs/RegisterConfiguration';
import DataReaderTab from './tabs/DataReaderTab';
// import ConnectionSettings from './tabs/ConnectionSettings';
// import RegisterConfiguration from './tabs/RegisterConfiguration';
// import DataReaderTab from './tabs/DataReaderTab';

const FormTabs: React.FC = () => {
  const { state, dispatch } = useDeviceForm();

  const handleTabChange = (value: string) => {
    // Skip validation if moving to a previous tab
    const tabOrder = ['connection', 'registers', 'data'];
    const currentTabIndex = tabOrder.indexOf(state.uiState.currentTab);
    const newTabIndex = tabOrder.indexOf(value);

    if (newTabIndex <= currentTabIndex) {
      dispatch({ type: 'SET_CURRENT_TAB', tab: value });
      return;
    }

    // Validate current tab content before switching
    dispatch({ type: 'VALIDATE_FORM' });

    // Check for specific tab validations
    if (state.uiState.currentTab === 'connection') {
      // Check for errors in the connection tab
      const hasConnectionErrors =
        state.validationState.basicInfo.length > 0 ||
        state.validationState.connection.length > 0;

      if (hasConnectionErrors) {
        return; // Don't switch tabs if there are errors
      }
    } else if (state.uiState.currentTab === 'registers') {
      // Validate that at least one register range is defined
      if (state.registerRanges.length === 0) {
        dispatch({
          type: 'SET_ERROR',
          error:
            'You must define at least one register range before proceeding',
        });
        return;
      }
    }

    // If validation passes, switch to the new tab
    dispatch({ type: 'SET_CURRENT_TAB', tab: value });
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
