import {
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clipboard,
  Download,
  Edit,
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
  Tag,
  Trash,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NewDeviceForm from '../components/devices/NewDeviceForm';
import { useAuth } from '../contexts/AuthContext';
import { useDevices } from '../hooks/useDevices';

// Device type definition
interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers?: DeviceRegister[];
  lastSeen?: Date | string;
  connectionType?: 'tcp' | 'rtu';
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  template?: string;
  location?: string;
  tags?: string[];
  make?: string;
  model?: string;
  description?: string;
}

interface DeviceRegister {
  id?: string;
  address: number;
  length: number;
  functionCode: number;
  name: string;
  description?: string;
  type?: 'holding' | 'input' | 'coil' | 'discrete';
  scaleFactor?: number;
  unit?: string;
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

type ViewMode = 'grid' | 'list' | 'map';
type DeviceTab = 'devices' | 'connection' | 'registers' | 'template' | 'data';

const DeviceManagement: React.FC = () => {
  // Hooks
  const {
    devices,
    loading: isLoading,
    error,
    refreshDevices,
    addDevice,
    updateDevice,
    deleteDevice
  } = useDevices();
  const navigate = useNavigate();
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
  const [customColumns, setCustomColumns] = useState<string[]>([
    'name', 'status', 'ip', 'lastSeen', 'actions'
  ]);
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
    devices.forEach(device => {
      if (device.tags) {
        device.tags.forEach(tag => tags.add(tag));
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
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(query) ||
        (device.ip && device.ip.toLowerCase().includes(query)) ||
        (device.description && device.description.toLowerCase().includes(query)) ||
        (device.make && device.make.toLowerCase().includes(query)) ||
        (device.model && device.model.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(device => 
        statusFilter === 'online' ? device.enabled : !device.enabled
      );
    }
    
    // Apply tag filter
    if (tagFilter) {
      filtered = filtered.filter(device => 
        device.tags && device.tags.includes(tagFilter)
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
    setSelectedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
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
      setSelectedDevices(filteredDevices.map(device => device._id));
    }
  };

  // Handle bulk enable/disable of selected devices
  const handleBulkStatusChange = async (enable: boolean) => {
    for (const deviceId of selectedDevices) {
      const device = devices?.find(d => d._id === deviceId);
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
        tags: newDevice.tags || []
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
      'Name', 'IP Address', 'Port', 'Status', 'Slave ID', 
      'Last Seen', 'Make', 'Model', 'Description', 'Tags'
    ].join(',');
    
    const rows = filteredDevices.map(device => [
      device.name,
      device.ip || '',
      device.port || '',
      device.enabled ? 'Enabled' : 'Disabled',
      device.slaveId,
      device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never',
      device.make || '',
      device.model || '',
      device.description ? `"${device.description.replace(/"/g, '""')}"` : '',
      device.tags ? device.tags.join(';') : ''
    ].join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devices_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Never';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  };

  // Utility function for tab button styling
  const tabButtonClasses = (tabName: DeviceTab) => `
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
    tab: DeviceTab;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button onClick={() => setActiveTab(tab)} className={tabButtonClasses(tab)}>
      {icon}
      <span className='ml-2'>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Device Management</h1>

        {activeTab === 'devices' ? (
          <div className="flex space-x-2">
            {canAddDevices && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
                onClick={() => setIsNewDeviceModalOpen(true)}
              >
                <Plus size={16} />
                Add New Device
              </button>
            )}
            {filteredDevices.length > 0 && (
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded flex items-center gap-2"
                onClick={handleExportDevices}
              >
                <Download size={16} />
                Export
              </button>
            )}
          </div>
        ) : (
          selectedDevice && !isEditing && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
              onClick={() => setIsEditing(true)}
              disabled={!canEditDevices}
            >
              <Edit size={16} />
              Edit Device
            </button>
          )
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <TabButton
            tab="devices"
            icon={<HardDrive className="h-4 w-4" />}
            label="Devices"
          />

          {selectedDevice && (
            <>
              <TabButton
                tab="connection"
                icon={<Settings className="h-4 w-4" />}
                label="Connection"
              />
              <TabButton
                tab="registers"
                icon={<List className="h-4 w-4" />}
                label="Registers"
              />
              <TabButton
                tab="template"
                icon={<FileText className="h-4 w-4" />}
                label="Template"
              />
              <TabButton
                tab="data"
                icon={<Activity className="h-4 w-4" />}
                label="Data Reader"
              />
            </>
          )}
        </nav>
      </div>

      {/* Devices Tab Content */}
      {activeTab === 'devices' && (
        <>
          {/* Search and Filters */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search devices..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Tag Filter */}
              {availableTags.length > 0 && (
                <div className="relative">
                  <select
                    value={tagFilter || ''}
                    onChange={(e) => setTagFilter(e.target.value || null)}
                    className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Tags</option>
                    {availableTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              )}

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={!searchQuery && !statusFilter && !tagFilter}
              >
                <div className="flex items-center gap-1">
                  <Filter size={16} />
                  Reset
                </div>
              </button>

              {/* View Mode Toggles */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title="List View"
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
                  title="Grid View"
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
                  title="Map View"
                >
                  <MapIcon size={16} />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={refreshDevices}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                <div className="flex items-center gap-1">
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  Refresh
                </div>
              </button>
            </div>

            {/* Bulk Actions (only visible when devices are selected) */}
            {selectedDevices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedDevices.length} devices selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusChange(true)}
                      className="px-3 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      disabled={!canEditDevices}
                    >
                      Enable Selected
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange(false)}
                      className="px-3 py-1.5 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      disabled={!canEditDevices}
                    >
                      Disable Selected
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={!canDeleteDevices}
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <MapIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Map View</h3>
              <p className="text-gray-500 mb-4">
                The map view is under development. This feature will show the geographical locations of your devices.
              </p>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded">
                Coming Soon
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-4">
                  {deviceToDelete === 'bulk'
                    ? `Are you sure you want to delete ${selectedDevices.length} selected devices? This action cannot be undone.`
                    : 'Are you sure you want to delete this device? This action cannot be undone.'}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeviceToDelete(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteDevice}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Connection, Registers, Template, Data Content */}
      {activeTab !== 'devices' && selectedDevice && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedDevice.name}</h2>
            <button
              onClick={() => {
                setSelectedDevice(null);
                setActiveTab('devices');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* This would be replaced with the actual tab content components */}
          <div className="p-6 bg-gray-50 rounded-lg">
            {activeTab === 'connection' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connection Settings</h3>
                <p className="text-gray-600">
                  {isEditing 
                    ? 'Edit the connection settings for this device.'
                    : 'View the connection settings for this device.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Connection Type</label>
                    <div className="p-2 bg-white border border-gray-300 rounded-md">
                      {selectedDevice.connectionType || 'TCP'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                    <div className="p-2 bg-white border border-gray-300 rounded-md">
                      {selectedDevice.ip || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <div className="p-2 bg-white border border-gray-300 rounded-md">
                      {selectedDevice.port || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slave ID</label>
                    <div className="p-2 bg-white border border-gray-300 rounded-md">
                      {selectedDevice.slaveId}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'registers' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Register Configuration</h3>
                <p className="text-gray-600">
                  {isEditing 
                    ? 'Edit the register configuration for this device.'
                    : 'View the register configuration for this device.'}
                </p>
                {selectedDevice.registers && selectedDevice.registers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Function Code</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedDevice.registers.map((register, index) => (
                          <tr key={register.id || index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{register.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{register.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{register.length}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{register.functionCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{register.type || 'holding'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <FileText className="mx-auto mb-2 text-gray-400" size={24} />
                    <p>No registers configured for this device</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'template' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Template Configuration</h3>
                <p className="text-gray-600">
                  Templates provide predefined register configurations for common device types.
                </p>
                
                {selectedDevice.template ? (
                  <div className="p-4 bg-white rounded-lg border border-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{selectedDevice.template}</div>
                      {isEditing && (
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Change
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      This device is using a predefined template.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <Clipboard className="mx-auto mb-2 text-gray-400" size={24} />
                    <p>No template applied to this device</p>
                    {isEditing && (
                      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Apply Template
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'data' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Reader</h3>
                <p className="text-gray-600">
                  Read live data from this device's registers.
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${selectedDevice.enabled ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span>{selectedDevice.enabled ? 'Device Online' : 'Device Offline'}</span>
                  </div>
                  
                  {canTestDevices && (
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      disabled={!selectedDevice.enabled}
                    >
                      Read Data
                    </button>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-300">
                  {selectedDevice.enabled ? (
                    <p className="text-center text-gray-500">
                      Click "Read Data" to fetch current values from this device.
                    </p>
                  ) : (
                    <div className="text-center text-red-500">
                      <AlertCircle size={24} className="mx-auto mb-2" />
                      <p>Device is offline. Unable to read data.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
  columns: string[];
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
  columns,
  canEditDevices,
  canDeleteDevices,
  canTestDevices
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedDevices.length === devices.length && devices.length > 0}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              {columns.includes('name') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
              )}
              {columns.includes('status') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              {columns.includes('ip') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Connection Info
                </th>
              )}
              {columns.includes('lastSeen') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
              )}
              {columns.includes('tags') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
              )}
              {columns.includes('actions') && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device._id)}
                    onChange={() => onSelectDevice(device._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                {columns.includes('name') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full mr-2 ${
                          device.enabled ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => onViewDevice(device)}
                      >
                        {device.name}
                      </div>
                    </div>
                  </td>
                )}
                {columns.includes('status') && (
                  <td className="px-6 py-4 whitespace-nowrap">
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
                )}
                {columns.includes('ip') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.ip
                      ? `${device.ip}:${device.port} (Slave ID: ${device.slaveId})`
                      : 'N/A'}
                  </td>
                )}
                {columns.includes('lastSeen') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(device.lastSeen)}
                  </td>
                )}
                {columns.includes('tags') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {device.tags?.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
                {columns.includes('actions') && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => onViewDevice(device)}
                      title="View Data"
                    >
                      <Activity size={16} />
                    </button>
                    {canEditDevices && (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => onEditDevice(device)}
                        title="Edit Device"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {canDeleteDevices && (
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => onDeleteDevice(device._id)}
                        title="Delete Device"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
  canDeleteDevices
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {devices.map((device) => (
        <div
          key={device._id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div 
                className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 truncate"
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
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {device.description}
              </p>
            )}
            {device.tags && device.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {device.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {device.tags.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                    +{device.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                {device.ip
                  ? `${device.ip}:${device.port}`
                  : 'No connection info'}
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  device.enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {device.enabled ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="px-4 py-2 flex justify-between items-center border-t">
            <span className="text-xs text-gray-500">
              {device.lastSeen
                ? `Last seen: ${formatDate(device.lastSeen)}`
                : 'Never connected'}
            </span>
            <div className="flex space-x-2">
              <button
                className="p-1 text-blue-600 hover:text-blue-800"
                onClick={() => onViewDevice(device)}
                title="View Data"
              >
                <Activity size={16} />
              </button>
              {canEditDevices && (
                <button
                  className="p-1 text-indigo-600 hover:text-indigo-900"
                  onClick={() => onEditDevice(device)}
                  title="Edit Device"
                >
                  <Edit size={16} />
                </button>
              )}
              {canDeleteDevices && (
                <button
                  className="p-1 text-red-600 hover:text-red-900"
                  onClick={() => onDeleteDevice(device._id)}
                  title="Delete Device"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceManagement;red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p className="text-red-700 mt-1">{error.message || 'An error occurred'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Devices Display */}
          {isLoading ? (
            <div className="animate-pulse p-8 text-center text-gray-500">
              <HardDrive className="mx-auto mb-4" size={32} />
              <p>Loading devices...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
              <HardDrive className="mx-auto mb-4" size={32} />
              <p className="mb-2">No devices found</p>
              <p className="text-sm">
                {searchQuery || statusFilter || tagFilter
                  ? 'Try adjusting your filters'
                  : 'Add your first device to get started'}
              </p>
              {canAddDevices && (
                <button
                  onClick={() => setIsNewDeviceModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <div className="flex items-center gap-1">
                    <Plus size={16} />
                    Add Device
                  </div>
                </button>
              )}
            </div>
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
              columns={customColumns}
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
            <div className="bg-