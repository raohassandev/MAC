import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import DeviceManagement from './pages/DeviceManagement';
// Pages
import Login from './pages/Login';
// Layouts
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import ProfileEditor from './pages/ProfileEditor';
import ProfileForm from './components/profiles/ProfileForm';
import ProfileManagement from './pages/ProfileManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
// client/src/App.tsx
import React from 'react';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
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
              <Route path='*' element={<NotFound />} />
            </Route>
          </Route>

          {/* Redirect to login if no route matches */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
