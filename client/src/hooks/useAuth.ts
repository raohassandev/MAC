import { AuthContext } from '../contexts/AuthContext';
import { User } from '../types/user.types';
// src/hooks/useAuth.ts
import { useContext } from 'react';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser?: (userData: Partial<User>) => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context as AuthContextType;
};
