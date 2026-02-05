import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  registrationKey?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medstation_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated login - replace with real API call
    if (email && password) {
      const userData: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        phone: '(555) 555-5555',
        dateOfBirth: '09/08/1977',
      };
      setUser(userData);
      localStorage.setItem('medstation_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medstation_user');
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulated registration - replace with real API call
    if (data.email && data.password && data.name) {
      const userData: User = {
        id: '1',
        name: data.name,
        email: data.email,
      };
      setUser(userData);
      localStorage.setItem('medstation_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
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
