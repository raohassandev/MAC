import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Edit,
  Folder,
  FolderPlus,
  MoreHorizontal,
  Plus,
  Search,
  Server,
  Trash,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useDevices } from '../../hooks/useDevices';
import { Device } from '../../types/device.types';

interface DeviceGroup {
  id: string;
  name: string;
  description?: string;
  deviceIds: string[];
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const DeviceGroups: React.FC = () => {
  // State
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | null>(null);
  const [newGroup, setNewGroup] = useState<{
    name: string;
    description: string;
    deviceIds: string[];
  }>({
    name: '',
    description: '',
    deviceIds: [],
  });

  // Get devices and user info
  const { devices } = useDevices();
  const { user } = useAuth();

  // Permissions
  const userPermissions = user?.permissions || [];
  const canManageGroups =
    userPermissions.includes('manage_devices') ||
    userPermissions.includes('manage_groups');

  // Mock API for device groups (replace with actual API when available)
  useEffect(() => {
    const fetchDeviceGroups = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/device-groups');
        // const data = await response.json();

        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        const mockGroups: DeviceGroup[] = [
          {
            id: 'group1',
            name: 'Server Room',
            description: 'All devices in the server room',
            deviceIds: ['1', '2', '3'],
            tags: ['server', 'high-priority'],
            createdAt: new Date('2023-01-15').toISOString(),
            updatedAt: new Date('2023-04-10').toISOString(),
          },
          {
            id: 'group2',
            name: 'Office Building',
            description: 'Devices in the main office building',
            deviceIds: ['4', '5'],
            tags: ['office', 'medium-priority'],
            createdAt: new Date('2023-02-20').toISOString(),
            updatedAt: new Date('2023-03-15').toISOString(),
          },
          {
            id: 'group3',
            name: 'Factory Floor',
            description: 'Production area devices',
            deviceIds: ['6', '7', '8', '9'],
            tags: ['production', 'high-priority'],
            createdAt: new Date('2023-03-05').toISOString(),
            updatedAt: new Date('2023-04-20').toISOString(),
          },
          {
            id: 'group4',
            name: 'Warehouse',
            description: 'Warehouse monitoring devices',
            deviceIds: ['10', '11'],
            tags: ['storage', 'low-priority'],
            createdAt: new Date('2023-03-10').toISOString(),
            updatedAt: new Date('2023-03-10').toISOString(),
          },
        ];

        setGroups(mockGroups);
      } catch (err) {
        console.error('Error fetching device groups:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch device groups')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceGroups();
  }, []);

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description &&
        group.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (group.tags &&
        group.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  // Calculate total device count for a group
  const getGroupDeviceCount = (group: DeviceGroup) => {
    return group.deviceIds.length;
  };

  // Calculate online device count for a group
  const getGroupOnlineDeviceCount = (group: DeviceGroup) => {
    if (!devices) return 0;

    let onlineCount = 0;
    group.deviceIds.forEach((id) => {
      const device = devices.find((d) => d._id === id);
      if (device && device.enabled) {
        onlineCount++;
      }
    });

    return onlineCount;
  };

  // Get device names for a group
  const getGroupDeviceNames = (group: DeviceGroup) => {
    if (!devices) return [];

    return group.deviceIds.map((id) => {
      const device = devices.find((d) => d._id === id);
      return device ? device.name : 'Unknown Device';
    });
  };

  // Handle opening the create modal
  const handleOpenCreateModal = () => {
    setNewGroup({
      name: '',
      description: '',
      deviceIds: [],
    });
    setIsCreateModalOpen(true);
  };

  // Handle opening the edit modal
  const handleOpenEditModal = (group: DeviceGroup) => {
    setSelectedGroup(group);
    setNewGroup({
      name: group.name,
      description: group.description || '',
      deviceIds: [...group.deviceIds],
    });
    setIsEditModalOpen(true);
  };

  // Handle opening the delete modal
  const handleOpenDeleteModal = (group: DeviceGroup) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/device-groups', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newGroup)
      // });
      // const data = await response.json();

      // For now, use mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      const newId = `group${groups.length + 1}`;
      const createdGroup: DeviceGroup = {
        id: newId,
        name: newGroup.name,
        description: newGroup.description,
        deviceIds: newGroup.deviceIds,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGroups([...groups, createdGroup]);
      setIsCreateModalOpen(false);
      toast.success('Device group created successfully');
    } catch (err) {
      console.error('Error creating device group:', err);
      toast.error('Failed to create device group');
    }
  };

  // Handle updating an existing group
  const handleUpdateGroup = async () => {
    if (!selectedGroup || !newGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/device-groups/${selectedGroup.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newGroup)
      // });
      // const data = await response.json();

      // For now, update local state
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      const updatedGroup: DeviceGroup = {
        ...selectedGroup,
        name: newGroup.name,
        description: newGroup.description,
        deviceIds: newGroup.deviceIds,
        updatedAt: new Date().toISOString(),
      };

      setGroups(
        groups.map((group) =>
          group.id === selectedGroup.id ? updatedGroup : group
        )
      );

      setIsEditModalOpen(false);
      toast.success('Device group updated successfully');
    } catch (err) {
      console.error('Error updating device group:', err);
      toast.error('Failed to update device group');
    }
  };

  // Handle deleting a group
  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/device-groups/${selectedGroup.id}`, {
      //   method: 'DELETE'
      // });

      // For now, update local state
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      setGroups(groups.filter((group) => group.id !== selectedGroup.id));
      setIsDeleteModalOpen(false);
      toast.success('Device group deleted successfully');
    } catch (err) {
      console.error('Error deleting device group:', err);
      toast.error('Failed to delete device group');
    }
  };

  // Toggle device selection in group form
  const toggleDeviceSelection = (deviceId: string) => {
    setNewGroup((prev) => {
      if (prev.deviceIds.includes(deviceId)) {
        return {
          ...prev,
          deviceIds: prev.deviceIds.filter((id) => id !== deviceId),
        };
      } else {
        return {
          ...prev,
          deviceIds: [...prev.deviceIds, deviceId],
        };
      }
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
        <div className='flex'>
          <AlertCircle className='text-red-500 mr-3' />
          <div>
            <h3 className='text-red-800 font-medium'>Error</h3>
            <p className='text-red-700'>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Device Groups</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Organize your devices into logical groups for easier management
          </p>
        </div>
        {canManageGroups && (
          <button
            onClick={handleOpenCreateModal}
            className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            <FolderPlus size={16} />
            Create Group
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='relative'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search groups...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <Folder size={48} className='mx-auto text-gray-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No device groups found
          </h3>
          <p className='text-gray-500 mb-4'>
            {searchQuery
              ? 'Try adjusting your search'
              : "You haven't created any device groups yet."}
          </p>
          {canManageGroups && !searchQuery && (
            <button
              onClick={handleOpenCreateModal}
              className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              <Plus size={16} className='mr-2' />
              Create your first group
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className='bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow'
            >
              <div className='p-4 border-b'>
                <div className='flex justify-between items-start'>
                  <Link
                    to={`/device-groups/${group.id}`}
                    className='text-lg font-medium text-blue-600 hover:text-blue-800'
                  >
                    {group.name}
                  </Link>
                  <div className='relative'>
                    <button
                      onClick={() => {}}
                      className='p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none'
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {/* Dropdown menu would go here */}
                  </div>
                </div>
                <p className='text-sm text-gray-500 mt-1'>
                  {group.description || 'No description'}
                </p>

                {group.tags && group.tags.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {group.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className='p-4 bg-gray-50'>
                <div className='flex justify-between'>
                  <div className='text-sm text-gray-600'>
                    <div className='flex items-center'>
                      <Server size={16} className='mr-1.5 text-gray-400' />
                      <span>{getGroupDeviceCount(group)} devices</span>
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      {getGroupOnlineDeviceCount(group)} online
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    {canManageGroups && (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(group)}
                          className='p-1.5 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50'
                          title='Edit Group'
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(group)}
                          className='p-1.5 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50'
                          title='Delete Group'
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <div className='p-4 border-b flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>Create Device Group</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={20} />
              </button>
            </div>

            <div className='p-4'>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Group Name *
                </label>
                <input
                  type='text'
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  required
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  rows={3}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Select Devices
                </label>
                <div className='max-h-60 overflow-y-auto border border-gray-300 rounded-md'>
                  {devices && devices.length > 0 ? (
                    devices.map((device: Device) => (
                      <div
                        key={device._id}
                        className='px-3 py-2 hover:bg-gray-50 flex items-center'
                      >
                        <input
                          type='checkbox'
                          id={`device-${device._id}`}
                          checked={newGroup.deviceIds.includes(device._id)}
                          onChange={() => toggleDeviceSelection(device._id)}
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor={`device-${device._id}`}
                          className='ml-2 block text-sm text-gray-900'
                        >
                          {device.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className='px-3 py-2 text-gray-500'>
                      No devices available
                    </div>
                  )}
                </div>
              </div>

              <div className='flex justify-end space-x-3 border-t pt-4'>
                <button
                  type='button'
                  onClick={() => setIsCreateModalOpen(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleCreateGroup}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600'
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {isEditModalOpen && selectedGroup && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <div className='p-4 border-b flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>Edit Device Group</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={20} />
              </button>
            </div>

            <div className='p-4'>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Group Name *
                </label>
                <input
                  type='text'
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  required
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  rows={3}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Select Devices
                </label>
                <div className='max-h-60 overflow-y-auto border border-gray-300 rounded-md'>
                  {devices && devices.length > 0 ? (
                    devices.map((device: Device) => (
                      <div
                        key={device._id}
                        className='px-3 py-2 hover:bg-gray-50 flex items-center'
                      >
                        <input
                          type='checkbox'
                          id={`edit-device-${device._id}`}
                          checked={newGroup.deviceIds.includes(device._id)}
                          onChange={() => toggleDeviceSelection(device._id)}
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                          htmlFor={`edit-device-${device._id}`}
                          className='ml-2 block text-sm text-gray-900'
                        >
                          {device.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className='px-3 py-2 text-gray-500'>
                      No devices available
                    </div>
                  )}
                </div>
              </div>

              <div className='flex justify-end space-x-3 border-t pt-4'>
                <button
                  type='button'
                  onClick={() => setIsEditModalOpen(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleUpdateGroup}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600'
                >
                  Update Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedGroup && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Delete</h2>
            <p className='mb-4'>
              Are you sure you want to delete the group "{selectedGroup.name}"?
              This action cannot be undone.
            </p>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceGroups;
