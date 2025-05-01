
import React from 'react';
import { useDeviceForm } from '../context/DeviceFormContext';
import { FormField } from '../shared/FormField';
import SelectControl from '../shared/SelectControl';

// Connection type options
const connectionTypeOptions = [
  { value: 'tcp', label: 'TCP' },
  { value: 'rtu', label: 'RTU' },
];

// RTU specific options
const baudRateOptions = [
  { value: '1200', label: '1200' },
  { value: '2400', label: '2400' },
  { value: '4800', label: '4800' },
  { value: '9600', label: '9600' },
  { value: '19200', label: '19200' },
  { value: '38400', label: '38400' },
  { value: '57600', label: '57600' },
  { value: '115200', label: '115200' },
];

const dataBitsOptions = [
  { value: '7', label: '7' },
  { value: '8', label: '8' },
];

const stopBitsOptions = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
];

const parityOptions = [
  { value: 'none', label: 'None' },
  { value: 'even', label: 'Even' },
  { value: 'odd', label: 'Odd' },
];

const ConnectionSettings: React.FC = () => {
  const { state, dispatch } = useDeviceForm();
  const { connectionSettings } = state;

  // Helper function to check for field errors
  const getFieldError = (field: string): string | undefined => {
    const error = state.validationState.connection.find(
      (err) => err.field === field
    );
    return error?.message;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_CONNECTION_SETTING',
      field: name,
      value,
    });
  };

  const handleConnectionTypeChange = (value: string) => {
    dispatch({
      type: 'UPDATE_CONNECTION_TYPE',
      value: value as 'tcp' | 'rtu',
    });
  };

  return (
    <div className='space-y-4'>
      <SelectControl
        label='Connection Type'
        options={connectionTypeOptions}
        value={connectionSettings.type}
        onChange={handleConnectionTypeChange}
      />

      {connectionSettings.type === 'tcp' ? (
        <TcpSettings
          ip={connectionSettings.ip}
          port={connectionSettings.port}
          slaveId={connectionSettings.slaveId}
          onChange={handleInputChange}
          getFieldError={getFieldError}
        />
      ) : (
        <RtuSettings
          serialPort={connectionSettings.serialPort}
          baudRate={connectionSettings.baudRate}
          dataBits={connectionSettings.dataBits}
          stopBits={connectionSettings.stopBits}
          parity={connectionSettings.parity}
          slaveId={connectionSettings.slaveId}
          onChange={handleInputChange}
          getFieldError={getFieldError}
        />
      )}
    </div>
  );
};

// TCP Settings Component
interface TcpSettingsProps {
  ip: string;
  port: string;
  slaveId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFieldError: (field: string) => string | undefined;
}

const TcpSettings: React.FC<TcpSettingsProps> = ({
  ip,
  port,
  slaveId,
  onChange,
  getFieldError,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <FormField label='IP Address' required error={getFieldError('ip')}>
        <input
          placeholder='192.168.1.100'
          type='text'
          name='ip'
          value={ip}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('ip') ? 'border-red-500' : ''
          }`}
          required
        />
      </FormField>

      <FormField label='Port' required error={getFieldError('port')}>
        <input
          placeholder='502'
          type='number'
          name='port'
          value={port}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('port') ? 'border-red-500' : ''
          }`}
          min='1'
          max='65535'
          required
        />
      </FormField>

      <FormField
        label='Slave ID (0-247)'
        required
        error={getFieldError('slaveId')}
      >
        <input
          placeholder='1'
          type='number'
          name='slaveId'
          value={slaveId}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('slaveId') ? 'border-red-500' : ''
          }`}
          min='0'
          max='247'
          required
        />
      </FormField>
    </div>
  );
};

// RTU Settings Component
interface RtuSettingsProps {
  serialPort: string;
  baudRate: string;
  dataBits: string;
  stopBits: string;
  parity: string;
  slaveId: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  getFieldError: (field: string) => string | undefined;
}

const RtuSettings: React.FC<RtuSettingsProps> = ({
  serialPort,
  baudRate,
  dataBits,
  stopBits,
  parity,
  slaveId,
  onChange,
  getFieldError,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <FormField
        label='Serial Port'
        required
        error={getFieldError('serialPort')}
      >
        <input
          placeholder='COM1, /dev/ttyS0'
          type='text'
          name='serialPort'
          value={serialPort}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('serialPort') ? 'border-red-500' : ''
          }`}
          required
        />
      </FormField>

      <FormField label='Baud Rate' error={getFieldError('baudRate')}>
        <select
          name='baudRate'
          value={baudRate}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('baudRate') ? 'border-red-500' : ''
          }`}
        >
          {baudRateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label='Data Bits' error={getFieldError('dataBits')}>
        <select
          name='dataBits'
          value={dataBits}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('dataBits') ? 'border-red-500' : ''
          }`}
        >
          {dataBitsOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label='Stop Bits' error={getFieldError('stopBits')}>
        <select
          name='stopBits'
          value={stopBits}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('stopBits') ? 'border-red-500' : ''
          }`}
        >
          {stopBitsOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label='Parity' error={getFieldError('parity')}>
        <select
          name='parity'
          value={parity}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('parity') ? 'border-red-500' : ''
          }`}
        >
          {parityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label='Slave ID (0-247)'
        required
        error={getFieldError('slaveId')}
      >
        <input
          placeholder='1'
          type='number'
          name='slaveId'
          value={slaveId}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            getFieldError('slaveId') ? 'border-red-500' : ''
          }`}
          min='0'
          max='247'
          required
        />
      </FormField>
    </div>
  );
};

export default ConnectionSettings;