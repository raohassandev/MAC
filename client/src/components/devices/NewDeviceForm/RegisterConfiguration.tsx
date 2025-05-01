import React from 'react';
import { useDeviceForm } from '../context/DeviceFormContext';
import RegisterRangeForm from './RegisterConfiguration/RegisterRangeForm';
import RegisterRangeList from './RegisterConfiguration/RegisterRangeList';

const RegisterConfiguration: React.FC = () => {
  const { state } = useDeviceForm();
  const { registerRanges, validationState } = state;

  // Calculate total number of registers from all ranges
  const totalRegistersCount = registerRanges.reduce(
    (sum, range) => sum + range.length,
    0
  );

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>
        Register Mapping Configuration
      </h2>

      <div className='bg-blue-50 p-3 rounded-md mb-4'>
        <p className='text-sm text-blue-700'>
          Configure register ranges to read from your Modbus device. Each range
          represents a continuous block of registers.
        </p>
      </div>

      {/* Register range validation warnings */}
      {validationState.registers.length > 0 && (
        <div className='mb-6 p-3 bg-red-50 border border-red-200 rounded-md'>
          <h4 className='text-sm font-medium text-red-800'>
            Register Range Issues:
          </h4>
          <ul className='mt-1 text-sm text-red-700 list-disc list-inside'>
            {validationState.registers.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Register range form */}
      <RegisterRangeForm />

      {/* Register range list */}
      <div className='mb-3 flex justify-between items-center'>
        <h3 className='text-md font-medium text-gray-700'>
          Configured Register Ranges
        </h3>
        {registerRanges.length > 0 && (
          <span className='text-sm text-gray-500'>
            Total Registers:{' '}
            <span className='font-medium'>{totalRegistersCount}</span>
            {totalRegistersCount > 100 && (
              <span className='ml-2 text-amber-600'>
                (High register count may impact performance)
              </span>
            )}
          </span>
        )}
      </div>

      <RegisterRangeList />
    </div>
  );
};

export default RegisterConfiguration;
