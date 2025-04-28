import {
  ArrowUpDown,
  Edit,
  ExternalLink,
  Filter,
  HardDrive,
  Plus,
  RefreshCw,
  Search,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import DeviceForm from '../components/devices/DeviceForm';
import { Link } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';

type SortDirection = 'asc' | 'desc';
type SortField = 'name' | 'status' | 'lastSeen';

interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers: any[];
  lastSeen?: Date;
}

const DeviceManagement = () => {
  const { devices, loading, error, refreshDevices, deleteDevice } =
    useDevices();
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'online' | 'offline'
  >('all');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle sorting click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort devices
  const filteredAndSortedDevices = devices
    ? [...devices]
        // Filter by search query
        .filter(
          (device) =>
            searchQuery === '' ||
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.ip?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        // Filter by status
        .filter((device) => {
          if (statusFilter === 'all') return true;
          return statusFilter === 'online' ? device.enabled : !device.enabled;
        })
        // Sort devices
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortDirection === 'asc'
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          }
          if (sortField === 'status') {
            if (a.enabled === b.enabled) return 0;
            if (sortDirection === 'asc') {
              return a.enabled ? -1 : 1;
            } else {
              return a.enabled ? 1 : -1;
            }
          }
          if (sortField === 'lastSeen') {
            const dateA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
            const dateB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
          }
          return 0;
        })
    : [];

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await deleteDevice(id);
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDevice(null);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Device Management</h1>
        <button
          onClick={() => {
            setEditingDevice(null);
            setShowForm(true);
          }}
          className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'
        >
          <Plus size={16} />
          Add Device
        </button>
      </div>

      {showForm && (
        <div className='bg-white rounded-lg shadow-sm p-5'>
          <DeviceForm
            editDevice={editingDevice}
            onSave={() => {
              refreshDevices();
              handleFormClose();
            }}
            onCancel={handleFormClose}
          />
        </div>
      )}

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-sm p-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='relative flex-grow'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search size={16} className='text-gray-400' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search devices...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex gap-3'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Filter size={16} className='text-gray-400' />
              </div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | 'online' | 'offline'
                  )
                }
                className='pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white'
              >
                <option value='all'>All Status</option>
                <option value='online'>Online Only</option>
                <option value='offline'>Offline Only</option>
              </select>
            </div>

            <button
              onClick={refreshDevices}
              className='flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              <RefreshCw size={16} />
              <span className='hidden sm:inline'>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {loading ? (
          <div className='animate-pulse p-8 text-center text-gray-500'>
            Loading devices...
          </div>
        ) : error ? (
          <div className='bg-red-50 text-red-600 p-4 rounded-lg'>
            Error loading devices: {error.message}
          </div>
        ) : filteredAndSortedDevices.length === 0 ? (
          <div className='text-center py-10 text-gray-500'>
            <HardDrive className='mx-auto mb-3' size={30} />
            <p className='mb-1'>No devices found</p>
            <p className='text-sm'>
              {searchQuery || statusFilter !== 'all'
                ? 'Try changing your search or filters'
                : 'Get started by adding your first device'}
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <button
                      className='flex items-center gap-1'
                      onClick={() => handleSort('name')}
                    >
                      Device Name
                      <ArrowUpDown
                        size={14}
                        className={
                          sortField === 'name'
                            ? 'text-blue-500'
                            : 'text-gray-400'
                        }
                      />
                    </button>
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Connection Info
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <button
                      className='flex items-center gap-1'
                      onClick={() => handleSort('status')}
                    >
                      Status
                      <ArrowUpDown
                        size={14}
                        className={
                          sortField === 'status'
                            ? 'text-blue-500'
                            : 'text-gray-400'
                        }
                      />
                    </button>
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <button
                      className='flex items-center gap-1'
                      onClick={() => handleSort('lastSeen')}
                    >
                      Last Seen
                      <ArrowUpDown
                        size={14}
                        className={
                          sortField === 'lastSeen'
                            ? 'text-blue-500'
                            : 'text-gray-400'
                        }
                      />
                    </button>
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredAndSortedDevices.map((device) => (
                  <tr key={device._id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div
                          className={`mr-2 flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                            device.enabled ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <div className='font-medium text-gray-800'>
                          {device.name}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-600'>
                      {device.ip ? (
                        <span>
                          {device.ip}:{device.port} (Slave ID: {device.slaveId})
                        </span>
                      ) : (
                        <span className='text-gray-400'>
                          No connection info
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
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
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-600'>
                      {device.lastSeen ? (
                        new Date(device.lastSeen).toLocaleString()
                      ) : (
                        <span className='text-gray-400'>Never</span>
                      )}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-right text-sm'>
                      <div className='flex items-center justify-end space-x-3'>
                        <Link
                          to={`/devices/${device._id}`}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => handleEdit(device)}
                          className='text-indigo-500 hover:text-indigo-700'
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(device._id)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceManagement;
