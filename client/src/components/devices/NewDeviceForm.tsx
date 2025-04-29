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
    const { name, value } = e.target;
    setDeviceData({
      ...deviceData,
      [name]: value,
    });
  };

  const handleAddRegister = () => {
    setRegisters([...registers, newRegister]);
    setNewRegister({ startAddress: '', length: '', functionCode: '' });
  };

  const handleSubmit = () => {
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
              <input
                placeholder='Device Name'
                name='name'
                value={deviceData.name}
                onChange={handleInputChange}
                className='p-2 border rounded w-full'
              />
              <input
                placeholder='Make'
                name='make'
                value={deviceData.make}
                onChange={handleInputChange}
                className='p-2 border rounded w-full'
              />
              <input
                placeholder='Model'
                name='model'
                value={deviceData.model}
                onChange={handleInputChange}
                className='p-2 border rounded w-full'
              />
              <input
                placeholder='Description'
                name='description'
                value={deviceData.description}
                onChange={handleInputChange}
                className='p-2 border rounded w-full'
              />
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
                  <input
                    placeholder='IP Address'
                    type='text'
                    name='ip'
                    value={deviceData.ip}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                  <input
                    placeholder='Port'
                    type='number'
                    name='port'
                    value={deviceData.port}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                  <input
                    placeholder='Slave ID'
                    type='number'
                    name='slaveId'
                    value={deviceData.slaveId}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    placeholder='Serial Port'
                    type='text'
                    name='serialPort'
                    value={deviceData.serialPort}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                  <input
                    placeholder='Baud Rate'
                    type='number'
                    name='baudRate'
                    value={deviceData.baudRate}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                  <input
                    placeholder='Data Bits'
                    type='number'
                    name='dataBits'
                    value={deviceData.dataBits}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                  <input
                    placeholder='Stop Bits'
                    type='number'
                    name='stopBits'
                    value={deviceData.stopBits}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                  <select
                    className='w-full p-2 border rounded'
                    name='parity'
                    value={deviceData.parity}
                    onChange={handleInputChange}
                  >
                    <option value='none'>Parity: None</option>
                    <option value='even'>Parity: Even</option>
                    <option value='odd'>Parity: Odd</option>
                  </select>
                  <input
                    placeholder='Slave ID'
                    type='number'
                    name='slaveId'
                    value={deviceData.slaveId}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded'
                  />
                </div>
              )}
            </div>
          )}

          {tab === 'registers' && (
            <div>
              <h2 className='text-lg font-semibold mb-4'>Register Ranges</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
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
                  className='p-2 border rounded'
                />
                <input
                  placeholder='Length'
                  type='number'
                  value={newRegister.length}
                  onChange={(e) =>
                    setNewRegister({ ...newRegister, length: e.target.value })
                  }
                  className='p-2 border rounded'
                />
                <select
                  value={newRegister.functionCode}
                  onChange={(e) =>
                    setNewRegister({
                      ...newRegister,
                      functionCode: e.target.value,
                    })
                  }
                  className='p-2 border rounded'
                >
                  <option value=''>Function Code</option>
                  <option value='1'>1 - Coil</option>
                  <option value='2'>2 - Discrete Input</option>
                  <option value='3'>3 - Holding</option>
                  <option value='4'>4 - Input</option>
                  <option value='5'>5 - Write Single Coil</option>
                  <option value='6'>6 - Write Single Register</option>
                  <option value='16'>16 - Write Multiple</option>
                </select>
              </div>
              <button
                onClick={handleAddRegister}
                className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded'
              >
                <Plus size={16} /> Add Range
              </button>
              <ul className='mt-4 list-disc list-inside text-sm'>
                {registers.map((r, idx) => (
                  <li key={idx}>
                    Start: {r.startAddress}, Length: {r.length}, FC:{' '}
                    {r.functionCode}
                  </li>
                ))}
              </ul>
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
                <select className='p-2 border rounded w-full mb-4'>
                  <option>Select Template</option>
                  <option>Energy Analyzer</option>
                  <option>Temperature Sensor</option>
                </select>
              ) : (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <input
                      placeholder='Name'
                      className='p-2 border rounded w-full'
                    />
                    <input
                      placeholder='Register Index'
                      type='number'
                      className='p-2 border rounded w-full'
                    />
                    <select className='p-2 border rounded w-full'>
                      <option>Data Type</option>
                      <option value='int16'>int16</option>
                      <option value='uint16'>uint16</option>
                      <option value='int32'>int32</option>
                      <option value='uint32'>uint32</option>
                      <option value='float32'>float32</option>
                      <option value='float64'>float64</option>
                    </select>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <input
                      placeholder='Scale Factor'
                      type='number'
                      className='p-2 border rounded w-full'
                    />
                    <input
                      placeholder='Unit'
                      className='p-2 border rounded w-full'
                    />
                    <select className='p-2 border rounded w-full'>
                      <option>Byte Order</option>
                      <option value='AB'>AB</option>
                      <option value='BA'>BA</option>
                      <option value='ABCD'>ABCD</option>
                      <option value='CDAB'>CDAB</option>
                      <option value='BADC'>BADC</option>
                      <option value='DCBA'>DCBA</option>
                    </select>
                  </div>
                  <button className='bg-green-600 text-white px-4 py-2 rounded'>
                    Save Template
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'data' && (
            <div>
              <button className='bg-blue-600 text-white px-4 py-2 rounded mb-4'>
                Read Data
              </button>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Example output */}
                <div className='bg-white border rounded p-4 shadow'>
                  <p className='font-semibold'>Voltage L1</p>
                  <p className='text-gray-600'>230.1 V</p>
                </div>
                <div className='bg-white border rounded p-4 shadow'>
                  <p className='font-semibold'>Current L1</p>
                  <p className='text-gray-600'>4.2 A</p>
                </div>
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
