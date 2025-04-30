import {
  Activity,
  AlertCircle,
  Clipboard,
  Download,
  FileText,
  Filter,
  Grid,
  HardDrive,
  List,
  Map as MapIcon,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  Table,
  Tabs,
} from '../components/ui';
import { Device, DeviceRegister } from '../types/device.types';
import React, { useEffect, useState } from 'react';

import NewDeviceForm from '../components/devices/NewDeviceForm';
import { useAuth } from '../contexts/AuthContext';
import { useDevices } from '../hooks/useDevices';

type ViewMode = 'grid' | 'list' | 'map';
type DeviceTab = 'devices' | 'connection' | 'registers' | 'template' | 'data';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions?: string[];
}

const DeviceManagement: React.FC = () => {
  // Hooks
  const {
    devices,
    loading: isLoading,
    error,
    refreshDevices,
    addDevice,
    updateDevice,
    deleteDevice,
  } = useDevices();
  const { user: currentUser } = useAuth();

  // Permissions
  const userPermissions = currentUser?.permissions || [];
  const canAddDevices = userPermissions.includes('add_devices');
  const canEditDevices = userPermissions.includes('edit_devices');
  const canDeleteDevices = userPermissions.includes('delete_devices');
  const canTestDevices = userPermissions.includes('test_devices');

  // State
  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DeviceTab>('devices');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Filtered devices based on search and filters
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);

  // Apply filters when devices, search, or filters change
  useEffect(() => {
    if (!devices) return;

    applyFilters();
    extractAvailableTags();
  }, [devices, searchQuery, statusFilter, tagFilter]);

  // Extract all unique tags from devices
  const extractAvailableTags = () => {
    if (!devices) return;

    const tags = new Set<string>();
    devices.forEach((device) => {
      if (device.tags) {
        device.tags.forEach((tag) => tags.add(tag));
      }
    });

    setAvailableTags(Array.from(tags));
  };

  // Filter devices based on search query and filters
  const applyFilters = () => {
    if (!devices) return;

    let filtered = [...devices];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(query) ||
          (device.ip && device.ip.toLowerCase().includes(query)) ||
          (device.description &&
            device.description.toLowerCase().includes(query)) ||
          (device.make && device.make.toLowerCase().includes(query)) ||
          (device.model && device.model.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((device) =>
        statusFilter === 'online' ? device.enabled : !device.enabled
      );
    }

    // Apply tag filter
    if (tagFilter) {
      filtered = filtered.filter(
        (device) => device.tags && device.tags.includes(tagFilter)
      );
    }

    setFilteredDevices(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setTagFilter(null);
  };

  // Handle device selection for bulk operations
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices((prev) => {
      if (prev.includes(deviceId)) {
        return prev.filter((id) => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  };

  // Handle bulk selection of all filtered devices
  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      // Deselect all if all are selected
      setSelectedDevices([]);
    } else {
      // Select all filtered devices
      setSelectedDevices(filteredDevices.map((device) => device._id));
    }
  };

  // Handle bulk enable/disable of selected devices
  const handleBulkStatusChange = async (enable: boolean) => {
    for (const deviceId of selectedDevices) {
      const device = devices?.find((d) => d._id === deviceId);
      if (device && device.enabled !== enable) {
        await updateDevice({ ...device, enabled: enable });
      }
    }

    // Refresh devices after all updates
    await refreshDevices();
    // Clear selection
    setSelectedDevices([]);
  };

  // Handle bulk delete confirmation
  const handleBulkDelete = () => {
    if (selectedDevices.length === 0) return;

    setDeviceToDelete('bulk');
    setShowDeleteModal(true);
  };

  // Handle single device delete confirmation
  const handleDeleteDevice = (deviceId: string) => {
    setDeviceToDelete(deviceId);
    setShowDeleteModal(true);
  };

  // Handle confirmed delete
  const confirmDeleteDevice = async () => {
    try {
      if (deviceToDelete === 'bulk') {
        // Delete all selected devices
        for (const deviceId of selectedDevices) {
          await deleteDevice(deviceId);
        }
        setSelectedDevices([]);
      } else if (deviceToDelete) {
        // Delete single device
        await deleteDevice(deviceToDelete);
      }

      // Close modal and clear selection
      setShowDeleteModal(false);
      setDeviceToDelete(null);
    } catch (error) {
      console.error('Error deleting device(s):', error);
      // Error handling would be added here
    }
  };

  // Handle adding new device
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
        connectionType: newDevice.connectionType,
        serialPort: newDevice.serialPort,
        baudRate: newDevice.baudRate ? parseInt(newDevice.baudRate) : undefined,
        dataBits: newDevice.dataBits ? parseInt(newDevice.dataBits) : undefined,
        stopBits: newDevice.stopBits ? parseInt(newDevice.stopBits) : undefined,
        parity: newDevice.parity,
        make: newDevice.make,
        model: newDevice.model,
        description: newDevice.description,
        tags: newDevice.tags || [],
      };

      // Call the addDevice function
      await addDevice(deviceForAPI);

      // Refresh the devices list
      await refreshDevices();

      // Close the modal
      setIsNewDeviceModalOpen(false);
    } catch (error) {
      console.error('Failed to add device:', error);
      // Error handling would be added here
    }
  };

  // Handle view device details
  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsEditing(false);
    setActiveTab('data');
  };

  // Handle edit device
  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setIsEditing(true);
    setActiveTab('connection');
  };

  // Handle export devices to CSV
  const handleExportDevices = () => {
    if (!filteredDevices.length) return;

    // Create CSV content
    const headers = [
      'Name',
      'IP Address',
      'Port',
      'Status',
      'Slave ID',
      'Last Seen',
      'Make',
      'Model',
      'Description',
      'Tags',
    ].join(',');

    const rows = filteredDevices.map((device) =>
      [
        device.name,
        device.ip || '',
        device.port || '',
        device.enabled ? 'Enabled' : 'Disabled',
        device.slaveId,
        device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never',
        device.make || '',
        device.model || '',
        device.description ? `"${device.description.replace(/"/g, '""')}"` : '',
        device.tags ? device.tags.join(';') : '',
      ].join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `devices_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Never';

    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  };

  // Define tab content
  const tabs = [
    {
      id: 'devices',
      label: (
        <div className='flex items-center'>
          <HardDrive className='h-4 w-4 mr-2' />
          <span>Devices</span>
        </div>
      ),
      content: (
        <>
          {/* Search and Filters */}
          <Card className='mb-6'>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Search */}
              <div className='relative flex-grow'>
                <Input
                  placeholder='Search devices...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={16} />}
                  className='w-full'
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'online', label: 'Online' },
                  { value: 'offline', label: 'Offline' },
                ]}
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className='w-48'
              />

              {/* Tag Filter */}
              {availableTags.length > 0 && (
                <Select
                  options={[
                    { value: '', label: 'All Tags' },
                    ...availableTags.map((tag) => ({ value: tag, label: tag })),
                  ]}
                  value={tagFilter || ''}
                  onChange={(e) => setTagFilter(e.target.value || null)}
                  className='w-48'
                />
              )}

              {/* Reset Filters */}
              <Button
                variant='secondary'
                onClick={resetFilters}
                disabled={!searchQuery && !statusFilter && !tagFilter}
                icon={<Filter size={16} />}
              >
                Reset
              </Button>

              {/* View Mode Toggles */}
              <div className='flex border border-gray-300 rounded-md overflow-hidden'>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title='List View'
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title='Grid View'
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2 ${
                    viewMode === 'map'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title='Map View'
                >
                  <MapIcon size={16} />
                </button>
              </div>

              {/* Refresh */}
              <Button
                variant='secondary'
                onClick={refreshDevices}
                disabled={isLoading}
                icon={
                  <RefreshCw
                    size={16}
                    className={isLoading ? 'animate-spin' : ''}
                  />
                }
              >
                Refresh
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedDevices.length > 0 && (
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    {selectedDevices.length} devices selected
                  </span>
                  <div className='flex gap-2'>
                    <Button
                      variant='success'
                      size='sm'
                      onClick={() => handleBulkStatusChange(true)}
                      disabled={!canEditDevices}
                    >
                      Enable Selected
                    </Button>
                    <Button
                      variant='warning'
                      size='sm'
                      onClick={() => handleBulkStatusChange(false)}
                      disabled={!canEditDevices}
                    >
                      Disable Selected
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={handleBulkDelete}
                      disabled={!canDeleteDevices}
                    >
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Error Message */}
          {error && (
            <Alert
              type='error'
              title='Error'
              message={error.message || 'An error occurred'}
              className='mb-6'
            />
          )}

          {/* Devices Display */}
          {isLoading ? (
            <div className='animate-pulse p-8 text-center text-gray-500'>
              <HardDrive className='mx-auto mb-4' size={32} />
              <p>Loading devices...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <EmptyState
              icon={<HardDrive size={32} />}
              title='No devices found'
              description={
                searchQuery || statusFilter || tagFilter
                  ? 'Try adjusting your filters'
                  : 'Add your first device to get started'
              }
              action={
                canAddDevices && !(searchQuery || statusFilter || tagFilter) ? (
                  <Button
                    variant='primary'
                    onClick={() => setIsNewDeviceModalOpen(true)}
                    icon={<Plus size={16} />}
                  >
                    Add Device
                  </Button>
                ) : undefined
              }
            />
          ) : viewMode === 'list' ? (
            <DeviceListView
              devices={filteredDevices}
              selectedDevices={selectedDevices}
              onSelectDevice={handleSelectDevice}
              onSelectAll={handleSelectAll}
              onViewDevice={handleViewDevice}
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
              formatDate={formatDate}
              canEditDevices={canEditDevices}
              canDeleteDevices={canDeleteDevices}
              canTestDevices={canTestDevices}
            />
          ) : viewMode === 'grid' ? (
            <DeviceGridView
              devices={filteredDevices}
              onViewDevice={handleViewDevice}
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
              formatDate={formatDate}
              canEditDevices={canEditDevices}
              canDeleteDevices={canDeleteDevices}
            />
          ) : (
            <EmptyState
              icon={<MapIcon size={48} className='text-gray-400' />}
              title='Map View'
              description='The map view is under development. This feature will show the geographical locations of your devices.'
              action={<Button variant='secondary'>Coming Soon</Button>}
            />
          )}
        </>
      ),
    },
    {
      id: 'connection',
      label: (
        <div className='flex items-center'>
          <Settings className='h-4 w-4 mr-2' />
          <span>Connection</span>
        </div>
      ),
      content: selectedDevice && (
        <Card>
          <h3 className='text-lg font-medium mb-4'>Connection Settings</h3>
          <p className='text-gray-600 mb-4'>
            {isEditing
              ? 'Edit the connection settings for this device.'
              : 'View the connection settings for this device.'}
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Connection Type
              </label>
              <div className='p-2 bg-white border border-gray-300 rounded-md'>
                {selectedDevice.connectionType || 'TCP'}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                IP Address
              </label>
              <div className='p-2 bg-white border border-gray-300 rounded-md'>
                {selectedDevice.ip || 'N/A'}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Port
              </label>
              <div className='p-2 bg-white border border-gray-300 rounded-md'>
                {selectedDevice.port || 'N/A'}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Slave ID
              </label>
              <div className='p-2 bg-white border border-gray-300 rounded-md'>
                {selectedDevice.slaveId}
              </div>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 'registers',
      label: (
        <div className='flex items-center'>
          <List className='h-4 w-4 mr-2' />
          <span>Registers</span>
        </div>
      ),
      content: selectedDevice && (
        <Card>
          <h3 className='text-lg font-medium mb-4'>Register Configuration</h3>
          <p className='text-gray-600 mb-4'>
            {isEditing
              ? 'Edit the register configuration for this device.'
              : 'View the register configuration for this device.'}
          </p>
          {selectedDevice.registers && selectedDevice.registers.length > 0 ? (
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
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {selectedDevice.registers.map((register, index) => (
                    <tr key={register.id || index}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {register.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {register.address}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {register.length}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {register.functionCode}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {register.type || 'holding'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<FileText className='text-gray-400' size={24} />}
              title='No registers configured'
              description="This device doesn't have any registers configured yet."
              action={
                isEditing ? (
                  <Button variant='primary' icon={<Plus size={16} />}>
                    Add Register
                  </Button>
                ) : undefined
              }
            />
          )}
        </Card>
      ),
    },
    {
      id: 'template',
      label: (
        <div className='flex items-center'>
          <FileText className='h-4 w-4 mr-2' />
          <span>Template</span>
        </div>
      ),
      content: selectedDevice && (
        <Card>
          <h3 className='text-lg font-medium mb-4'>Template Configuration</h3>
          <p className='text-gray-600 mb-4'>
            Templates provide predefined register configurations for common
            device types.
          </p>

          {selectedDevice.template ? (
            <div className='p-4 bg-white rounded-lg border border-gray-300'>
              <div className='flex items-center justify-between mb-2'>
                <div className='font-medium'>{selectedDevice.template}</div>
                {isEditing && (
                  <Button variant='secondary' size='sm'>
                    Change
                  </Button>
                )}
              </div>
              <p className='text-sm text-gray-600'>
                This device is using a predefined template.
              </p>
            </div>
          ) : (
            <EmptyState
              icon={<Clipboard className='text-gray-400' size={24} />}
              title='No template applied'
              description="This device isn't using any template."
              action={
                isEditing ? (
                  <Button variant='primary'>Apply Template</Button>
                ) : undefined
              }
            />
          )}
        </Card>
      ),
    },
    {
      id: 'data',
      label: (
        <div className='flex items-center'>
          <Activity className='h-4 w-4 mr-2' />
          <span>Data Reader</span>
        </div>
      ),
      content: selectedDevice && (
        <Card>
          <h3 className='text-lg font-medium mb-4'>Data Reader</h3>
          <p className='text-gray-600 mb-4'>
            Read live data from this device's registers.
          </p>

          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <div
                className={`h-3 w-3 rounded-full ${
                  selectedDevice.enabled ? 'bg-green-500' : 'bg-red-500'
                } mr-2`}
              ></div>
              <span>
                {selectedDevice.enabled ? 'Device Online' : 'Device Offline'}
              </span>
            </div>

            {canTestDevices && (
              <Button variant='primary' disabled={!selectedDevice.enabled}>
                Read Data
              </Button>
            )}
          </div>

          <div className='bg-white p-4 rounded-lg border border-gray-300'>
            {selectedDevice.enabled ? (
              <p className='text-center text-gray-500'>
                Click "Read Data" to fetch current values from this device.
              </p>
            ) : (
              <div className='text-center text-red-500'>
                <AlertCircle size={24} className='mx-auto mb-2' />
                <p>Device is offline. Unable to read data.</p>
              </div>
            )}
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Device Management</h1>

        {activeTab === 'devices' ? (
          <div className='flex space-x-2'>
            {canAddDevices && (
              <Button
                variant='primary'
                icon={<Plus size={16} />}
                onClick={() => setIsNewDeviceModalOpen(true)}
              >
                Add New Device
              </Button>
            )}
            {filteredDevices.length > 0 && (
              <Button
                variant='secondary'
                icon={<Download size={16} />}
                onClick={handleExportDevices}
              >
                Export
              </Button>
            )}
          </div>
        ) : (
          selectedDevice &&
          !isEditing && (
            <Button
              variant='primary'
              onClick={() => setIsEditing(true)}
              disabled={!canEditDevices}
            >
              Edit Device
            </Button>
          )
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs.filter(
          (tab) =>
            tab.id === 'devices' ||
            (selectedDevice &&
              ['connection', 'registers', 'template', 'data'].includes(tab.id))
        )}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as DeviceTab)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Delete</h2>
            <p className='mb-4'>
              {deviceToDelete === 'bulk'
                ? `Are you sure you want to delete ${selectedDevices.length} selected devices? This action cannot be undone.`
                : 'Are you sure you want to delete this device? This action cannot be undone.'}
            </p>
            <div className='flex justify-end gap-2'>
              <Button
                variant='secondary'
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeviceToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant='danger' onClick={confirmDeleteDevice}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Device Form Modal */}
      {isNewDeviceModalOpen && (
        <NewDeviceForm
          isOpen={isNewDeviceModalOpen}
          onClose={() => setIsNewDeviceModalOpen(false)}
          onSubmit={handleAddDevice}
        />
      )}
    </div>
  );
};

// Device List View Component
interface DeviceListViewProps {
  devices: Device[];
  selectedDevices: string[];
  onSelectDevice: (id: string) => void;
  onSelectAll: () => void;
  onViewDevice: (device: Device) => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (id: string) => void;
  formatDate: (date?: Date | string) => string;
  canEditDevices: boolean;
  canDeleteDevices: boolean;
  canTestDevices: boolean;
}

const DeviceListView: React.FC<DeviceListViewProps> = ({
  devices,
  selectedDevices,
  onSelectDevice,
  onSelectAll,
  onViewDevice,
  onEditDevice,
  onDeleteDevice,
  formatDate,
  canEditDevices,
  canDeleteDevices,
  canTestDevices,
}) => {
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (device: Device) => (
        <div className='flex items-center'>
          <div
            className={`h-2.5 w-2.5 rounded-full mr-2 ${
              device.enabled ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <div
            className='text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600'
            onClick={() => onViewDevice(device)}
          >
            {device.name}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (device: Device) => (
        <Badge variant={device.enabled ? 'success' : 'danger'}>
          {device.enabled ? 'Online' : 'Offline'}
        </Badge>
      ),
    },
    {
      key: 'ip',
      header: 'Connection Info',
      render: (device: Device) => (
        <span className='text-sm text-gray-500'>
          {device.ip
            ? `${device.ip}:${device.port} (Slave ID: ${device.slaveId})`
            : 'N/A'}
        </span>
      ),
    },
    {
      key: 'lastSeen',
      header: 'Last Seen',
      render: (device: Device) => (
        <span className='text-sm text-gray-500'>
          {formatDate(device.lastSeen)}
        </span>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (device: Device) => (
        <div className='flex flex-wrap gap-1'>
          {device.tags?.map((tag) => (
            <Badge key={tag} variant='primary'>
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (device: Device) => (
        <div className='flex justify-end space-x-2'>
          <button
            className='text-blue-600 hover:text-blue-800'
            onClick={() => onViewDevice(device)}
            title='View Data'
          >
            <Activity size={16} />
          </button>
          {canEditDevices && (
            <button
              className='text-indigo-600 hover:text-indigo-900'
              onClick={() => onEditDevice(device)}
              title='Edit Device'
            >
              <Settings size={16} />
            </button>
          )}
          {canDeleteDevices && (
            <button
              className='text-red-600 hover:text-red-900'
              onClick={() => onDeleteDevice(device._id)}
              title='Delete Device'
            >
              <X size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={devices}
      columns={columns}
      selectedRowIds={selectedDevices}
      idField='_id'
      onSelectRow={onSelectDevice}
      onSelectAll={onSelectAll}
      className='bg-white rounded-lg shadow-sm'
    />
  );
};

// Device Grid View Component
interface DeviceGridViewProps {
  devices: Device[];
  onViewDevice: (device: Device) => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (id: string) => void;
  formatDate: (date?: Date | string) => string;
  canEditDevices: boolean;
  canDeleteDevices: boolean;
}

const DeviceGridView: React.FC<DeviceGridViewProps> = ({
  devices,
  onViewDevice,
  onEditDevice,
  onDeleteDevice,
  formatDate,
  canEditDevices,
  canDeleteDevices,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {devices.map((device) => (
        <Card key={device._id} className='hover:shadow-md transition-shadow'>
          <div className='border-b pb-3 mb-3'>
            <div className='flex justify-between items-start'>
              <div
                className='text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 truncate'
                onClick={() => onViewDevice(device)}
              >
                {device.name}
              </div>
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  device.enabled ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
            {device.description && (
              <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                {device.description}
              </p>
            )}
            {device.tags && device.tags.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-1'>
                {device.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant='primary'>
                    {tag}
                  </Badge>
                ))}
                {device.tags.length > 3 && (
                  <Badge variant='secondary'>+{device.tags.length - 3}</Badge>
                )}
              </div>
            )}
          </div>
          <div className='px-0 py-0 bg-gray-50 text-sm rounded'>
            <div className='flex justify-between items-center p-2'>
              <span className='text-gray-500'>
                {device.ip
                  ? `${device.ip}:${device.port}`
                  : 'No connection info'}
              </span>
              <Badge variant={device.enabled ? 'success' : 'danger'}>
                {device.enabled ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
          <div className='pt-3 flex justify-between items-center border-t mt-3'>
            <span className='text-xs text-gray-500'>
              {device.lastSeen
                ? `Last seen: ${formatDate(device.lastSeen)}`
                : 'Never connected'}
            </span>
            <div className='flex space-x-2'>
              <button
                className='p-1 text-blue-600 hover:text-blue-800'
                onClick={() => onViewDevice(device)}
                title='View Data'
              >
                <Activity size={16} />
              </button>
              {canEditDevices && (
                <button
                  className='p-1 text-indigo-600 hover:text-indigo-900'
                  onClick={() => onEditDevice(device)}
                  title='Edit Device'
                >
                  <Settings size={16} />
                </button>
              )}
              {canDeleteDevices && (
                <button
                  className='p-1 text-red-600 hover:text-red-900'
                  onClick={() => onDeleteDevice(device._id)}
                  title='Delete Device'
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DeviceManagement;
