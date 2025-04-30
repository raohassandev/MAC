import {
  Activity,
  FileText,
  HardDrive,
  List,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

const TabHeader = ({ tab, current, setTab, icon, label }: any) => (
  <button
    onClick={() => setTab(tab)}
    className={`py-2 px-4 border-b-2 flex items-center gap-2 text-sm font-medium
      ${
        current === tab
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
  >
    {icon}
    {label}
  </button>
);

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
  const [registers, setRegisters] = useState<any[]>([]);
  const [newRegister, setNewRegister] = useState({
    startAddress: '',
    length: '',
    functionCode: '',
  });
  const [templateMode, setTemplateMode] = useState<'select' | 'create'>(
    'select'
  );
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
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setDeviceData({
      ...deviceData,
      [name]: newValue,
    });
  };

  const handleAddRegister = () => {
    if (
      !newRegister.startAddress ||
      !newRegister.length ||
      !newRegister.functionCode
    ) {
      alert('Please fill in all register fields');
      return;
    }

    setRegisters([...registers, newRegister]);
    setNewRegister({ startAddress: '', length: '', functionCode: '' });
  };

  const handleSubmit = () => {
    if (
      !deviceData.name ||
      !deviceData.ip ||
      !deviceData.port ||
      !deviceData.slaveId
    ) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      ...deviceData,
      connectionType,
      registers: registers.map((r) => ({
        address: parseInt(r.startAddress),
        length: parseInt(r.length),
        functionCode: parseInt(r.functionCode),
        type: getFunctionCodeType(r.functionCode),
        name: `Register ${r.startAddress}`,
      })),
    });
  };

  const getFunctionCodeType = (fc: string) => {
    switch (fc) {
      case '1':
      case '5':
        return 'coil';
      case '2':
        return 'discrete';
      case '3':
      case '6':
      case '16':
        return 'holding';
      case '4':
        return 'input';
      default:
        return 'holding';
    }
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
          >
            <X size={20} />
          </button>
        </div>

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
                <input
                  placeholder='Brief description'
                  name='description'
                  value={deviceData.description}
                  onChange={handleInputChange}
                  className='p-2 border rounded w-full'
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

          <div className='border-b border-gray-200 mb-4 flex space-x-4'>
            <TabHeader
              tab='connection'
              current={tab}
              setTab={setTab}
              icon={<Settings size={16} />}
              label='Connection'
            />
            <TabHeader
              tab='registers'
              current={tab}
              setTab={setTab}
              icon={<List size={16} />}
              label='Registers'
            />
            <TabHeader
              tab='template'
              current={tab}
              setTab={setTab}
              icon={<FileText size={16} />}
              label='Template'
            />
            <TabHeader
              tab='data'
              current={tab}
              setTab={setTab}
              icon={<Activity size={16} />}
              label='Data Reader'
            />
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
                      required={connectionType === 'rtu'}
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
              <h2 className='text-lg font-semibold mb-4'>Register Ranges</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Start Address
                  </label>
                  <input
                    placeholder='Start Address'
                    type='number'
                    value={newRegister.startAddress}
                    onChange={(e) =>
                      setNewRegister({
                        ...newRegister,
                        startAddress: e.target.value,
                      })
                    }
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
                    value={newRegister.length}
                    onChange={(e) =>
                      setNewRegister({ ...newRegister, length: e.target.value })
                    }
                    className='p-2 border rounded w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Function Code
                  </label>
                  <select
                    value={newRegister.functionCode}
                    onChange={(e) =>
                      setNewRegister({
                        ...newRegister,
                        functionCode: e.target.value,
                      })
                    }
                    className='p-2 border rounded w-full'
                  >
                    <option value=''>Select Function Code</option>
                    <option value='1'>1 - Read Coils</option>
                    <option value='2'>2 - Read Discrete Inputs</option>
                    <option value='3'>3 - Read Holding Registers</option>
                    <option value='4'>4 - Read Input Registers</option>
                    <option value='5'>5 - Write Single Coil</option>
                    <option value='6'>6 - Write Single Register</option>
                    <option value='16'>16 - Write Multiple Registers</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddRegister}
                className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded'
              >
                <Plus size={16} /> Add Range
              </button>

              {registers.length > 0 && (
                <div className='mt-4'>
                  <h3 className='text-sm font-medium mb-2'>Added Registers:</h3>
                  <div className='bg-gray-50 p-3 rounded'>
                    <ul className='list-disc list-inside text-sm space-y-1'>
                      {registers.map((r, idx) => (
                        <li key={idx}>
                          Start: {r.startAddress}, Length: {r.length}, FC:{' '}
                          {r.functionCode}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                <select
                  value={templateMode}
                  onChange={(e) =>
                    setTemplateMode(e.target.value as 'select' | 'create')
                  }
                  className='p-2 border rounded'
                >
                  <option value='select'>Select Existing</option>
                  <option value='create'>Create New</option>
                </select>
              </div>

              {templateMode === 'select' ? (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Select Template
                  </label>
                  <select className='p-2 border rounded w-full mb-4'>
                    <option value=''>Select Template</option>
                    <option value='1'>Energy Analyzer</option>
                    <option value='2'>Temperature Sensor</option>
                    <option value='3'>Power Meter</option>
                    <option value='4'>Generic Modbus Device</option>
                  </select>

                  <p className='text-sm text-gray-500 mt-2'>
                    Templates provide predefined register configurations for
                    common device types. Select a template to automatically
                    configure the registers for this device.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Parameter Name
                      </label>
                      <input
                        placeholder='E.g., Voltage, Temperature'
                        className='p-2 border rounded w-full'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Register Index
                      </label>
                      <input
                        placeholder='Register number'
                        type='number'
                        className='p-2 border rounded w-full'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Data Type
                      </label>
                      <select className='p-2 border rounded w-full'>
                        <option value=''>Select Data Type</option>
                        <option value='int16'>int16</option>
                        <option value='uint16'>uint16</option>
                        <option value='int32'>int32</option>
                        <option value='uint32'>uint32</option>
                        <option value='float32'>float32</option>
                        <option value='float64'>float64</option>
                      </select>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Scale Factor
                      </label>
                      <input
                        placeholder='E.g., 10, 100'
                        type='number'
                        className='p-2 border rounded w-full'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Unit
                      </label>
                      <input
                        placeholder='E.g., V, °C, %'
                        className='p-2 border rounded w-full'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Byte Order
                      </label>
                      <select className='p-2 border rounded w-full'>
                        <option value=''>Select Byte Order</option>
                        <option value='AB'>AB</option>
                        <option value='BA'>BA</option>
                        <option value='ABCD'>ABCD</option>
                        <option value='CDAB'>CDAB</option>
                        <option value='BADC'>BADC</option>
                        <option value='DCBA'>DCBA</option>
                      </select>
                    </div>
                  </div>
                  <button className='bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2'>
                    <Plus size={16} /> Add Parameter
                  </button>
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
            className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Add Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDeviceForm;
