import './App.css';

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import DeviceManagement from './pages/DeviceManagement';
import Login from './pages/Login';
import ProfileManagement from './pages/ProfileManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path='devices' element={<DeviceManagement />} />
            <Route path='devices/:id' element={<DeviceDetails />} />
            <Route path='profiles' element={<ProfileManagement />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
