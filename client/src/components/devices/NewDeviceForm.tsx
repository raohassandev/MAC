import {
  Activity,
  AlertCircle,
  FileText,
  List,
  Plus,
  Save,
  Server,
  Settings,
  Trash,
  X,
  ChevronDown,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { Button, Table } from '@radix-ui/themes';

// Types and Interfaces
interface ParameterConfig {
  name: string;
  dataType: string;
  scalingFactor: number;
  decimalPoint: number;
  byteOrder: string;
  registerRange: string;
  registerIndex: number;
}

interface RegisterReadInfo {
  rangeName: string;
  startRegister: number;
  length: number;
  functionCode: number;
}

interface RegisterRange {
  readInfo: RegisterReadInfo;
  parsingInfo: ParameterConfig[];
}

interface DeviceTemplate {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  registerRanges: RegisterRange[];
}

interface NewDeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: any | unknown) => void;
}

// Reusable Components
// SelectItem component for consistent select dropdown items
const SelectItem: React.FC<{
  value: string;
  label: string;
}> = ({ value, label }) => (
  <Select.Item
    value={value}
    className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
  >
    <Select.ItemText>{label}</Select.ItemText>
  </Select.Item>
);

const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <div className={`mb-6 border rounded-lg p-4 ${className}`}>
    <h3 className='font-medium text-gray-800 mb-3'>{title}</h3>
    {children}
  </div>
);

const ErrorAlert: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div className='mx-4 mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded'>
      <div className='flex items-center'>
        <AlertCircle size={20} className='text-red-500 mr-2' />
        <span className='text-red-700'>{message}</span>
      </div>
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, required = false, children, className = '' }) => (
  <div className={className}>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label} {required && '*'}
    </label>
    {children}
  </div>
);

const FunctionCodeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger className='w-full flex items-center justify-between p-2 border rounded bg-white'>
      <Select.Value placeholder='Select a function code' />
      <Select.Icon>
        <ChevronDown size={16} />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className='bg-white border rounded shadow-lg z-[999]'>
        <Select.Viewport className='p-1'>
          <Select.Group>
            <SelectItem value='1' label='1 - Read Coils' />
            <SelectItem value='2' label='2 - Read Discrete Inputs' />
            <SelectItem value='3' label='3 - Read Holding Registers' />
            <SelectItem value='4' label='4 - Read Input Registers' />
            <SelectItem value='5' label='5 - Write Single Coil' />
            <SelectItem value='6' label='6 - Write Single Register' />
            <SelectItem value='15' label='15 - Write Multiple Coils' />
            <SelectItem value='16' label='16 - Write Multiple Registers' />
            <SelectItem value='22' label='22 - Mask Write Register' />
            <SelectItem value='23' label='23 - Read/Write Multiple Registers' />
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const DataTypeSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger className='w-full flex items-center justify-between p-1.5 border rounded bg-white text-sm'>
      <Select.Value />
      <Select.Icon>
        <ChevronDown size={14} />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className='bg-white border rounded shadow-lg z-[999]'>
        <Select.Viewport className='p-1'>
          <Select.Group>
            <SelectItem value='INT-16' label='Int16 (1 register)' />
            <SelectItem value='UINT-16' label='UInt16 (1 register)' />
            <SelectItem value='INT-32' label='Int32 (2 registers)' />
            <SelectItem value='UINT-32' label='UInt32 (2 registers)' />
            <SelectItem value='FLOAT' label='Float (2 registers)' />
            <SelectItem value='DOUBLE' label='Double (4 registers)' />
            <SelectItem value='BOOLEAN' label='Boolean (bit)' />
            <SelectItem value='STRING' label='String (multiple registers)' />
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const ByteOrderSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger className='w-full flex items-center justify-between p-1.5 border rounded bg-white text-sm'>
      <Select.Value placeholder='Select byte order' />
      <Select.Icon>
        <ChevronDown size={14} />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className='bg-white border rounded shadow-lg z-[999]'>
        <Select.Viewport className='p-1'>
          <Select.Group>
            <SelectItem value='AB' label='AB (big-endian)' />
            <SelectItem value='BA' label='BA (little-endian)' />
            <SelectItem value='ABCD' label='ABCD (big-endian, 32-bit)' />
            <SelectItem value='CDAB' label='CDAB (little-endian word swap)' />
            <SelectItem value='BADC' label='BADC (byte swap)' />
            <SelectItem value='DCBA' label='DCBA (little-endian, 32-bit)' />
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const RegisterRangeTable: React.FC<{
  registerRanges: RegisterRange[];
  currentEditingRange: string | null;
  onSelectRange: (rangeName: string) => void;
  onDeleteRange: (index: number) => void;
}> = ({
  registerRanges,
  currentEditingRange,
  onSelectRange,
  onDeleteRange,
}) => {
  if (registerRanges.length === 0) {
    return (
      <div className='bg-gray-50 p-6 rounded text-center mb-6'>
        <Server size={24} className='mx-auto text-gray-400 mb-2' />
        <p className='text-gray-500'>
          No register ranges added yet. Add a register range for this device
          above.
        </p>
        <p className='text-gray-400 text-sm mt-1'>
          Each Modbus device has different register mappings. Check your device
          manual for details.
        </p>
      </div>
    );
  }

  return (
    <div className='mb-6'>
      <h3 className='font-medium text-gray-800 mb-3'>
        Configured Register Ranges
      </h3>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Range Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Start Register
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Length
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Function Code
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Parameters
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {registerRanges.map((range, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                onClick={() => onSelectRange(range.readInfo.rangeName)}
                style={{
                  cursor: 'pointer',
                  backgroundColor:
                    currentEditingRange === range.readInfo.rangeName
                      ? '#EBF5FF'
                      : '',
                }}
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {range.readInfo.rangeName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {range.readInfo.startRegister}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {range.readInfo.length}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {getFunctionCodeLabel(range.readInfo.functionCode)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {range.parsingInfo.length}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRange(index);
                    }}
                    className='text-red-600 hover:text-red-900'
                    aria-label='Delete range'
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ParameterConfigForm: React.FC<{
  currentEditingRange: string;
  newParameterConfig: ParameterConfig;
  onParameterChange: (field: string, value: string | number) => void;
  onAddParameter: () => void;
}> = ({
  currentEditingRange,
  newParameterConfig,
  onParameterChange,
  onAddParameter,
}) => (
  <div className='mb-6 border rounded-lg p-4'>
    <h3 className='font-medium text-gray-800 mb-3'>
      Parameter Configuration for {currentEditingRange}
    </h3>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
      <FormField label='Parameter Name' required>
        <input
          type='text'
          value={newParameterConfig.name}
          onChange={(e) => onParameterChange('name', e.target.value)}
          className='p-1.5 border rounded w-full text-sm'
          placeholder='Parameter name'
        />
      </FormField>

      <FormField label='Data Type' required>
        <DataTypeSelector
          value={newParameterConfig.dataType}
          onChange={(value) => onParameterChange('dataType', value)}
        />
      </FormField>

      <FormField label='Scaling Factor'>
        <input
          type='number'
          value={newParameterConfig.scalingFactor}
          onChange={(e) =>
            onParameterChange('scalingFactor', parseFloat(e.target.value) || 1)
          }
          className='p-1.5 border rounded w-full text-sm'
          placeholder='1.0'
          step='0.01'
        />
      </FormField>

      <FormField label='Decimal Point'>
        <input
          type='number'
          value={newParameterConfig.decimalPoint}
          onChange={(e) =>
            onParameterChange('decimalPoint', parseInt(e.target.value) || 0)
          }
          className='p-1.5 border rounded w-full text-sm'
          min='0'
          max='10'
        />
      </FormField>

      <FormField label='Byte Order'>
        <ByteOrderSelector
          value={newParameterConfig.byteOrder}
          onChange={(value) => onParameterChange('byteOrder', value)}
        />
      </FormField>

      <FormField label='Register Index'>
        <input
          type='number'
          value={newParameterConfig.registerIndex}
          onChange={(e) =>
            onParameterChange('registerIndex', parseInt(e.target.value) || 0)
          }
          className='p-1.5 border rounded w-full text-sm'
          min='0'
        />
      </FormField>
    </div>

    <button
      onClick={onAddParameter}
      className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
    >
      <Plus size={16} /> Add Parameter
    </button>
  </div>
);

const ParameterTable: React.FC<{
  currentEditingRange: string;
  parameters: ParameterConfig[];
  onDeleteParameter: (index: number) => void;
}> = ({ currentEditingRange, parameters, onDeleteParameter }) => (
  <div className='mt-4'>
    <h3 className='font-medium text-gray-800 mb-3'>
      Parameters for {currentEditingRange}
    </h3>
    <Table.Root variant='surface' size='2'>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Parameter Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Data Type</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Scaling Factor</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Decimal Point</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Byte Order</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Register Index</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {parameters.map((config, index) => (
          <Table.Row key={index}>
            <Table.Cell>{config.name}</Table.Cell>
            <Table.Cell>{config.dataType}</Table.Cell>
            <Table.Cell>{config.scalingFactor}</Table.Cell>
            <Table.Cell>{config.decimalPoint}</Table.Cell>
            <Table.Cell>{config.byteOrder}</Table.Cell>
            <Table.Cell>{config.registerIndex}</Table.Cell>
            <Table.Cell>
              <Button
                color='red'
                variant='soft'
                size='1'
                onClick={() => onDeleteParameter(index)}
              >
                <Trash size={16} />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </div>
);

// Helper function to get function code label
const getFunctionCodeLabel = (code: number): string => {
  const functionCodes: Record<number, string> = {
    1: '1 - Read Coils',
    2: '2 - Read Discrete Inputs',
    3: '3 - Read Holding Registers',
    4: '4 - Read Input Registers',
    5: '5 - Write Single Coil',
    6: '6 - Write Single Register',
    15: '15 - Write Multiple Coils',
    16: '16 - Write Multiple Registers',
    22: '22 - Mask Write Register',
    23: '23 - Read/Write Multiple Registers',
  };

  return functionCodes[code] || `${code}`;
};

// Main Component
const NewDeviceForm: React.FC<NewDeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('connection');

  // Connection type state
  const [connectionType, setConnectionType] = useState<'tcp' | 'rtu'>('tcp');

  // Register ranges state with new structure
  const [registerRanges, setRegisterRanges] = useState<RegisterRange[]>([]);

  const [newRegisterReadInfo, setNewRegisterReadInfo] =
    useState<RegisterReadInfo>({
      rangeName: '',
      startRegister: 0,
      length: 1,
      functionCode: 3,
    });

  // Current range being edited for parameter configuration
  const [currentEditingRange, setCurrentEditingRange] = useState<string | null>(
    null
  );

  // New parameter config being added to a register range
  const [newParameterConfig, setNewParameterConfig] = useState<ParameterConfig>(
    {
      name: '',
      dataType: 'UINT-16',
      scalingFactor: 1,
      decimalPoint: 0,
      byteOrder: 'AB',
      registerRange: '',
      registerIndex: 0,
    }
  );

  // Template state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templates, setTemplates] = useState<DeviceTemplate[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Device data state
  const [deviceData, setDeviceData] = useState({
    name: '',
    make: '',
    model: '',
    description: '',
    ip: '',
    port: '502',
    slaveId: '1',
    serialPort: '',
    baudRate: '9600',
    dataBits: '8',
    stopBits: '1',
    parity: 'none',
    enabled: true,
    tags: [] as string[],
  });

  // Fetch device templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // Sample data for demonstration with new structure
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTemplates([
          {
            id: '1',
            name: 'Energy Analyzer',
            description:
              'Standard template for energy analyzers with voltage, current, and power readings',
            deviceType: 'Energy Analyzer',
            registerRanges: [
              {
                readInfo: {
                  rangeName: 'Voltage Readings',
                  startRegister: 0,
                  length: 3,
                  functionCode: 3,
                },
                parsingInfo: [
                  {
                    name: 'Voltage L1',
                    dataType: 'FLOAT',
                    scalingFactor: 0.1,
                    decimalPoint: 1,
                    byteOrder: 'ABCD',
                    registerRange: 'Voltage Readings',
                    registerIndex: 0,
                  },
                  {
                    name: 'Voltage L2',
                    dataType: 'FLOAT',
                    scalingFactor: 0.1,
                    decimalPoint: 1,
                    byteOrder: 'ABCD',
                    registerRange: 'Voltage Readings',
                    registerIndex: 1,
                  },
                ],
              },
              {
                readInfo: {
                  rangeName: 'Current Readings',
                  startRegister: 100,
                  length: 3,
                  functionCode: 3,
                },
                parsingInfo: [],
              },
            ],
          },
          {
            id: '2',
            name: 'Temperature Controller',
            description:
              'Template for temperature controllers with setpoint and measurement',
            deviceType: 'Temperature Controller',
            registerRanges: [
              {
                readInfo: {
                  rangeName: 'Temperature Values',
                  startRegister: 0,
                  length: 2,
                  functionCode: 3,
                },
                parsingInfo: [],
              },
            ],
          },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setDeviceData({
      ...deviceData,
      [name]: newValue,
    });
  };

  const handleRegisterReadInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === 'rangeName' ? value : parseInt(value);

    setNewRegisterReadInfo({
      ...newRegisterReadInfo,
      [name]: newValue,
    });
  };

  const handleParameterConfigChange = (
    field: string,
    value: string | number
  ) => {
    setNewParameterConfig({
      ...newParameterConfig,
      [field]: value,
    });
  };

  const handleAddRegisterRange = () => {
    if (
      !newRegisterReadInfo.rangeName ||
      newRegisterReadInfo.startRegister < 0
    ) {
      setError('Please fill out all required register range fields');
      return;
    }

    // Create a new register range with the readInfo and empty parsingInfo
    const newRange: RegisterRange = {
      readInfo: { ...newRegisterReadInfo },
      parsingInfo: [],
    };

    setRegisterRanges([...registerRanges, newRange]);

    // Set this as the current editing range
    setCurrentEditingRange(newRegisterReadInfo.rangeName);

    // Update the new parameter config's register range to match
    setNewParameterConfig({
      ...newParameterConfig,
      registerRange: newRegisterReadInfo.rangeName,
    });

    // Reset the new register read info
    setNewRegisterReadInfo({
      rangeName: '',
      startRegister: 0,
      length: 1,
      functionCode: 3,
    });

    setError(null);
    toast.success('Register range added successfully');
  };

  const handleDeleteRegisterRange = (index: number) => {
    const rangeName = registerRanges[index].readInfo.rangeName;
    setRegisterRanges(registerRanges.filter((_, i) => i !== index));

    // If we're deleting the current editing range, reset it
    if (currentEditingRange === rangeName) {
      setCurrentEditingRange(null);
    }

    toast.info('Register range removed');
  };

  const handleAddParameterConfig = () => {
    if (!newParameterConfig.name) {
      setError('Parameter name is required');
      return;
    }

    if (!currentEditingRange) {
      setError('Please select a register range to add parameters to');
      return;
    }

    // Find the current register range and add the parameter to its parsingInfo
    const updatedRanges = registerRanges.map((range) => {
      if (range.readInfo.rangeName === currentEditingRange) {
        return {
          ...range,
          parsingInfo: [...range.parsingInfo, { ...newParameterConfig }],
        };
      }
      return range;
    });

    setRegisterRanges(updatedRanges);

    // Reset name field but keep other values for faster entry of multiple parameters
    setNewParameterConfig({
      ...newParameterConfig,
      name: '',
      registerIndex: newParameterConfig.registerIndex + 1,
    });

    setError(null);
    toast.success('Parameter configuration added');
  };

  const handleDeleteParameterConfig = (paramIndex: number) => {
    const rangeIndex = registerRanges.findIndex(
      (r) => r.readInfo.rangeName === currentEditingRange
    );

    if (rangeIndex !== -1) {
      const updatedRanges = [...registerRanges];
      updatedRanges[rangeIndex].parsingInfo = updatedRanges[
        rangeIndex
      ].parsingInfo.filter((_, i) => i !== paramIndex);
      setRegisterRanges(updatedRanges);
      toast.info('Parameter configuration removed');
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);

    // Find the selected template
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      // Set the register ranges from the template
      setRegisterRanges([...template.registerRanges]);
      toast.success('Template applied successfully');
    }
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!deviceData.name) {
      setError('Device name is required');
      return false;
    }

    if (connectionType === 'tcp') {
      if (!deviceData.ip) {
        setError('IP address is required for TCP connections');
        return false;
      }
    } else {
      // rtu
      if (!deviceData.serialPort) {
        setError('Serial port is required for RTU connections');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Prepare the device data for submission with new structure
    const deviceForSubmission = {
      ...deviceData,
      port: parseInt(deviceData.port),
      slaveId: parseInt(deviceData.slaveId),
      baudRate: parseInt(deviceData.baudRate),
      dataBits: parseInt(deviceData.dataBits),
      stopBits: parseInt(deviceData.stopBits),
      connectionType,
      registerRanges,
    };

    onSubmit(deviceForSubmission);
    toast.success('Device added successfully');
  };

  // Helper function to find current range being edited
  const getCurrentRange = () => {
    return registerRanges.find(
      (range) => range.readInfo.rangeName === currentEditingRange
    );
  };

  // Early return if not open
  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-50' />
        <Dialog.Content className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-4 border-b'>
              <Dialog.Title className='text-xl font-semibold'>
                Add New Modbus Device
              </Dialog.Title>
              <Dialog.Close className='text-gray-500 hover:text-gray-700'>
                <X size={20} />
              </Dialog.Close>
            </div>

            <ErrorAlert message={error} />

            <div className='p-4'>
              {/* Basic Device Info */}
              <div className='mb-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField label='Device Name' required>
                    <input
                      placeholder='Enter device name'
                      name='name'
                      value={deviceData.name}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full'
                    />
                  </FormField>

                  <FormField label='Make/Manufacturer'>
                    <input
                      placeholder='E.g., Schneider, ABB'
                      name='make'
                      value={deviceData.make}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full'
                    />
                  </FormField>

                  <FormField label='Model'>
                    <input
                      placeholder='Device model'
                      name='model'
                      value={deviceData.model}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full'
                    />
                  </FormField>

                  <FormField label='Description'>
                    <textarea
                      placeholder='Brief description'
                      name='description'
                      value={deviceData.description}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full h-20 resize-none'
                    />
                  </FormField>

                  <div className='md:col-span-2'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        name='enabled'
                        checked={deviceData.enabled}
                        onChange={handleInputChange}
                        className='h-4 w-4 text-blue-600'
                      />
                      <span className='text-sm text-gray-700'>
                        Device Enabled
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs.Root
                defaultValue='connection'
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <Tabs.List className='flex space-x-4 border-b border-gray-200 mb-4'>
                  <Tabs.Trigger
                    value='connection'
                    className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                      ${
                        activeTab === 'connection'
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
                        activeTab === 'registers'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <List size={16} />
                    Registers & Data
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value='data'
                    className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                      ${
                        activeTab === 'data'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Activity size={16} />
                    Data Reader
                  </Tabs.Trigger>
                </Tabs.List>

                {/* Connection Tab */}
                <Tabs.Content value='connection' className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Connection Type
                    </label>
                    <select
                      className='w-full mt-1 p-2 border rounded'
                      value={connectionType}
                      onChange={(e) =>
                        setConnectionType(e.target.value as 'tcp' | 'rtu')
                      }
                    >
                      <option value='tcp'>TCP</option>
                      <option value='rtu'>RTU</option>
                    </select>
                  </div>

                  {connectionType === 'tcp' ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField label='IP Address' required>
                        <input
                          placeholder='192.168.1.100'
                          type='text'
                          name='ip'
                          value={deviceData.ip}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>

                      <FormField label='Port' required>
                        <input
                          placeholder='502'
                          type='number'
                          name='port'
                          value={deviceData.port}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>

                      <FormField label='Slave ID' required>
                        <input
                          placeholder='1'
                          type='number'
                          name='slaveId'
                          value={deviceData.slaveId}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField label='Serial Port' required>
                        <input
                          placeholder='COM1, /dev/ttyS0'
                          type='text'
                          name='serialPort'
                          value={deviceData.serialPort}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>

                      <FormField label='Baud Rate'>
                        <input
                          placeholder='9600'
                          type='number'
                          name='baudRate'
                          value={deviceData.baudRate}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>

                      <FormField label='Data Bits'>
                        <input
                          placeholder='8'
                          type='number'
                          name='dataBits'
                          value={deviceData.dataBits}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>

                      <FormField label='Stop Bits'>
                        <input
                          placeholder='1'
                          type='number'
                          name='stopBits'
                          value={deviceData.stopBits}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>

                      <FormField label='Parity'>
                        <select
                          className='w-full p-2 border rounded'
                          name='parity'
                          value={deviceData.parity}
                          onChange={handleInputChange}
                        >
                          <option value='none'>None</option>
                          <option value='even'>Even</option>
                          <option value='odd'>Odd</option>
                        </select>
                      </FormField>

                      <FormField label='Slave ID' required>
                        <input
                          placeholder='1'
                          type='number'
                          name='slaveId'
                          value={deviceData.slaveId}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </FormField>
                    </div>
                  )}
                </Tabs.Content>

                {/* Registers Tab */}
                <Tabs.Content value='registers'>
                  <div>
                    <h2 className='text-lg font-semibold mb-4'>
                      Register Configuration
                    </h2>

                    <div className='bg-blue-50 p-3 rounded-md mb-4'>
                      <p className='text-sm text-blue-700'>
                        Configure register ranges to read from your Modbus
                        device and define how to parse the data.
                      </p>
                    </div>

                    {/* Template Selection */}
                    <FormSection
                      title='Device Template (Optional)'
                      className='bg-gray-50'
                    >
                      <p className='text-sm text-gray-600 mb-3'>
                        Select a pre-defined template or create your own
                        register configuration below.
                      </p>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField label='Template'>
                          <Select.Root
                            value={selectedTemplateId}
                            onValueChange={handleSelectTemplate}
                          >
                            <Select.Trigger className='w-full flex items-center justify-between p-2 border rounded bg-white'>
                              <Select.Value placeholder='Select a template' />
                              <Select.Icon>
                                <ChevronDown size={16} />
                              </Select.Icon>
                            </Select.Trigger>

                            <Select.Portal>
                              <Select.Content className='bg-white border rounded shadow-lg z-[999]'>
                                <Select.Viewport className='p-1'>
                                  <Select.Group>
                                    {templates.map((template) => (
                                      <Select.Item
                                        key={template.id}
                                        value={template.id}
                                        className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                      >
                                        <Select.ItemText>
                                          {template.name}
                                        </Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Group>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </FormField>
                      </div>
                    </FormSection>

                    {/* Register Range Configuration */}
                    <FormSection title='Add Register Range'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <FormField label='Range Name' required>
                          <input
                            placeholder='e.g., Voltage Readings'
                            type='text'
                            name='rangeName'
                            value={newRegisterReadInfo.rangeName}
                            onChange={handleRegisterReadInfoChange}
                            className='p-2 border rounded w-full'
                          />
                        </FormField>

                        <FormField label='Starting Register' required>
                          <input
                            placeholder='Start Address'
                            type='number'
                            name='startRegister'
                            value={newRegisterReadInfo.startRegister}
                            onChange={handleRegisterReadInfoChange}
                            className='p-2 border rounded w-full'
                          />
                        </FormField>

                        <FormField
                          label='Length (Number of Registers)'
                          required
                        >
                          <input
                            placeholder='How many registers to read'
                            type='number'
                            name='length'
                            value={newRegisterReadInfo.length}
                            onChange={handleRegisterReadInfoChange}
                            className='p-2 border rounded w-full'
                          />
                        </FormField>

                        <FormField label='Function Code' required>
                          <FunctionCodeSelector
                            value={newRegisterReadInfo.functionCode.toString()}
                            onChange={(value) =>
                              setNewRegisterReadInfo({
                                ...newRegisterReadInfo,
                                functionCode: parseInt(value),
                              })
                            }
                          />
                        </FormField>
                      </div>

                      <button
                        onClick={handleAddRegisterRange}
                        className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-3'
                      >
                        <Plus size={16} /> Add Register Range
                      </button>
                    </FormSection>

                    {/* Register Ranges List */}
                    <RegisterRangeTable
                      registerRanges={registerRanges}
                      currentEditingRange={currentEditingRange}
                      onSelectRange={setCurrentEditingRange}
                      onDeleteRange={handleDeleteRegisterRange}
                    />

                    {/* Parameter Configuration Section */}
                    {currentEditingRange && (
                      <ParameterConfigForm
                        currentEditingRange={currentEditingRange}
                        newParameterConfig={newParameterConfig}
                        onParameterChange={handleParameterConfigChange}
                        onAddParameter={handleAddParameterConfig}
                      />
                    )}

                    {/* Parameter List */}
                    {currentEditingRange &&
                      getCurrentRange() &&
                      getCurrentRange()!.parsingInfo.length > 0 && (
                        <ParameterTable
                          currentEditingRange={currentEditingRange}
                          parameters={getCurrentRange()!.parsingInfo}
                          onDeleteParameter={handleDeleteParameterConfig}
                        />
                      )}
                  </div>
                </Tabs.Content>

                {/* Data Reader Tab */}
                <Tabs.Content value='data'>
                  <div>
                    <div className='bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4'>
                      <h3 className='font-medium'>Data Reader</h3>
                      <p className='text-sm mt-1'>
                        You'll be able to test reading data from this device
                        after it's created. First, complete the device setup and
                        save it.
                      </p>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>

            <div className='flex justify-end p-4 border-t gap-2'>
              <button
                onClick={onClose}
                className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2'
              >
                <Save size={16} />
                Add Device
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewDeviceForm;
