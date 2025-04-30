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
// import * as Table from '@radix-ui/themes/table';
import { Button, Table } from '@radix-ui/themes';

// Register range interface
interface RegisterRange {
  rangeName: string;
  startRegister: number;
  length: number;
  functionCode: number;
}

// Parameter configuration interface
interface ParameterConfig {
  name: string;
  dataType: string;
  scalingFactor: number;
  decimalPoint: number;
  byteOrder: string;
  registerRange: string;
  registerIndex: number;
}

// Device template interface
interface DeviceTemplate {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  registerRanges: RegisterRange[];
  parameterConfigs?: ParameterConfig[];
}

interface NewDeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: any | unknown) => void; //TODO: fix the data type
}

const NewDeviceForm: React.FC<NewDeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('connection');

  // Connection type state
  const [connectionType, setConnectionType] = useState<'tcp' | 'rtu'>('tcp');

  // Register ranges state
  const [registerRanges, setRegisterRanges] = useState<RegisterRange[]>([]);
  const [newRegisterRange, setNewRegisterRange] = useState<RegisterRange>({
    rangeName: '',
    startRegister: 0,
    length: 1,
    functionCode: 3,
  });

  // Parameter configuration state
  const [parameterConfigs, setParameterConfigs] = useState<ParameterConfig[]>(
    []
  );
  const [newParameterConfig, setNewParameterConfig] = useState<ParameterConfig>(
    {
      name: '',
      dataType: 'uint16',
      scalingFactor: 1,
      decimalPoint: 0,
      byteOrder: 'AB',
      registerRange: '',
      registerIndex: 0,
    }
  );

  // Calculate total number of registers from all ranges
  const totalRegistersCount = registerRanges.reduce(
    (sum, range) => sum + range.length,
    0
  );

  // Template state
  const [templateMode, setTemplateMode] = useState<'select' | 'create'>(
    'select'
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templates, setTemplates] = useState<DeviceTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');

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
        // Sample data for demonstration
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
                rangeName: 'Voltage Readings',
                startRegister: 0,
                length: 3,
                functionCode: 3,
              },
              {
                rangeName: 'Current Readings',
                startRegister: 100,
                length: 3,
                functionCode: 3,
              },
              {
                rangeName: 'Power Readings',
                startRegister: 200,
                length: 2,
                functionCode: 3,
              },
            ],
            parameterConfigs: [
              {
                name: 'Voltage L1',
                dataType: 'float',
                scalingFactor: 0.1,
                decimalPoint: 1,
                byteOrder: 'ABCD',
                registerRange: 'Voltage Readings',
                registerIndex: 0,
              },
              {
                name: 'Voltage L2',
                dataType: 'float',
                scalingFactor: 0.1,
                decimalPoint: 1,
                byteOrder: 'ABCD',
                registerRange: 'Voltage Readings',
                registerIndex: 1,
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
                rangeName: 'Temperature Values',
                startRegister: 0,
                length: 2,
                functionCode: 3,
              },
              {
                rangeName: 'Status Registers',
                startRegister: 100,
                length: 1,
                functionCode: 1,
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

  const handleRegisterRangeInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === 'rangeName' ? value : parseInt(value);

    setNewRegisterRange({
      ...newRegisterRange,
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

  const handleAddParameterConfig = () => {
    if (!newParameterConfig.name) {
      setError('Parameter name is required');
      return;
    }

    if (!newParameterConfig.registerRange) {
      setError('Register range is required');
      return;
    }

    setParameterConfigs([...parameterConfigs, { ...newParameterConfig }]);

    // Reset name field but keep other values for faster entry of multiple parameters
    setNewParameterConfig({
      ...newParameterConfig,
      name: '',
      registerIndex: newParameterConfig.registerIndex + 1,
    });

    setError(null);
    toast.success('Parameter configuration added');
  };

  const handleDeleteParameterConfig = (index: number) => {
    setParameterConfigs(parameterConfigs.filter((_, i) => i !== index));
    toast.info('Parameter configuration removed');
  };

  const handleAddRegisterRange = () => {
    if (!newRegisterRange.rangeName || newRegisterRange.startRegister < 0) {
      setError('Please fill out all required register range fields');
      return;
    }

    setRegisterRanges([...registerRanges, { ...newRegisterRange }]);
    setNewRegisterRange({
      rangeName: '',
      startRegister: 0,
      length: 1,
      functionCode: 3,
    });
    setError(null);
    toast.success('Register range added successfully');
  };

  const handleDeleteRegisterRange = (index: number) => {
    setRegisterRanges(registerRanges.filter((_, i) => i !== index));
    toast.info('Register range removed');
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);

    // Find the selected template
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      // Set the register ranges from the template
      setRegisterRanges([...template.registerRanges]);

      // Set the parameter configs from the template if they exist
      if (template.parameterConfigs) {
        setParameterConfigs([...template.parameterConfigs]);
      } else {
        setParameterConfigs([]);
      }

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

    // Prepare the device data for submission
    const deviceForSubmission = {
      ...deviceData,
      port: parseInt(deviceData.port),
      slaveId: parseInt(deviceData.slaveId),
      baudRate: parseInt(deviceData.baudRate),
      dataBits: parseInt(deviceData.dataBits),
      stopBits: parseInt(deviceData.stopBits),
      connectionType,
      registerRanges,
      parameterConfigs,
    };

    onSubmit(deviceForSubmission);
    toast.success('Device added successfully');
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

            {error && (
              <div className='mx-4 mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded'>
                <div className='flex items-center'>
                  <AlertCircle size={20} className='text-red-500 mr-2' />
                  <span className='text-red-700'>{error}</span>
                </div>
              </div>
            )}

            <div className='p-4'>
              <div className='mb-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Device Name *
                    </label>
                    <input
                      placeholder='Enter device name'
                      name='name'
                      value={deviceData.name}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Make/Manufacturer
                    </label>
                    <input
                      placeholder='E.g., Schneider, ABB'
                      name='make'
                      value={deviceData.make}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Model
                    </label>
                    <input
                      placeholder='Device model'
                      name='model'
                      value={deviceData.model}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      placeholder='Brief description'
                      name='description'
                      value={deviceData.description}
                      onChange={handleInputChange}
                      className='p-2 border rounded w-full h-20 resize-none'
                    />
                  </div>
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
                    Registers
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value='template'
                    className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                      ${
                        activeTab === 'template'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <FileText size={16} />
                    Template
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
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          IP Address *
                        </label>
                        <input
                          placeholder='192.168.1.100'
                          type='text'
                          name='ip'
                          value={deviceData.ip}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Port *
                        </label>
                        <input
                          placeholder='502'
                          type='number'
                          name='port'
                          value={deviceData.port}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Slave ID *
                        </label>
                        <input
                          placeholder='1'
                          type='number'
                          name='slaveId'
                          value={deviceData.slaveId}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Serial Port *
                        </label>
                        <input
                          placeholder='COM1, /dev/ttyS0'
                          type='text'
                          name='serialPort'
                          value={deviceData.serialPort}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Baud Rate
                        </label>
                        <input
                          placeholder='9600'
                          type='number'
                          name='baudRate'
                          value={deviceData.baudRate}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Data Bits
                        </label>
                        <input
                          placeholder='8'
                          type='number'
                          name='dataBits'
                          value={deviceData.dataBits}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Stop Bits
                        </label>
                        <input
                          placeholder='1'
                          type='number'
                          name='stopBits'
                          value={deviceData.stopBits}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Parity
                        </label>
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
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Slave ID *
                        </label>
                        <input
                          placeholder='1'
                          type='number'
                          name='slaveId'
                          value={deviceData.slaveId}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded'
                          required
                        />
                      </div>
                    </div>
                  )}
                </Tabs.Content>

                <Tabs.Content value='registers'>
                  <div>
                    <h2 className='text-lg font-semibold mb-4'>
                      Register Mapping Configuration
                    </h2>

                    <div className='bg-blue-50 p-3 rounded-md mb-4'>
                      <p className='text-sm text-blue-700'>
                        Configure register ranges to read from your Modbus
                        device. Each range represents a continuous block of
                        registers.
                      </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Range Name *
                        </label>
                        <input
                          placeholder='e.g., Voltage Readings'
                          type='text'
                          name='rangeName'
                          value={newRegisterRange.rangeName}
                          onChange={handleRegisterRangeInputChange}
                          className='p-2 border rounded w-full'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Starting Register *
                        </label>
                        <input
                          placeholder='Start Address'
                          type='number'
                          name='startRegister'
                          value={newRegisterRange.startRegister}
                          onChange={handleRegisterRangeInputChange}
                          className='p-2 border rounded w-full'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Length (Number of Registers) *
                        </label>
                        <input
                          placeholder='How many registers to read'
                          type='number'
                          name='length'
                          value={newRegisterRange.length}
                          onChange={handleRegisterRangeInputChange}
                          className='p-2 border rounded w-full'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Function Code *
                        </label>
                        <Select.Root
                          name='functionCode'
                          value={newRegisterRange.functionCode.toString()}
                          onValueChange={(value) =>
                            setNewRegisterRange({
                              ...newRegisterRange,
                              functionCode: parseInt(value),
                            })
                          }
                        >
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
                                  <Select.Item
                                    value='1'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      1 - Read Coils
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='2'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      2 - Read Discrete Inputs
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='3'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      3 - Read Holding Registers
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='4'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      4 - Read Input Registers
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='5'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      5 - Write Single Coil
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='6'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      6 - Write Single Register
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='15'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      15 - Write Multiple Coils
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='16'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      16 - Write Multiple Registers
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='22'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      22 - Mask Write Register
                                    </Select.ItemText>
                                  </Select.Item>
                                  <Select.Item
                                    value='23'
                                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                                  >
                                    <Select.ItemText>
                                      23 - Read/Write Multiple Registers
                                    </Select.ItemText>
                                  </Select.Item>
                                </Select.Group>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                    </div>

                    <button
                      onClick={handleAddRegisterRange}
                      className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6'
                    >
                      <Plus size={16} /> Add Register Range
                    </button>

                    {registerRanges.length > 0 ? (
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
                              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                            {registerRanges.map((range, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }
                              >
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                  {range.rangeName}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                  {range.startRegister}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                  {range.length}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                  {range.functionCode === 1 && '1 - Read Coils'}
                                  {range.functionCode === 2 &&
                                    '2 - Read Discrete Inputs'}
                                  {range.functionCode === 3 &&
                                    '3 - Read Holding Registers'}
                                  {range.functionCode === 4 &&
                                    '4 - Read Input Registers'}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                  <button
                                    onClick={() =>
                                      handleDeleteRegisterRange(index)
                                    }
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
                    ) : (
                      <div className='bg-gray-50 p-6 rounded text-center'>
                        <Server
                          size={24}
                          className='mx-auto text-gray-400 mb-2'
                        />
                        <p className='text-gray-500'>
                          No register ranges added yet. Add a register range for
                          this device above.
                        </p>
                        <p className='text-gray-400 text-sm mt-1'>
                          Each Modbus device has different register mappings.
                          Check your device manual for details.
                        </p>
                      </div>
                    )}
                  </div>
                </Tabs.Content>

                <Tabs.Content value='template'>
                  <div>
                    <h2 className='text-lg font-semibold mb-2'>
                      Parameter Configuration
                    </h2>

                    <div className='bg-blue-50 p-3 rounded-md mb-4'>
                      <p className='text-sm text-blue-700'>
                        Configure how to parse data for each register. The
                        number of parameters should match the total number of
                        registers ({totalRegistersCount}).
                      </p>
                    </div>

                    {/* Add New Parameter Form */}
                    <div className='mb-6 border rounded-lg p-4 bg-gray-50'>
                      <h4 className='font-medium text-gray-800 mb-3'>
                        Add New Parameter
                      </h4>

                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Parameter Name *
                          </label>
                          <input
                            type='text'
                            value={newParameterConfig.name}
                            onChange={(e) =>
                              handleParameterConfigChange(
                                'name',
                                e.target.value
                              )
                            }
                            className='p-1.5 border rounded w-full text-sm'
                            placeholder='Parameter name'
                            required
                          />
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Data Type *
                          </label>
                          {/* <Select.Root
                            value={newParameterConfig.dataType}
                            onValueChange={(value) =>
                              handleParameterConfigChange('dataType', value)
                            }
                          >
                            <Select.Trigger className='w-full flex items-center justify-between p-1.5 border rounded bg-white text-sm'>
                              <Select.Value />
                              <Select.Icon>
                                <ChevronDown size={14} />
                              </Select.Icon>
                            </Select.Trigger>

                            <Select.Portal>
                              <Select.Content className='bg-white border rounded shadow-lg'>
                                <Select.Viewport className='p-1'>
                                  <Select.Group>
                                    <Select.Item
                                      value='int16'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Int16 (1 register)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='uint16'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        UInt16 (1 register)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='int32'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Int32 (2 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='uint32'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        UInt32 (2 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='float'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Float (2 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='double'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Double (4 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='boolean'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Boolean (bits)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='string'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        String (multiple registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                  </Select.Group>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root> */}
                          <Select.Root
                            value={newParameterConfig.dataType}
                            onValueChange={(value) =>
                              handleParameterConfigChange('dataType', value)
                            }
                          >
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
                                    <Select.Item
                                      value='INT-16'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Int16 (1 register)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='UINT-16'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        UInt16 (1 register)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='INT-32'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Int32 (2 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='UINT-32'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        UInt32 (2 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='FLOAT'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Float (2 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='DOUBLE'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Double (4 registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='BOOLEAN'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        Boolean (bit)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='STRING'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        String (multiple registers)
                                      </Select.ItemText>
                                    </Select.Item>
                                  </Select.Group>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Scaling Factor
                          </label>
                          <input
                            type='number'
                            value={newParameterConfig.scalingFactor}
                            onChange={(e) =>
                              handleParameterConfigChange(
                                'scalingFactor',
                                parseFloat(e.target.value) || 1
                              )
                            }
                            className='p-1.5 border rounded w-full text-sm'
                            placeholder='1.0'
                            step='0.01'
                          />
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Decimal Point
                          </label>
                          <input
                            type='number'
                            value={newParameterConfig.decimalPoint}
                            onChange={(e) =>
                              handleParameterConfigChange(
                                'decimalPoint',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className='p-1.5 border rounded w-full text-sm'
                            min='0'
                            max='10'
                          />
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Byte Order
                          </label>
                          <Select.Root
                            value={newParameterConfig.byteOrder}
                            onValueChange={(value) =>
                              handleParameterConfigChange('byteOrder', value)
                            }
                          >
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
                                    <Select.Item
                                      value='AB'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        AB (big-endian)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='BA'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        BA (little-endian)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='ABCD'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        ABCD (big-endian, 32-bit)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='CDAB'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        CDAB (little-endian word swap)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='BADC'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        BADC (byte swap)
                                      </Select.ItemText>
                                    </Select.Item>
                                    <Select.Item
                                      value='DCBA'
                                      className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                    >
                                      <Select.ItemText>
                                        DCBA (little-endian, 32-bit)
                                      </Select.ItemText>
                                    </Select.Item>
                                  </Select.Group>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Register Range
                          </label>
                          <Select.Root
                            value={newParameterConfig.registerRange}
                            onValueChange={(value) =>
                              handleParameterConfigChange(
                                'registerRange',
                                value
                              )
                            }
                          >
                            <Select.Trigger className='w-full flex items-center justify-between p-1.5 border rounded bg-white text-sm'>
                              <Select.Value placeholder='Select range' />
                              <Select.Icon>
                                <ChevronDown size={14} />
                              </Select.Icon>
                            </Select.Trigger>

                            <Select.Portal>
                              <Select.Content className='bg-white border rounded shadow-lg'>
                                <Select.Viewport className='p-1'>
                                  <Select.Group>
                                    {registerRanges.map((range, idx) => (
                                      <Select.Item
                                        key={idx}
                                        value={range.rangeName}
                                        className='flex items-center p-1.5 cursor-pointer hover:bg-blue-50 rounded outline-none text-sm'
                                      >
                                        <Select.ItemText>
                                          {range.rangeName}
                                        </Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Group>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </div>

                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-1'>
                            Register Index
                          </label>
                          <input
                            type='number'
                            value={newParameterConfig.registerIndex}
                            onChange={(e) =>
                              handleParameterConfigChange(
                                'registerIndex',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className='p-1.5 border rounded w-full text-sm'
                            min='0'
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleAddParameterConfig}
                        className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                      >
                        <Plus size={16} /> Add Parameter
                      </button>
                    </div>

                    {/* Parameter Configuration Table */}
                    {registerRanges.length === 0 ? (
                      <div className='bg-yellow-50 p-4 rounded-lg'>
                        <p className='text-yellow-700 text-sm'>
                          You need to define register ranges in the "Registers"
                          tab before configuring parameters.
                        </p>
                      </div>
                    ) : parameterConfigs.length > 0 ? (
                      <div className='mt-4'>
                        <Table.Root variant='surface' size='2'>
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeaderCell>
                                Parameter Name
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Data Type
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Scaling Factor
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Decimal Point
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Byte Order
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Register Range
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Register Index
                              </Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>
                                Actions
                              </Table.ColumnHeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {parameterConfigs.map((config, index) => (
                              <Table.Row key={index}>
                                <Table.Cell>{config.name}</Table.Cell>
                                <Table.Cell>{config.dataType}</Table.Cell>
                                <Table.Cell>{config.scalingFactor}</Table.Cell>
                                <Table.Cell>{config.decimalPoint}</Table.Cell>
                                <Table.Cell>{config.byteOrder}</Table.Cell>
                                <Table.Cell>{config.registerRange}</Table.Cell>
                                <Table.Cell>{config.registerIndex}</Table.Cell>
                                <Table.Cell>
                                  <Button
                                    color='red'
                                    variant='soft'
                                    size='1'
                                    onClick={() =>
                                      handleDeleteParameterConfig(index)
                                    }
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </div>
                    ) : (
                      <div className='bg-gray-50 p-6 rounded text-center'>
                        <FileText
                          size={24}
                          className='mx-auto text-gray-400 mb-2'
                        />
                        <p className='text-gray-500'>
                          No parameter configurations added yet. Add parameters
                          using the form above.
                        </p>
                      </div>
                    )}
                  </div>
                </Tabs.Content>

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
