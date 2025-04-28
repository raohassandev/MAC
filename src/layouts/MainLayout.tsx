import {
  Bell,
  Calendar,
  FileCode,
  HardDrive,
  LayoutGrid,
  Menu,
  Settings,
  ShieldCheck,
  Thermometer,
  Tool,
  User,
  X,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const MainLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`bg-indigo-800 text-white w-64 fixed h-full transition-all duration-300 ease-in-out z-30 ${
          sidebarOpen ? 'left-0' : '-left-64'
        }`}
      >
        <div className='p-4 flex justify-between items-center border-b border-indigo-700'>
          <h1 className='text-xl font-bold'>MacSys</h1>
          <button
            onClick={toggleSidebar}
            className='p-1 rounded-md hover:bg-indigo-700 md:hidden'
          >
            <X size={20} />
          </button>
        </div>

        <nav className='mt-4'>
          <NavItem to='/' icon={<LayoutGrid size={18} />} label='Dashboard' />
          <NavItem
            to='/devices'
            icon={<HardDrive size={18} />}
            label='Devices'
          />
          <NavItem
            to='/profiles'
            icon={<Thermometer size={18} />}
            label='Cooling Profiles'
          />
          <NavItem
            to='/schedules'
            icon={<Calendar size={18} />}
            label='Schedules'
          />
          <NavItem
            to='/templates'
            icon={<FileCode size={18} />}
            label='Templates'
          />
          <NavItem
            to='/settings'
            icon={<Settings size={18} />}
            label='Settings'
          />

          {/* Conditional sections based on user role */}
          {user?.role === 'engineer' && (
            <div className='mt-4'>
              <div className='px-4 py-2 text-xs uppercase text-indigo-300'>
                Deployment
              </div>
              <NavItem
                to='/deployment'
                icon={<Tool size={18} />}
                label='System Config'
              />
            </div>
          )}

          {user?.role === 'admin' && (
            <div className='mt-4'>
              <div className='px-4 py-2 text-xs uppercase text-indigo-300'>
                Administration
              </div>
              <NavItem
                to='/admin/users'
                icon={<ShieldCheck size={18} />}
                label='Management'
              />
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className='bg-white shadow-sm flex justify-between items-center h-16 px-4'>
          <button
            onClick={toggleSidebar}
            className='p-2 rounded-md hover:bg-gray-100'
          >
            <Menu size={20} />
          </button>

          <div className='flex items-center space-x-4'>
            <button className='p-2 rounded-full hover:bg-gray-100 relative'>
              <Bell size={20} />
              <span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full'></span>
            </button>

            <div className='flex items-center'>
              <div className='w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white'>
                <User size={16} />
              </div>
              <span className='ml-2'>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className='p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 text-sm ${
        isActive
          ? 'bg-indigo-900 text-white'
          : 'text-indigo-100 hover:bg-indigo-700'
      }`
    }
    end={to === '/'}
  >
    <span className='mr-3'>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default MainLayout;
