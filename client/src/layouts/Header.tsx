import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  return (
    <header className='bg-white shadow-sm z-10'>
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center'>
          <button
            onClick={toggleSidebar}
            className='text-gray-500 focus:outline-none focus:text-gray-700 md:hidden'
          >
            <Menu size={20} />
          </button>
          <h1 className='text-xl font-semibold text-gray-700 ml-2 md:ml-0'>
            MACSYS
          </h1>
        </div>

        <div className='flex items-center space-x-3'>
          {/* Notifications */}
          <div className='relative'>
            <button
              onClick={toggleNotifications}
              className='relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none'
            >
              <Bell size={20} />
              <span className='absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full'></span>
            </button>

            {notificationsOpen && (
              <div className='absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20'>
                <div className='py-2 px-3 bg-gray-100 border-b border-gray-200'>
                  <p className='text-sm font-medium text-gray-700'>
                    Notifications
                  </p>
                </div>
                <div className='max-h-64 overflow-y-auto'>
                  <div className='py-2 px-3 border-b border-gray-200 hover:bg-gray-50'>
                    <p className='text-sm text-gray-700'>
                      System alert: High CPU usage detected
                    </p>
                    <p className='text-xs text-gray-500'>5 minutes ago</p>
                  </div>
                  <div className='py-2 px-3 border-b border-gray-200 hover:bg-gray-50'>
                    <p className='text-sm text-gray-700'>
                      Maintenance scheduled for tomorrow
                    </p>
                    <p className='text-xs text-gray-500'>2 hours ago</p>
                  </div>
                  <div className='py-2 px-3 hover:bg-gray-50'>
                    <p className='text-sm text-gray-700'>
                      New software update available
                    </p>
                    <p className='text-xs text-gray-500'>1 day ago</p>
                  </div>
                </div>
                <div className='py-2 px-3 text-center text-sm text-blue-500 hover:bg-gray-50 cursor-pointer'>
                  View all notifications
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className='relative'>
            <button
              onClick={toggleUserMenu}
              className='flex items-center text-gray-500 focus:outline-none'
            >
              <span className='hidden md:block mr-2 text-sm'>
                {user?.username}
              </span>
              <div className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white'>
                <User size={16} />
              </div>
            </button>

            {userMenuOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'>
                <a
                  href='/profile'
                  className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  <User size={16} className='mr-2' />
                  Profile
                </a>
                <a
                  href='/settings'
                  className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  <Settings size={16} className='mr-2' />
                  Settings
                </a>
                <button
                  onClick={logout}
                  className='flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  <LogOut size={16} className='mr-2' />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
