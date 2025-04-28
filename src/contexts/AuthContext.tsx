import React, { ReactNode, createContext, useEffect, useState } from 'react';

type UserRole = 'user' | 'engineer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a stored token or session
    const checkAuth = async () => {
      try {
        // In a real app, you would verify the token with your backend
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // In a real app, you would validate credentials with your backend
      // This is mock data for demonstration
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        permissions: [
          'manage_devices',
          'manage_profiles',
          'manage_users',
          'view_analytics',
        ],
      };

      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
