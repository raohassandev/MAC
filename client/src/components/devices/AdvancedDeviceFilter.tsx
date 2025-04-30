import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  Search,
  Check,
  ChevronDown,
  Tag,
  Settings,
  MapPin,
  Server,
} from 'lucide-react';

interface DeviceFilter {
  search?: string;
  status?: 'online' | 'offline';
  tags?: string[];
  make?: string;
  model?: string;
  group?: string;
}

interface AdvancedDeviceFilterProps {
  onFilterChange: (filters: DeviceFilter) => void;
  devices: any[]; // This would be Device[] in a real implementation
  className?: string;
}

const AdvancedDeviceFilter: React.FC<AdvancedDeviceFilterProps> = ({
  onFilterChange,
  devices,
  className = '',
}) => {
  // Filter state
  const [filters, setFilters] = useState<DeviceFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'online' | 'offline' | null
  >(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const [makeDropdownOpen, setMakeDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);

  // Extract unique values from devices
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<
    { id: string; name: string }[]
  >([]);

  // Extract filter options from devices
  useEffect(() => {
    if (!devices || devices.length === 0) return;

    // Extract tags
    const tags = new Set<string>();
    devices.forEach((device) => {
      if (device.tags && device.tags.length > 0) {
        device.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    setAvailableTags(Array.from(tags).sort());

    // Extract makes
    const makes = new Set<string>();
    devices.forEach((device) => {
      if (device.make) {
        makes.add(device.make);
      }
    });
    setAvailableMakes(Array.from(makes).sort());

    // Extract models
    const models = new Set<string>();
    devices.forEach((device) => {
      if (device.model) {
        models.add(device.model);
      }
    });
    setAvailableModels(Array.from(models).sort());

    // Mock groups for now - in a real implementation you would fetch this from API
    setAvailableGroups([
      { id: 'group1', name: 'Server Room' },
      { id: 'group2', name: 'Office Building' },
      { id: 'group3', name: 'Factory Floor' },
      { id: 'group4', name: 'Warehouse' },
    ]);
  }, [devices]);

  // Update filters whenever any filter state changes
  useEffect(() => {
    const updatedFilters: DeviceFilter = {
      search: searchQuery || undefined,
      status: selectedStatus || undefined,
    };

    if (selectedTags.length > 0) {
      updatedFilters.tags = selectedTags;
    }

    if (selectedMake) {
      updatedFilters.make = selectedMake;
    }

    if (selectedModel) {
      updatedFilters.model = selectedModel;
    }

    if (selectedGroup) {
      updatedFilters.group = selectedGroup;
    }

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  }, [
    searchQuery,
    selectedStatus,
    selectedTags,
    selectedMake,
    selectedModel,
    selectedGroup,
    onFilterChange,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus(null);
    setSelectedTags([]);
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedGroup(null);
  };

  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Count active filters
  const activeFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedStatus) count++;
    count += selectedTags.length;
    if (selectedMake) count++;
    if (selectedModel) count++;
    if (selectedGroup) count++;
    return count;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='flex flex-col md:flex-row gap-3'>
        <div className='relative flex-grow'>
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className='relative'>
          <button
            type='button'
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className='inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <span className='flex items-center'>
              {selectedStatus ? (
                <>
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      selectedStatus === 'online'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  ></div>
                  {selectedStatus === 'online' ? 'Online' : 'Offline'}
                </>
              ) : (
                'Status: All'
              )}
            </span>
            <ChevronDown size={16} className='ml-2' />
          </button>

          {statusDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
              <ul className='py-1'>
                <li
                  className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                  onClick={() => {
                    setSelectedStatus(null);
                    setStatusDropdownOpen(false);
                  }}
                >
                  All
                  {selectedStatus === null && (
                    <Check size={16} className='text-blue-500' />
                  )}
                </li>
                <li
                  className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                  onClick={() => {
                    setSelectedStatus('online');
                    setStatusDropdownOpen(false);
                  }}
                >
                  <div className='flex items-center'>
                    <div className='h-2 w-2 rounded-full bg-green-500 mr-2'></div>
                    Online
                  </div>
                  {selectedStatus === 'online' && (
                    <Check size={16} className='text-blue-500' />
                  )}
                </li>
                <li
                  className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                  onClick={() => {
                    setSelectedStatus('offline');
                    setStatusDropdownOpen(false);
                  }}
                >
                  <div className='flex items-center'>
                    <div className='h-2 w-2 rounded-full bg-red-500 mr-2'></div>
                    Offline
                  </div>
                  {selectedStatus === 'offline' && (
                    <Check size={16} className='text-blue-500' />
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          type='button'
          onClick={() => setAdvancedFiltersVisible(!advancedFiltersVisible)}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <Filter size={16} className='mr-2' />
          {advancedFiltersVisible ? 'Hide Filters' : 'Advanced Filters'}
          {activeFilterCount() > 0 && !advancedFiltersVisible && (
            <span className='ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
              {activeFilterCount()}
            </span>
          )}
        </button>

        {/* Reset Filters Button */}
        {activeFilterCount() > 0 && (
          <button
            type='button'
            onClick={resetFilters}
            className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <X size={16} className='mr-2' />
            Clear Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {advancedFiltersVisible && (
        <div className='bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Tags Dropdown */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <Tag size={14} className='inline mr-1' />
                Tags
              </label>
              <button
                type='button'
                onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                className='inline-flex justify-between items-center w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <span className='truncate'>
                  {selectedTags.length
                    ? `${selectedTags.length} tag${
                        selectedTags.length !== 1 ? 's' : ''
                      } selected`
                    : 'Select tags'}
                </span>
                <ChevronDown size={16} className='ml-2' />
              </button>

              {tagsDropdownOpen && (
                <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
                  {availableTags.length === 0 ? (
                    <div className='px-4 py-2 text-sm text-gray-500'>
                      No tags available
                    </div>
                  ) : (
                    <div className='p-2'>
                      <div className='mb-2'>
                        {selectedTags.length > 0 && (
                          <button
                            className='text-xs text-blue-600 hover:text-blue-800'
                            onClick={() => setSelectedTags([])}
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      {availableTags.map((tag) => (
                        <div
                          key={tag}
                          className='flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md'
                          onClick={() => toggleTag(tag)}
                        >
                          <input
                            type='checkbox'
                            className='mr-2'
                            checked={selectedTags.includes(tag)}
                            onChange={() => {}}
                          />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTags.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-1'>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                    >
                      {tag}
                      <button
                        type='button'
                        className='ml-1 text-blue-600 hover:text-blue-800'
                        onClick={() => toggleTag(tag)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Manufacturer Dropdown */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <Settings size={14} className='inline mr-1' />
                Manufacturer
              </label>
              <button
                type='button'
                onClick={() => setMakeDropdownOpen(!makeDropdownOpen)}
                className='inline-flex justify-between items-center w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <span className='truncate'>
                  {selectedMake || 'Any manufacturer'}
                </span>
                <ChevronDown size={16} className='ml-2' />
              </button>

              {makeDropdownOpen && (
                <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
                  <div className='py-1'>
                    <div
                      className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                      onClick={() => {
                        setSelectedMake(null);
                        setMakeDropdownOpen(false);
                      }}
                    >
                      Any manufacturer
                      {selectedMake === null && (
                        <Check size={16} className='text-blue-500' />
                      )}
                    </div>
                    {availableMakes.map((make) => (
                      <div
                        key={make}
                        className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                        onClick={() => {
                          setSelectedMake(make);
                          setMakeDropdownOpen(false);
                        }}
                      >
                        {make}
                        {selectedMake === make && (
                          <Check size={16} className='text-blue-500' />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Model Dropdown */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <Server size={14} className='inline mr-1' />
                Model
              </label>
              <button
                type='button'
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className='inline-flex justify-between items-center w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <span className='truncate'>{selectedModel || 'Any model'}</span>
                <ChevronDown size={16} className='ml-2' />
              </button>

              {modelDropdownOpen && (
                <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
                  <div className='py-1'>
                    <div
                      className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                      onClick={() => {
                        setSelectedModel(null);
                        setModelDropdownOpen(false);
                      }}
                    >
                      Any model
                      {selectedModel === null && (
                        <Check size={16} className='text-blue-500' />
                      )}
                    </div>
                    {availableModels.map((model) => (
                      <div
                        key={model}
                        className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                        onClick={() => {
                          setSelectedModel(model);
                          setModelDropdownOpen(false);
                        }}
                      >
                        {model}
                        {selectedModel === model && (
                          <Check size={16} className='text-blue-500' />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Group Dropdown */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <MapPin size={14} className='inline mr-1' />
                Device Group
              </label>
              <button
                type='button'
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                className='inline-flex justify-between items-center w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <span className='truncate'>
                  {selectedGroup
                    ? availableGroups.find((g) => g.id === selectedGroup)
                        ?.name || 'Unknown Group'
                    : 'Any group'}
                </span>
                <ChevronDown size={16} className='ml-2' />
              </button>

              {groupDropdownOpen && (
                <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
                  <div className='py-1'>
                    <div
                      className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                      onClick={() => {
                        setSelectedGroup(null);
                        setGroupDropdownOpen(false);
                      }}
                    >
                      Any group
                      {selectedGroup === null && (
                        <Check size={16} className='text-blue-500' />
                      )}
                    </div>
                    {availableGroups.map((group) => (
                      <div
                        key={group.id}
                        className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between'
                        onClick={() => {
                          setSelectedGroup(group.id);
                          setGroupDropdownOpen(false);
                        }}
                      >
                        {group.name}
                        {selectedGroup === group.id && (
                          <Check size={16} className='text-blue-500' />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount() > 0 && (
            <div className='text-sm text-gray-500 pt-2'>
              <span className='font-medium'>Active filters:</span>{' '}
              {searchQuery && <span className='mr-2'>Search, </span>}
              {selectedStatus && <span className='mr-2'>Status, </span>}
              {selectedTags.length > 0 && (
                <span className='mr-2'>Tags ({selectedTags.length}), </span>
              )}
              {selectedMake && <span className='mr-2'>Manufacturer, </span>}
              {selectedModel && <span className='mr-2'>Model, </span>}
              {selectedGroup && <span className='mr-2'>Group</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedDeviceFilter;
