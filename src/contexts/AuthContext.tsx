import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchPerson } from '../services/persons';
import type { PersonResponse } from '../services/persons';

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  phone?: string;
  cellPhone?: string;
  homePhone?: string;
  dateOfBirth?: string;
  sex?: string;
  age?: number;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
  personNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
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

const STORAGE_KEY = 'medstation_user';

function mapPersonToUser(person: PersonResponse): User {
  const firstName = person.firstName ?? '';
  const lastName = person.lastName ?? '';
  const name = [firstName, lastName].filter(Boolean).join(' ');

  return {
    id: person.id,
    name,
    firstName,
    lastName,
    email: person.email ?? '',
    phone: person.cellPhone ?? person.phone ?? '',
    cellPhone: person.cellPhone ?? '',
    homePhone: person.homePhone ?? '',
    dateOfBirth: person.dateOfBirth ?? '',
    sex: person.sex ?? '',
    age: person.age,
    addressLine1: person.addressLine1 ?? '',
    city: person.city ?? '',
    state: person.state ?? '',
    zip: person.zip ?? '',
    personNumber: person.personNumber ?? '',
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(() => {
    const personId = import.meta.env.VITE_PERSON_ID?.trim();
    const saved = localStorage.getItem(STORAGE_KEY);
    return !!personId && !saved;
  });

  useEffect(() => {
    const personId = import.meta.env.VITE_PERSON_ID?.trim();
    if (!personId) return;

    let cancelled = false;

    fetchPerson(personId)
      .then((person) => {
        if (cancelled) return;
        const userData = mapPersonToUser(person);
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      })
      .catch((err) => {
        console.error('Failed to fetch person:', err);
        // keep cached user if available
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Stub – replace with real API call
    if (email && password) {
      const userData: User = {
        id: '1',
        name: 'John Doe',
        email,
        phone: '(555) 555-5555',
        dateOfBirth: '09/08/1977',
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Stub – replace with real API call
    if (data.email && data.password && data.name) {
      const userData: User = {
        id: '1',
        name: data.name,
        email: data.email,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register }}>
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
