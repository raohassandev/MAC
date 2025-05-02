import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Simple loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if we've been redirected from login (to avoid loops)
  const fromLogin = window.location.search.includes('from=login');
  
  // Only redirect if not authenticated AND not coming from login page
  if (!isAuthenticated && !fromLogin) {
    return <Navigate to='/login' replace />;
  }
  
  // If authenticated or coming from login, show the protected content
  return <Outlet />;
};

export default ProtectedRoute;
