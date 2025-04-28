// Pages
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import DeviceManagement from './pages/DeviceManagement';
// Layouts
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import ProfileEditor from './pages/ProfileEditor';
import ProfileManagement from './pages/ProfileManagement';
import { createBrowserRouter } from 'react-router-dom';

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'devices',
        children: [
          {
            index: true,
            element: <DeviceManagement />,
          },
          {
            path: ':deviceId',
            element: <DeviceDetails />,
          },
        ],
      },
      {
        path: 'profiles',
        children: [
          {
            index: true,
            element: <ProfileManagement />,
          },
          {
            path: 'new',
            element: <ProfileEditor />,
          },
          {
            path: ':profileId',
            element: <ProfileEditor />,
          },
        ],
      },
      // Other routes will be added here
    ],
  },
]);

export default router;
