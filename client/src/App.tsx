import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import DeviceManagement from './pages/DeviceManagement';
import { DeviceProvider } from './contexts/DeviceContext';
import MainLayout from './layouts/MainLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import ProfileEditor from './pages/ProfileEditor';
import ProfileManagement from './pages/ProfileManagement';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DeviceProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path='/' element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path='devices'>
                    <Route index element={<DeviceManagement />} />
                    <Route path=':deviceId' element={<DeviceDetails />} />
                  </Route>
                  <Route path='profiles'>
                    <Route index element={<ProfileManagement />} />
                    <Route path='new' element={<ProfileEditor />} />
                    <Route path=':profileId' element={<ProfileEditor />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </DeviceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
