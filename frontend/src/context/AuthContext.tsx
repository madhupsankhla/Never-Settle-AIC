import React, { createContext, useContext, useState } from 'react';
import { type UserAccount, PREDEFINED_USERS, authenticateUser } from '../types/authTypes';
import type { PersonaType } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  quickLogin: (persona: PersonaType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'solesight_authenticated_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const valid = PREDEFINED_USERS.find((u) => u.id === parsed.id);
        if (valid) return valid;
      }
    } catch {
      // Fallback
    }
    // Default logged in user or null
    return PREDEFINED_USERS[0];
  });

  const isAuthenticated = currentUser !== null;

  const login = (identifier: string, password: string): { success: boolean; error?: string } => {
    const user = authenticateUser(identifier, password);
    if (!user) {
      return {
        success: false,
        error: 'Invalid username or password. Please verify your credentials and try again.',
      };
    }
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage errors
    }
    return { success: true };
  };

  const quickLogin = (persona: PersonaType) => {
    const user = PREDEFINED_USERS.find((u) => u.persona === persona) || PREDEFINED_USERS[0];
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
