import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import router from './router';

/**
 * Main application component that provides context providers
 * and router setup for the application.
 */
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DeviceProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </DeviceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
