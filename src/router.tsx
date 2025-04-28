import AdminLayout from './layouts/AdminLayout';
import BackupRestore from './pages/deployment/BackupRestore';
import BrandingSettings from './pages/admin/BrandingSettings';
// Pages
import Dashboard from './pages/Dashboard';
import DeploymentLayout from './layouts/DeploymentLayout';
import DeviceDetails from './pages/DeviceDetails';
import DeviceManagement from './pages/DeviceManagement';
import DiagnosticTools from './pages/deployment/DiagnosticTools';
import FirmwareManagement from './pages/deployment/FirmwareManagement';
import LicensingManagement from './pages/admin/LicensingManagement';
// Layouts
import MainLayout from './layouts/MainLayout';
import NetworkSettings from './pages/deployment/NetworkSettings';
// Error Pages
import NotFound from './pages/NotFound';
import ProfileEditor from './pages/ProfileEditor';
import ProfileManagement from './pages/ProfileManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
// Deployment Engineer Pages
import SystemConfiguration from './pages/deployment/SystemConfiguration';
import TemplateManagement from './pages/TemplateManagement';
import UsageAnalytics from './pages/admin/UsageAnalytics';
// Administration Pages
import UserManagement from './pages/admin/UserManagement';
import UserSettings from './pages/UserSettings';
import { createBrowserRouter } from 'react-router-dom';

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
      {
        path: 'schedules',
        element: <ScheduleManagement />,
      },
      {
        path: 'templates',
        element: <TemplateManagement />,
      },
      {
        path: 'settings',
        element: <UserSettings />,
      },
      {
        path: 'deployment',
        element: <DeploymentLayout />,
        children: [
          {
            index: true,
            element: <SystemConfiguration />,
          },
          {
            path: 'network',
            element: <NetworkSettings />,
          },
          {
            path: 'diagnostics',
            element: <DiagnosticTools />,
          },
          {
            path: 'firmware',
            element: <FirmwareManagement />,
          },
          {
            path: 'backup',
            element: <BackupRestore />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            path: 'users',
            element: <UserManagement />,
          },
          {
            path: 'licensing',
            element: <LicensingManagement />,
          },
          {
            path: 'subscriptions',
            element: <SubscriptionManagement />,
          },
          {
            path: 'analytics',
            element: <UsageAnalytics />,
          },
          {
            path: 'branding',
            element: <BrandingSettings />,
          },
        ],
      },
    ],
  },
]);

export default router;
