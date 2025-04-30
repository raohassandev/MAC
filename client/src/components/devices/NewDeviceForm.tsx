import {
  Activity,
  FileText,
  List,
  Plus,
  Save,
  Settings,
  X,
  AlertCircle,
  Trash,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DeviceRegister {
  name: string;
  address: number;
  length: number;
  functionCode: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

interface DeviceTemplate {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  registers: DeviceRegister[];
}

interface NewDeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: any) => void;
}

const NewDeviceForm: React.FC<NewDeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [tab, setTab] = useState<
    'connection' | 'registers' | 'template' | 'data'
  >('connection');
  const [connectionType, setConnectionType] = useState<'tcp' | 'rtu'>('tcp');
  const [registers, setRegisters] = useState<DeviceRegister[]>([]);
  const [newRegister, setNewRegister] = useState<DeviceRegister>({
    name: '',
    address: 0,
    length: 1,
    functionCode: 3,
    scaleFactor: 1,
    decimalPoint: 0,
    byteOrder: 'AB CD',
    unit: '',
  });
  const [templateMode, setTemplateMode] = useState<'select' | 'create'>('select');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templates, setTemplates] = useState<DeviceTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        // This would be an API call in a real app
        // const response = await fetch('/api/device-templates');
        // const data = await response.json();
        // setTemplates(data);
        
        // For demo purposes, use mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTemplates([
          {
            id: '1',
            name: 'Energy Analyzer',
            description: 'Standard template for energy analyzers with voltage, current, and power readings',
            deviceType: 'Energy Analyzer',
            registers: [
              { name: 'Voltage L1', address: 0, length: 1, functionCode: 3, unit: 'V' },
              { name: 'Current L1', address: 1, length: 1, functionCode: 3, unit: 'A' },
              { name: 'Active Power', address: 2, length: 1, functionCode: 3, unit: 'W' },
            ],
          },
          {
            id: '2',
            name: 'Temperature Controller',
            description: 'Template for temperature controllers with setpoint and measurement',
            deviceType: 'Temperature Controller',
            registers: [
              { name: 'Current Temperature', address: 0, length: 1, functionCode: 3, unit: '°C' },
              { name: 'Setpoint', address: 1, length: 1, functionCode: 3, unit: '°C' },
              { name: 'Status', address: 2, length: 1, functionCode: 1, unit: '' },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value);

    setDeviceData({
      ...deviceData,
      [name]: newValue,
    });
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === 'name' || name === 'unit' 
      ? value 
      : parseInt(value);
    
    setNewRegister({
      ...newRegister,
      [name]: newValue,
    });
  };
  
  const handleAddRegister = () => {
    if (!newRegister.name || newRegister.address < 0) {
      setError('Please fill out all required register fields');
      return;
    }

    setRegisters([...registers, { ...newRegister }]);
    setNewRegister({
      name: '',
      address: 0,
      length: 1,
      functionCode: 3,
      scaleFactor: 1,
      decimalPoint: 0,
      byteOrder: 'AB CD',
      unit: '',
    });
    setError(null);
  };
  
  const handleDeleteRegister = (index: number) => {
    setRegisters(registers.filter((_, i) => i !== index));
  };
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    // Find the selected template
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Set the registers from the template
      setRegisters([...template.registers]);
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
    } else { // rtu
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
      registers,
    };
    
    onSubmit(deviceForSubmission);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-xl font-semibold'>Add New Modbus Device</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
            aria-label="Close"
          >
            <X size={20} />
          </button>
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
                  <span className='text-sm text-gray-700'>Device Enabled</span>
                </label>
              </div>
            </div>
          </div>

          <div className='border-b border-gray-200 mb-4'>
            <nav className='flex space-x-4'>
              <button
                onClick={() => setTab('connection')}
                className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                  ${
                    tab === 'connection'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Settings size={16} />
                Connection
              </button>
              <button
                onClick={() => setTab('registers')}
                className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                  ${
                    tab === 'registers'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <List size={16} />
                Registers
              </button>
              <button
                onClick={() => setTab('template')}
                className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                  ${
                    tab === 'template'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <FileText size={16} />
                Template
              </button>
              <button
                onClick={() => setTab('data')}
                className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
                  ${
                    tab === 'data'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Activity size={16} />
                Data Reader
              </button>
            </nav>
          </div>

          {tab === 'connection' && (
            <div className='space-y-4'>
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
            </div>
          )}

          {tab === 'registers' && (
            <div>
              <h2 className='text-lg font-semibold mb-4'>Register Configuration</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Register Name
                  </label>
                  <input
                    placeholder='e.g., Temperature'
                    type='text'
                    name='name'
                    value={newRegister.name}
                    onChange={handleRegisterInputChange}
                    className='p-2 border rounded w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Address
                  </label>
                  <input
                    placeholder='Start Address'
                    type='number'
                    name='address'
                    value={newRegister.address}
                    onChange={handleRegisterInputChange}
                    className='p-2 border rounded w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Length
                  </label>
                  <input
                    placeholder='Length'
                    type='number'
                    name='length'
                    value={newRegister.length}
                    onChange={handleRegisterInputChange}
                    className='p-2 border rounded w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Function Code
                  </label>
                  <select
                    name='functionCode'
                    value={newRegister.functionCode}
                    onChange={handleRegisterInputChange}
                    className='p-2 border rounded w-full'
                  >
                    <option value={1}>1 - Read Coils</option>
                    <option value={2}>2 - Read Discrete Inputs</option>
                    <option value={3}>3 - Read Holding Registers</option>
                    <option value={4}>4 - Read Input Registers</option>
                    <option value={5}>5 - Write Single Coil</option>
                    <option value={6}>6 - Write Single Register</option>
                    <option value={16}>16 - Write Multiple Registers</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Unit
                  </label>
                  <input
                    placeholder='e.g., °C, V, A'
                    type='text'
                    name='unit'
                    value={newRegister.unit}
                    onChange={handleRegisterInputChange}
                    className='p-2 border rounded w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Scale Factor
                  </label>
                  <input
                    placeholder='e.g., 10, 100'
                    type='number'
                    name='scaleFactor'
                    value={newRegister.scaleFactor}
                    onChange={handleRegisterInputChange}
                    className='p-2 border rounded w-full'
                  />
                </div>
              </div>
              <button
                onClick={handleAddRegister}
                className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4'
              >
                <Plus size={16} /> Add Register
              </button>

              {registers.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Name
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Address
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Length
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Function Code
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Unit
                        </th>
                        <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {registers.map((register, index) => (
                        <tr key={index}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.functionCode}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {register.unit || '-'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                            <button
                              onClick={() => handleDeleteRegister(index)}
                              className='text-red-600 hover:text-red-900'
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
                <div className='bg-gray-50 p-4 rounded'>
                  <p className='text-center text-gray-500'>No registers added yet. Add registers for this device above.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'template' && (
            <div>
              <div className='flex items-center gap-4 mb-4'>
                <label className='text-sm font-medium text-gray-700'>
                  Mode:
                </label>
                <div className='flex'>
                  <button
                    type='button'
                    onClick={() => setTemplateMode('select')}
                    className={`px-3 py-1 border ${
                      templateMode === 'select'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    } rounded-l-md`}
                  >
                    Use Existing Template
                  </button>
                  <button
                    type='button'
                    onClick={() => setTemplateMode('create')}
                    className={`px-3 py-1 border ${
                      templateMode === 'create'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    } rounded-r-md`}
                  >
                    Save As New Template
                  </button>
                </div>
              </div>

              {templateMode === 'select' ? (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Select Device Template
                  </label>
                  {loading ? (
                    <div className='text-center py-4'>
                      <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
                      <p className='mt-2 text-sm text-gray-500'>Loading templates...</p>
                    </div>
                  ) : templates.length > 0 ? (
                    <div className='space-y-4'>
                      <select
                        className='p-2 border rounded w-full mb-4'
                        value={selectedTemplateId}
                        onChange={(e) => handleSelectTemplate(e.target.value)}
                      >
                        <option value=''>-- Select a template --</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} - {template.deviceType}
                          </option>
                        ))}
                      </select>
                      
                      {selectedTemplateId && (
                        <div className='bg-gray-50 p-4 rounded'>
                          <h3 className='font-medium text-gray-700 mb-2'>Template Details</h3>
                          <p className='text-sm text-gray-600 mb-2'>
                            {templates.find((t) => t.id === selectedTemplateId)?.description}
                          </p>
                          <p className='text-sm text-gray-600'>
                            This template includes {
                              templates.find((t) => t.id === selectedTemplateId)?.registers.length || 0
                            } preconfigured registers.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='bg-gray-50 p-4 rounded'>
                      <p className='text-center text-gray-500'>No templates available.</p>
                    </div>
                  )}

                  <p className='text-sm text-gray-500 mt-4'>
                    Templates provide predefined register configurations for
                    common device types. Select a template to automatically
                    configure the registers for this device.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Template Name
                      </label>
                      <input
                        placeholder='Energy Analyzer Template'
                        className='p-2 border rounded w-full'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Device Type
                      </label>
                      <input
                        placeholder='E.g., Energy Analyzer, Temperature Controller'
                        className='p-2 border rounded w-full'
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      placeholder='Describe what this template is used for'
                      className='p-2 border rounded w-full h-20 resize-none'
                    />
                  </div>
                  
                  <p className='text-sm text-gray-500'>
                    Saving as a template will save the current register configuration for future use.
                    This makes it easy to create multiple devices of the same type.
                  </p>
                  
                  <div className='pt-2'>
                    <button
                      type='button'
                      className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2'
                    >
                      <Save size={16} />
                      Save Template
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'data' && (
            <div>
              <div className='bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4'>
                <h3 className='font-medium'>Data Reader</h3>
                <p className='text-sm mt-1'>
                  You'll be able to test reading data from this device after
                  it's created. First, complete the device setup and save it.
                </p>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default NewDeviceForm;