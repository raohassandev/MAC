import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { useEffect } from 'react';
import { initDemoAuth } from './utils/demoAuth';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import DeviceManagement from './pages/DeviceManagement';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import ProfileEditor from './pages/ProfileEditor';
import ProfileManagement from './pages/ProfileManagement';
import Register from './pages/Register';
import Settings from './pages/Settings';
import SystemMonitor from './pages/SystemMonitor';
import TemplatesPage from './pages/Template';

function App() {
  // Initialize demo authentication on component mount
  useEffect(() => {
    initDemoAuth();
  }, []);

  return (
    <AuthProvider>
      <DeviceProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='devices'>
              <Route index element={<DeviceManagement />} />
              <Route path=':deviceId' element={<DeviceDetails />} />
            </Route>
            <Route path='profiles'>
              <Route index element={<ProfileManagement />} />
              <Route path='new' element={<ProfileEditor />} />
              <Route path=':profileId' element={<ProfileEditor />} />
            </Route>
            <Route path='templates' element={<TemplatesPage />} />
            <Route path='system' element={<SystemMonitor />} />
            <Route path='settings' element={<Settings />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </DeviceProvider>
    </AuthProvider>
  );
}

export default App;
