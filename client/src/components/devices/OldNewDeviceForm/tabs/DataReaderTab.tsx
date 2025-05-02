import React from 'react';
import ParameterForm from '../DataReaderTab/ParameterForm';
import ParameterTable from '../DataReaderTab/ParameterTable';
// import SimpleParserModal from '../DataReaderTab/SimpleParserModal'; // Import the new simple modal
import { useDeviceForm } from '../DeviceFormContext';
import SimpleParserModal from '../SimpleParserModal';

const DataReaderTab: React.FC = () => {
  const { state } = useDeviceForm();
  const { registerRanges } = state;

  if (registerRanges.length === 0) {
    return (
      <div className='bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4'>
        <h3 className='font-medium'>Define Register Ranges First</h3>
        <p className='text-sm mt-1'>
          You need to define at least one register range before configuring data
          parameters. Please go to the Registers tab and add your register
          ranges.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className='bg-blue-50 p-4 rounded-lg mb-4'>
        <h3 className='font-medium text-blue-800'>
          Data Parameter Configuration
        </h3>
        <p className='text-sm mt-1 text-blue-700'>
          Define how to interpret the data for each register range. Parameters
          define how to extract values from register data.
        </p>
      </div>

      {/* Parameter configuration form */}
      <ParameterForm />

      {/* Parameter list */}
      <ParameterTable />

      {/* New Simple Modal Component */}
      <SimpleParserModal />
    </div>
  );
};

export default DataReaderTab;
