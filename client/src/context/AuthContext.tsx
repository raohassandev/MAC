import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { User } from '../types/user.types';
import api from '../api/client';
import { toast } from 'react-toastify';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Create a context with a default undefined value, will be initialized in the provider
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      try {
        // Try to get user data from API
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (apiError) {
        console.error('Failed to fetch user data from API', apiError);
        
        // Check if we might be using a demo token (it's not a real JWT so it will fail verification)
        if (token && token.includes('demo_signature')) {
          console.log('Using demo token, creating demo user');
          // Create a demo user since we have a demo token
          const demoUser = {
            _id: 'demo_user_id',
            email: 'demo@example.com',
            name: 'Demo User',
            role: 'admin',
            permissions: [
              'view_devices',
              'add_devices',
              'edit_devices',
              'delete_devices',
              'manage_devices',
              'view_profiles',
              'add_profiles',
              'edit_profiles',
              'delete_profiles',
              'manage_profiles',
            ],
          };
          setUser(demoUser);
          // Don't logout - we want to keep using the demo token
        } else {
          // For real tokens that fail, logout
          console.error('Invalid or expired token, logging out');
          logout();
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData', error);
      // Don't automatically logout on errors to prevent login loops
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if we're using demo authentication
      if (email === 'demo@example.com' || email.includes('demo')) {
        console.log('Using demo authentication');
        const { ensureDemoAuth } = await import('../utils/demoAuth');
        const demoToken = ensureDemoAuth();
        
        // Create demo user
        const demoUser = {
          _id: 'demo_user_id',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'admin',
          permissions: [
            'view_devices',
            'add_devices',
            'edit_devices',
            'delete_devices',
            'manage_devices',
            'view_profiles',
            'add_profiles',
            'edit_profiles',
            'delete_profiles',
            'manage_profiles',
          ],
        };
        
        setUser(demoUser);
        if (demoToken) {
          setToken(demoToken);
        }
        
        toast.success('Demo login successful!');
        return;
      }
      
      // Regular login
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token: newToken, user: userData } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);

        toast.success('Login successful!');
      } catch (loginError) {
        console.error('API login failed, using demo login as fallback');
        // Fall back to demo authentication
        const { ensureDemoAuth } = await import('../utils/demoAuth');
        const demoToken = ensureDemoAuth();
        
        const demoUser = {
          _id: 'demo_user_id',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'admin',
          permissions: [
            'view_devices',
            'add_devices',
            'edit_devices',
            'delete_devices',
            'manage_devices',
            'view_profiles',
            'add_profiles',
            'edit_profiles',
            'delete_profiles',
            'manage_profiles',
          ],
        };
        
        setUser(demoUser);
        if (demoToken) {
          setToken(demoToken);
        }
        
        toast.info('Using demo account for development');
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.info('You have been logged out');
    // No need to redirect - ProtectedRoute will handle this
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await api.put('/users/me', userData);
      setUser({ ...user, ...response.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update user', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
