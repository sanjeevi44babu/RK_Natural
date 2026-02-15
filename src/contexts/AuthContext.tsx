import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, LoginCredentials, SignUpData, AuthState } from '@/types';
import api, { setAuthToken, clearAuthToken } from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignUpData) => Promise<boolean>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  updateUser: (user: User) => void;
  staffAccounts: { email: string; password: string; userId: string }[];
  addStaffAccount: (email: string, password: string, userId: string) => void;
  patientAccounts: { email: string; password: string; userId: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes - staff only
const mockStaffUsers: User[] = [
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

// Demo patient accounts matching mockData patients
const defaultPatientAccounts = [
  { email: 'alex.bennett@email.com', password: 'patient123', userId: 'p1' },
  { email: 'michael.d@email.com', password: 'patient123', userId: 'p2' },
  { email: 'olivia.m@email.com', password: 'patient123', userId: 'p3' },
  { email: 'james.w@email.com', password: 'patient123', userId: 'p4' },
  { email: 'sarah.j@email.com', password: 'patient123', userId: 'p5' },
];

// Patient user records for login
const mockPatientUsers: User[] = [
  { id: 'p1', fullName: 'Alexander Bennett', email: 'alex.bennett@email.com', phone: '+1234567890', role: 'patient', createdAt: new Date().toISOString(), isActive: true, isApproved: true },
  { id: 'p2', fullName: 'Michael Davidson', email: 'michael.d@email.com', phone: '+1234567891', role: 'patient', createdAt: new Date().toISOString(), isActive: true, isApproved: true },
  { id: 'p3', fullName: 'Olivia Martinez', email: 'olivia.m@email.com', phone: '+1234567892', role: 'patient', createdAt: new Date().toISOString(), isActive: true, isApproved: true },
  { id: 'p4', fullName: 'James Wilson', email: 'james.w@email.com', phone: '+1234567893', role: 'patient', createdAt: new Date().toISOString(), isActive: true, isApproved: true },
  { id: 'p5', fullName: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1234567894', role: 'patient', createdAt: new Date().toISOString(), isActive: true, isApproved: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
  
  const [staffAccounts, setStaffAccounts] = useState<{ email: string; password: string; userId: string }[]>([]);
  const [patientAccounts, setPatientAccounts] = useState<{ email: string; password: string; userId: string }[]>(defaultPatientAccounts);
  const [dynamicUsers, setDynamicUsers] = useState<User[]>([]);

  const addStaffAccount = useCallback((email: string, password: string, userId: string) => {
    setStaffAccounts(prev => [...prev, { email, password, userId }]);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Try backend login first; fall back to mock data if backend is unavailable or returns error
    try {
      const res = await api.loginRequest('/auth/login', { email: credentials.email, password: credentials.password });
      if (res?.user) {
        if (res.token) setAuthToken(res.token);
        setAuthState({ user: res.user as User, isAuthenticated: true, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        return true;
      }
    } catch (e) {
      // continue to mock fallback
    }

    // Mock fallback (existing behaviour)
    await new Promise(resolve => setTimeout(resolve, 500));

    const demoUser = mockStaffUsers.find(u => u.email === credentials.email);
    if (demoUser && credentials.password === 'password') {
      setAuthState({ user: demoUser, isAuthenticated: true, isLoading: false });
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      return true;
    }

    const patientAccount = defaultPatientAccounts.find(p => p.email === credentials.email && p.password === credentials.password);
    if (patientAccount) {
      const patientUser = mockPatientUsers.find(u => u.id === patientAccount.userId);
      if (patientUser) {
        setAuthState({ user: patientUser, isAuthenticated: true, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(patientUser));
        return true;
      }
    }

    const staffAccount = staffAccounts.find(s => s.email === credentials.email && s.password === credentials.password);
    if (staffAccount) {
      const staffUser = dynamicUsers.find(u => u.id === staffAccount.userId);
      if (staffUser) {
        setAuthState({ user: staffUser, isAuthenticated: true, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(staffUser));
        return true;
      }
    }

    const dynPatientAccount = patientAccounts.find(p => p.email === credentials.email && p.password === credentials.password);
    if (dynPatientAccount) {
      const dynPatientUser = dynamicUsers.find(u => u.id === dynPatientAccount.userId);
      if (dynPatientUser) {
        setAuthState({ user: dynPatientUser, isAuthenticated: true, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(dynPatientUser));
        return true;
      }
    }

    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, [staffAccounts, dynamicUsers, patientAccounts]);

  const signup = useCallback(async (data: SignUpData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Try backend signup first; fall back to mock behaviour on failure
    try {
      const res = await api.apiPost('/auth/signup', data);
      if (res?.user) {
        if (res.token) setAuthToken(res.token);
        setAuthState({ user: res.user as User, isAuthenticated: true, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        return true;
      }
    } catch (e) {
      // continue to mock fallback
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const patientId = `pat${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;

    const newUser: User = {
      id: patientId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: 'patient',
      dateOfBirth: data.dateOfBirth,
      createdAt: new Date().toISOString(),
      isActive: true,
      isApproved: true,
    };

    setPatientAccounts(prev => [...prev, { email: data.email, password: data.password, userId: patientId }]);
    setDynamicUsers(prev => [...prev, newUser]);

    setAuthState({ user: newUser, isAuthenticated: true, isLoading: false });

    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('new_patient_signup', JSON.stringify({
      id: patientId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
    }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('auth_user');
    clearAuthToken();
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, role };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  }, [authState.user]);

  const updateUser = useCallback((updatedUser: User) => {
    setAuthState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }, []);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, setUserRole, updateUser, staffAccounts, addStaffAccount, patientAccounts }}>
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