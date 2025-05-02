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

// Demo user for testing
const DEMO_USER = {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      // Create a simple demo user without making API calls
      setUser(DEMO_USER);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Use a demo token
      const demoToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', demoToken);
      setToken(demoToken);
      
      // Set demo user for all logins in development mode
      setUser(DEMO_USER);
      
      toast.success('Login successful!');
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
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // Simulate API call
      setUser(user ? { ...user, ...userData } : null);
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
