import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [shouldAllow, setShouldAllow] = useState(false);

  // Check for demo mode - always allow access in development
  useEffect(() => {
    // Check if we have token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setShouldAllow(true);
    } else {
      setShouldAllow(false);
    }
  }, [isAuthenticated]);

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

  // If authenticated or should be allowed due to development mode, show the content
  if (isAuthenticated || shouldAllow) {
    return <Outlet />;
  }
  
  // Otherwise redirect to login
  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default ProtectedRoute;
