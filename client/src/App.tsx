import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from './router';

function App() {
  return (
    <AuthProvider>
      <DeviceProvider>
        <RouterProvider router={router} />
        <ToastContainer position='top-right' autoClose={5000} />
      </DeviceProvider>
    </AuthProvider>
  );
}

export default App;
