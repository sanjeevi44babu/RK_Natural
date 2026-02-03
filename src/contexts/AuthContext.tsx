import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, LoginCredentials, SignUpData, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignUpData) => Promise<boolean>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Admin User',
    email: 'admin@naturecure.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    isActive: true,
    isApproved: true,
  },
  {
    id: '2',
    fullName: 'Dr. Olivia Turner',
    email: 'doctor@naturecure.com',
    role: 'doctor',
    specialization: 'Cardiologist',
    createdAt: new Date().toISOString(),
    isActive: true,
    isApproved: true,
  },
  {
    id: '3',
    fullName: 'Sarah Mitchell',
    email: 'supervisor@naturecure.com',
    role: 'supervisor',
    createdAt: new Date().toISOString(),
    isActive: true,
    isApproved: true,
  },
  {
    id: '4',
    fullName: 'Emily Davidson',
    email: 'physio@naturecure.com',
    role: 'physiotherapist',
    specialization: 'Sports Therapy',
    createdAt: new Date().toISOString(),
    isActive: true,
    isApproved: true,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const signup = useCallback(async (data: SignUpData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role || 'doctor', // Role from signup or default
      dateOfBirth: data.dateOfBirth,
      createdAt: new Date().toISOString(),
      isActive: true,
      isApproved: false, // New users need admin approval
    };
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('auth_user');
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, role };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  }, [authState.user]);

  const updateUser = useCallback((updatedUser: User) => {
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }, []);

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, setUserRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
