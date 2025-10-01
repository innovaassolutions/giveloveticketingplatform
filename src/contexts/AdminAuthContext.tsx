'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  username: string;
  password: string;
  role: string;
}

interface AdminAuthContextType {
  isAuthenticated: (portal?: string) => boolean;
  currentUser: AdminUser | null;
  authenticate: (username: string, password: string, simpleMode?: boolean | string, portal?: string) => boolean;
  logout: (portal?: string) => void;
  getCurrentUser: (portal?: string) => AdminUser | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [portalSessions, setPortalSessions] = useState<Record<string, AdminUser>>({});

  // Define admin accounts with portal mapping
  const ADMIN_ACCOUNTS: AdminUser[] = [
    { username: 'ladyg', password: 'givelove2025', role: 'lady-gaga' },
    { username: 'garthb', password: 'givelove2025', role: 'garth-brooks' },
    { username: 'taylors', password: 'givelove2025', role: 'taylor-swift' },
    { username: 'dollyp', password: 'givelove2025', role: 'dolly-parton' },
    { username: 'admin', password: 'givelove2025', role: 'general' }, // For charity/investor access
  ];

  // Portal mapping for backwards compatibility
  const getPortalFromPath = (): string => {
    if (typeof window === 'undefined') return 'general';
    const path = window.location.pathname;
    if (path.includes('/artist/lady-gaga')) return 'lady-gaga';
    if (path.includes('/artist/garth-brooks')) return 'garth-brooks';
    if (path.includes('/artist/taylor-swift')) return 'taylor-swift';
    if (path.includes('/artist/dolly-parton')) return 'dolly-parton';
    return 'general'; // For charity, investor, general artist portal
  };

  // Load saved sessions on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('adminPortalSessions');
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        setPortalSessions(sessions);
      } catch (error) {
        console.error('Failed to parse saved sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminPortalSessions', JSON.stringify(portalSessions));
  }, [portalSessions]);

  const isAuthenticated = (portal?: string): boolean => {
    const targetPortal = portal || getPortalFromPath();
    return !!portalSessions[targetPortal];
  };

  const getCurrentUser = (portal?: string): AdminUser | null => {
    const targetPortal = portal || getPortalFromPath();
    return portalSessions[targetPortal] || null;
  };

  const authenticate = (username: string, password: string, simpleMode?: boolean | string, portal?: string): boolean => {
    // Handle backward compatibility: if simpleMode is a string, it's actually the portal parameter
    const isSimple = typeof simpleMode === 'boolean' ? simpleMode : false;
    const targetPortal = (typeof simpleMode === 'string' ? simpleMode : portal) || getPortalFromPath();

    // In simple mode, only check password (use 'admin' account with 'general' role)
    if (isSimple) {
      const generalUser = ADMIN_ACCOUNTS.find(account => account.role === 'general');
      if (generalUser && password === generalUser.password) {
        setPortalSessions(prev => ({
          ...prev,
          [targetPortal]: generalUser
        }));
        return true;
      }
      return false;
    }

    // Standard username + password authentication
    const user = ADMIN_ACCOUNTS.find(
      account => account.username === username && account.password === password
    );

    if (user) {
      // Check if user has permission for this portal
      if (user.role !== 'general' && user.role !== targetPortal) {
        return false; // User doesn't have access to this specific portal
      }

      setPortalSessions(prev => ({
        ...prev,
        [targetPortal]: user
      }));
      return true;
    }
    return false;
  };

  const logout = (portal?: string): void => {
    const targetPortal = portal || getPortalFromPath();
    setPortalSessions(prev => {
      const newSessions = { ...prev };
      delete newSessions[targetPortal];
      return newSessions;
    });
  };

  // For backwards compatibility, provide currentUser for the current portal
  const currentUser = getCurrentUser();

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      authenticate,
      logout,
      getCurrentUser
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}