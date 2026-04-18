import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  // Set up global logout event handler
  useEffect(() => {
    global.authLogoutEvent = handleLogoutEvent;
    return () => {
      global.authLogoutEvent = undefined;
    };
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Try to restore token and fetch user data
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.warn('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { access_token, user: userData } = response.data;

      // Store token and user data
      await AsyncStorage.setItem('authToken', access_token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { access_token, user: userData } = response.data;

      // Store token and user data
      await AsyncStorage.setItem('authToken', access_token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call result
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    }
  }, []);

  const handleLogoutEvent = useCallback(() => {
    logout();
  }, [logout]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const response = await api.patch<User>('/users/profile', data);
      const updatedUser = response.data;

      // Update state and storage
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get<User>('/users/me');
      const userData = response.data;

      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
