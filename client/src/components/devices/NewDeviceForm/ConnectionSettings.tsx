// client/src/components/devices/NewDeviceForm/ConnectionSettings.tsx
import React from 'react';
import { useDeviceForm } from './DeviceFormContext';
import { Input } from '../../ui/Input';
import { Form } from '../../ui/Form';

// We need to create a custom Select component for type compatibility
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
}

// Custom Select component
const Select: React.FC<SelectProps> = ({ id, value, onChange, options, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
        error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : ''
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const ConnectionSettings: React.FC = () => {
  const { state, actions } = useDeviceForm();
  const { connectionSettings } = state;

  const handleConnectionTypeChange = (value: string) => {
    actions.setConnectionSettings({ type: value as 'tcp' | 'rtu' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    actions.setConnectionSettings({ [name]: value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    actions.setConnectionSettings({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Connection Settings</h3>

      <Form.Group>
        <Form.Label htmlFor="connectionType">Connection Type</Form.Label>
        <Select
          id="connectionType"
          value={connectionSettings.type}
          onChange={handleConnectionTypeChange}
          options={[
            { value: 'tcp', label: 'TCP/IP (Ethernet)' },
            { value: 'rtu', label: 'RTU (Serial)' },
          ]}
        />
      </Form.Group>

      {connectionSettings.type === 'tcp' ? (
        <>
          <Form.Row>
            <Form.Group>
              <Form.Label htmlFor="ip" required>IP Address</Form.Label>
              <Input
                id="ip"
                name="ip"
                value={connectionSettings.ip}
                onChange={handleInputChange}
                placeholder="192.168.1.100"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="port" required>Port</Form.Label>
              <Input
                id="port"
                name="port"
                type="number"
                value={connectionSettings.port}
                onChange={handleInputChange}
                placeholder="502"
              />
            </Form.Group>
          </Form.Row>
        </>
      ) : (
        <>
          <Form.Row>
            <Form.Group>
              <Form.Label htmlFor="serialPort" required>Serial Port</Form.Label>
              <Input
                id="serialPort"
                name="serialPort"
                value={connectionSettings.serialPort}
                onChange={handleInputChange}
                placeholder="COM1 or /dev/ttyS0"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="baudRate">Baud Rate</Form.Label>
              <Select
                id="baudRate"
                value={connectionSettings.baudRate}
                onChange={handleSelectChange('baudRate')}
                options={[
                  { value: '1200', label: '1200' },
                  { value: '2400', label: '2400' },
                  { value: '4800', label: '4800' },
                  { value: '9600', label: '9600' },
                  { value: '19200', label: '19200' },
                  { value: '38400', label: '38400' },
                  { value: '57600', label: '57600' },
                  { value: '115200', label: '115200' },
                ]}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group>
              <Form.Label htmlFor="dataBits">Data Bits</Form.Label>
              <Select
                id="dataBits"
                value={connectionSettings.dataBits}
                onChange={handleSelectChange('dataBits')}
                options={[
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                  { value: '7', label: '7' },
                  { value: '8', label: '8' },
                ]}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="stopBits">Stop Bits</Form.Label>
              <Select
                id="stopBits"
                value={connectionSettings.stopBits}
                onChange={handleSelectChange('stopBits')}
                options={[
                  { value: '1', label: '1' },
                  { value: '1.5', label: '1.5' },
                  { value: '2', label: '2' },
                ]}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="parity">Parity</Form.Label>
              <Select
                id="parity"
                value={connectionSettings.parity}
                onChange={handleSelectChange('parity')}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'even', label: 'Even' },
                  { value: 'odd', label: 'Odd' },
                ]}
              />
            </Form.Group>
          </Form.Row>
        </>
      )}

      <Form.Group>
        <Form.Label htmlFor="slaveId" required>Slave ID</Form.Label>
        <Input
          id="slaveId"
          name="slaveId"
          type="number"
          value={connectionSettings.slaveId}
          onChange={handleInputChange}
          placeholder="1"
        />
      </Form.Group>
    </div>
  );
};

export default ConnectionSettings;