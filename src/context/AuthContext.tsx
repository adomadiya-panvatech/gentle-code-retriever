
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  banned?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (storedToken && userData) {
      try {
        setUser(JSON.parse(userData));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      
      if (email === 'admin@tovi.com' && password === 'admin123') {
        const userData = {
          id: '1',
          name: 'Admin User',
          email: 'admin@tovi.com',
          role: 'admin',
        };

        const fakeToken = 'dev-token-123456';

        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(fakeToken);
      } else {
        throw new Error('Invalid credentials');
      }

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register(email, password, name);
      console.log('Registration successful:', response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
