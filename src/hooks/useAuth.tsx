import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { storageService } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (params: {
    fullName: string;
    email: string;
    password: string;
    school: string;
    classGrade: string;
    country: string;
    subjects: string[];
    role: UserRole;
  }) => Promise<UserProfile>;
  logout: () => void;
  updateUserSubjects: (subjects: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load initial user session
    const saved = storageService.getCurrentUser();
    if (saved) {
      setUser(saved);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _pass: string): Promise<UserProfile> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // Smooth UX transition delay

    // Admin secret demo check
    const isAdmin = email.toLowerCase().includes('admin');
    const existing = storageService.getCurrentUser();

    let loggedInUser: UserProfile;

    if (isAdmin) {
      loggedInUser = {
        uid: 'admin-001',
        fullName: 'WAEC Academic Administrator',
        email,
        role: 'admin',
        country: 'The Gambia',
        school: 'WAEC Regional HQ',
        createdAt: new Date().toISOString(),
      };
    } else if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      loggedInUser = existing;
    } else {
      loggedInUser = {
        uid: 'user-' + Date.now(),
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: email.toLowerCase().includes('teacher') ? 'teacher' : 'student',
        country: 'The Gambia',
        school: 'Gambia Senior Secondary School',
        classGrade: 'SSS 3 (WASSCE Candidate)',
        subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology'],
        createdAt: new Date().toISOString(),
      };
    }

    setUser(loggedInUser);
    storageService.saveUserSession(loggedInUser);
    setLoading(false);
    return loggedInUser;
  };

  const register = async (params: {
    fullName: string;
    email: string;
    password: string;
    school: string;
    classGrade: string;
    country: string;
    subjects: string[];
    role: UserRole;
  }): Promise<UserProfile> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    // Security requirement: Never allow users to assign themselves Admin
    const safeRole: UserRole = params.role === 'admin' ? 'student' : params.role;

    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      fullName: params.fullName,
      email: params.email,
      role: safeRole,
      school: params.school,
      classGrade: params.classGrade,
      country: params.country,
      subjects: params.subjects,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    storageService.saveUserSession(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    storageService.clearUserSession();
  };

  const updateUserSubjects = (subjects: string[]) => {
    if (!user) return;
    const updated = { ...user, subjects };
    setUser(updated);
    storageService.saveUserSession(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserSubjects }}>
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
