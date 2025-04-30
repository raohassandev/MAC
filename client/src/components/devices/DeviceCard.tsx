import React from 'react';
import { Link } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash,
  Star,
  Pin,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  enabled: boolean;
  lastSeen?: Date;
  make?: string;
  model?: string;
  tags?: string[];
}

interface DeviceCardProps {
  device: Device;
  onEdit?: (device: Device) => void;
  onDelete?: (device: Device) => void;
  onToggleFavorite?: (device: Device) => void;
  onTogglePin?: (device: Device) => void;
  isFavorite?: boolean;
  isPinned?: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  isFavorite = false,
  isPinned = false,
}) => {
  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'Never';

    // Convert string date to Date object if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo ago`;
  };

  return (
    <Card.Root className='transition-all hover:shadow-md'>
      <Card.Content className='p-0'>
        <div className='p-4 border-b border-gray-100'>
          <div className='flex justify-between items-start'>
            <Link to={`/devices/${device._id}`} className='block flex-grow'>
              <div className='flex items-center'>
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    device.enabled ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <h3 className='font-medium text-gray-800'>{device.name}</h3>
              </div>
            </Link>

            <Tooltip.Provider>
              <DropdownMenu.Root>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button className='p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100'>
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenu.Trigger>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className='bg-white shadow-md rounded-md px-3 py-1.5 text-sm z-50'
                      sideOffset={5}
                    >
                      Actions
                      <Tooltip.Arrow className='fill-white' />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className='min-w-[180px] bg-white rounded-md shadow-lg z-50 p-1 border border-gray-200'
                    sideOffset={5}
                  >
                    <DropdownMenu.Item
                      className='flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer'
                      onSelect={() => onEdit && onEdit(device)}
                    >
                      <Edit size={14} className='mr-2' />
                      Edit Device
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className='flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer'
                      onSelect={() =>
                        onToggleFavorite && onToggleFavorite(device)
                      }
                    >
                      <Star
                        size={14}
                        className={`mr-2 ${
                          isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                        }`}
                      />
                      {isFavorite
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'}
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className='flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer'
                      onSelect={() => onTogglePin && onTogglePin(device)}
                    >
                      <Pin
                        size={14}
                        className={`mr-2 ${
                          isPinned ? 'fill-blue-400 text-blue-400' : ''
                        }`}
                      />
                      {isPinned ? 'Unpin Device' : 'Pin Device'}
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className='h-px bg-gray-200 my-1' />

                    <DropdownMenu.Item
                      className='flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer'
                      onSelect={() => onDelete && onDelete(device)}
                    >
                      <Trash size={14} className='mr-2' />
                      Delete Device
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Tooltip.Provider>
          </div>

          {(device.make || device.model) && (
            <div className='mt-1 text-xs text-gray-500'>
              {device.make} {device.model}
            </div>
          )}

          {device.tags && device.tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {device.tags.map((tag, index) => (
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

        <div className='px-4 py-3 bg-gray-50 text-sm'>
          <div className='flex justify-between items-center'>
            <div className='text-gray-600'>
              {device.ip && (
                <div className='flex items-center'>
                  {device.ip}:{device.port || '-'}
                </div>
              )}
            </div>

            <div className='flex items-center text-gray-500'>
              <Clock size={14} className='mr-1' />
              <span className='text-xs'>
                {device.lastSeen
                  ? formatTimeAgo(device.lastSeen)
                  : 'Never seen'}
              </span>
            </div>
          </div>

          <div className='mt-2 flex justify-between'>
            <div className='flex items-center'>
              {device.enabled ? (
                <span className='flex items-center text-xs text-green-600'>
                  <CheckCircle size={14} className='mr-1' />
                  Online
                </span>
              ) : (
                <span className='flex items-center text-xs text-red-600'>
                  <AlertCircle size={14} className='mr-1' />
                  Offline
                </span>
              )}
            </div>

            <Link
              to={`/devices/${device._id}`}
              className='text-xs text-blue-600 hover:text-blue-800 flex items-center'
            >
              Details
              <ChevronRight size={14} className='ml-1' />
            </Link>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
};

export default DeviceCard;
