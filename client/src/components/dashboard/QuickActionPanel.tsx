import {
  BarChart,
  Bell,
  Download,
  FileText,
  HardDrive,
  Plus,
  RefreshCw,
  Settings,
  User,
} from 'lucide-react';

import React from 'react';

const QuickActionPanel: React.FC = () => {
  // In a real app, these actions would trigger actual functionality
  const handleAction = (action: string) => {
    console.log(`Quick action triggered: ${action}`);
    // Here you would implement the actual functionality
  };

  return (
    <div className='bg-white rounded-lg shadow-sm p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Quick Actions</h2>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4'>
        <ActionButton
          icon={<Plus size={20} />}
          label='Add Device'
          color='bg-blue-500'
          onClick={() => handleAction('add_device')}
        />

        <ActionButton
          icon={<RefreshCw size={20} />}
          label='Refresh Devices'
          color='bg-green-500'
          onClick={() => handleAction('refresh_devices')}
        />

        <ActionButton
          icon={<Settings size={20} />}
          label='Apply Profile'
          color='bg-purple-500'
          onClick={() => handleAction('apply_profile')}
        />

        <ActionButton
          icon={<Bell size={20} />}
          label='Check Alerts'
          color='bg-amber-500'
          onClick={() => handleAction('check_alerts')}
        />

        <ActionButton
          icon={<Download size={20} />}
          label='Export Data'
          color='bg-indigo-500'
          onClick={() => handleAction('export_data')}
        />

        <ActionButton
          icon={<User size={20} />}
          label='User Settings'
          color='bg-cyan-500'
          onClick={() => handleAction('user_settings')}
        />

        <ActionButton
          icon={<HardDrive size={20} />}
          label='Test Devices'
          color='bg-rose-500'
          onClick={() => handleAction('test_devices')}
        />

        <ActionButton
          icon={<FileText size={20} />}
          label='View Logs'
          color='bg-emerald-500'
          onClick={() => handleAction('view_logs')}
        />

        <ActionButton
          icon={<BarChart size={20} />}
          label='Reports'
          color='bg-orange-500'
          onClick={() => handleAction('view_reports')}
        />
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  color,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className='flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:shadow-md'
    >
      <div className={`p-3 rounded-full ${color} text-white mb-2`}>{icon}</div>
      <span className='text-xs font-medium text-gray-700'>{label}</span>
    </button>
  );
};

export default QuickActionPanel;
