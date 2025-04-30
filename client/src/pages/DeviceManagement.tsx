import {
  Activity,
  Edit,
  FileText,
  HardDrive,
  List,
  Plus,
  Search,
  Settings,
  Trash,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import NewDeviceForm from '../components/devices/NewDeviceForm';
import { useDevices } from '../hooks/useDevices';

interface Device {
  id: string;
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  lastSeen?: string;
  connectionType?: 'tcp' | 'rtu';
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  registers?: DeviceRegister[];
  template?: string;
}

interface DeviceRegister {
  id: string;
  address: number;
  length: number;
  functionCode: number;
  name: string;
  description?: string;
  type?: 'holding' | 'input' | 'coil' | 'discrete';
}

interface Template {
  id: string;
  name: string;
  description?: string;
  parameters: TemplateParameter[];
}

interface TemplateParameter {
  id: string;
  name: string;
  registerIndex: number;
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64';
  scaleFactor?: number;
  unit?: string;
  byteOrder?: 'AB' | 'BA' | 'ABCD' | 'CDAB' | 'BADC' | 'DCBA';
}

type TabType = 'devices' | 'connection' | 'registers' | 'template' | 'data';

const DeviceManagement: React.FC = () => {
  const {
    devices,
    loading: isLoading,
    error,
    refreshDevices,
    addDevice,
  } = useDevices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    // Sample templates
    const sampleTemplates: Template[] = [
      {
        id: '1',
        name: 'Energy Analyzer',
        description: 'Template for energy analyzer devices',
        parameters: [
          {
            id: '1',
            name: 'Voltage L1',
            registerIndex: 0,
            dataType: 'float32',
            unit: 'V',
            byteOrder: 'ABCD',
          },
          // More parameters omitted for brevity
        ],
      },
      {
        id: '2',
        name: 'Temperature Sensor',
        description: 'Template for temperature monitoring devices',
        parameters: [
          {
            id: '1',
            name: 'Temperature',
            registerIndex: 0,
            dataType: 'float32',
            unit: '°C',
            byteOrder: 'ABCD',
          },
          {
            id: '2',
            name: 'Humidity',
            registerIndex: 2,
            dataType: 'float32',
            unit: '%',
            byteOrder: 'ABCD',
          },
        ],
      },
    ];

    setTemplates(sampleTemplates);
  }, []);

  const handleAddDevice = async (newDevice: any) => {
    try {
      // Convert the device data to the expected format for the API
      const deviceForAPI = {
        name: newDevice.name,
        ip: newDevice.ip,
        port: parseInt(newDevice.port),
        slaveId: parseInt(newDevice.slaveId),
        enabled: newDevice.enabled,
        registers: newDevice.registers || [],
      };

      // Call the addDevice function from the useDevices hook
      await addDevice(deviceForAPI);

      // Refresh the devices list
      await refreshDevices();

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add device:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      try {
        // In a real implementation, you would call your delete API here
        // await deleteDevice(id);

        // Refresh devices
        await refreshDevices();

        // Reset selected device if it was deleted
        if (selectedDevice && selectedDevice.id === id) {
          setSelectedDevice(null);
          setActiveTab('devices');
        }
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    }
  };

  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    setIsEditing(true);
    setActiveTab('connection');
  };

  const handleViewClick = (device: Device) => {
    setSelectedDevice(device);
    setIsEditing(false);
    setActiveTab('data');
  };

  const handleCancelEdit = () => {
    setSelectedDevice(null);
    setIsEditing(false);
    setActiveTab('devices');
  };

  const filteredDevices = devices
    ? devices.filter(
        (device) =>
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (device.ip &&
            device.ip.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Never';

    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  };

  // Utility function for tab button styling
  const tabButtonClasses = (tabName: TabType) => `
    py-4 px-1 border-b-2 font-medium text-sm flex items-center
    ${
      activeTab === tabName
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }
  `;

  // TabButton component
  const TabButton = ({
    tab,
    icon,
    label,
  }: {
    tab: TabType;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button onClick={() => setActiveTab(tab)} className={tabButtonClasses(tab)}>
      {icon}
      <span className='ml-2'>{label}</span>
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Device Management</h1>

        {activeTab === 'devices' ? (
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2'
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Add New Device
          </button>
        ) : (
          selectedDevice &&
          !isEditing && (
            <button
              className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2'
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} />
              Edit Device
            </button>
          )
        )}
      </div>

      {/* Search Box (only on devices tab) */}
      {activeTab === 'devices' && (
        <div className='bg-white shadow rounded-lg p-4 mb-6'>
          <div className='relative'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search devices...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className='border-b border-gray-200 mb-4'>
        <nav className='-mb-px flex space-x-8'>
          <TabButton
            tab='devices'
            icon={<HardDrive className='h-4 w-4' />}
            label='Devices'
          />

          {selectedDevice && (
            <>
              <TabButton
                tab='connection'
                icon={<Settings className='h-4 w-4' />}
                label='Connection'
              />
              <TabButton
                tab='registers'
                icon={<List className='h-4 w-4' />}
                label='Registers'
              />
              <TabButton
                tab='template'
                icon={<FileText className='h-4 w-4' />}
                label='Template'
              />
              <TabButton
                tab='data'
                icon={<Activity className='h-4 w-4' />}
                label='Data Reader'
              />
            </>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'devices' && (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          {isLoading ? (
            <div className='animate-pulse p-8 text-center text-gray-500'>
              <HardDrive className='mx-auto mb-4' size={32} />
              <p>Loading devices...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <HardDrive className='mx-auto mb-4' size={32} />
              <p className='mb-2'>No devices found</p>
              <p className='text-sm'>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add your first device to get started'}
              </p>
            </div>
          ) : (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Device Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Connection Info
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Last Seen
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredDevices.map((device) => (
                  <tr key={device._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div
                          className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            device.enabled ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <div className='text-sm font-medium text-gray-900'>
                          {device.name}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {device.ip
                        ? `${device.ip}:${device.port} (Slave ID: ${device.slaveId})`
                        : 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          device.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {device.enabled ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDate(device.lastSeen)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        className='text-blue-600 hover:text-blue-800 mr-3'
                        onClick={() => handleViewClick(device as any)}
                      >
                        <Activity size={16} />
                      </button>
                      <button
                        className='text-indigo-600 hover:text-indigo-900 mr-3'
                        onClick={() => handleEditClick(device as any)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className='text-red-600 hover:text-red-900'
                        onClick={() => handleDeleteDevice(device._id)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Device Form Modal */}
      {isModalOpen && (
        <NewDeviceForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddDevice}
        />
      )}
    </div>
  );
};

export default DeviceManagement;
