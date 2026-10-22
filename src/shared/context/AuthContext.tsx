import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserIdentity,
  UserSchoolProfile,
  LoginResponseDto,
  Role,
} from '@/features/auth/interfaces/auth.types';

interface AuthContextType {
  user: UserIdentity | null;
  activeProfile: UserSchoolProfile | null;
  availableProfiles: UserSchoolProfile[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginResponseDto) => void;
  switchProfile: (profile: UserSchoolProfile) => void;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  isGroupDirector: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserSchoolProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<UserSchoolProfile[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('classtrack_token');
      const storedUser = localStorage.getItem('classtrack_user');
      const storedActiveProfile = localStorage.getItem('classtrack_profile');
      const storedProfiles = localStorage.getItem('classtrack_profiles');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedActiveProfile) setActiveProfile(JSON.parse(storedActiveProfile));
        if (storedProfiles) setAvailableProfiles(JSON.parse(storedProfiles));
      }
    } catch (e) {
      console.error('Error restaurando sesión:', e);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (data: LoginResponseDto) => {
    setToken(data.accessToken);
    setUser(data.user);
    setActiveProfile(data.activeProfile);
    setAvailableProfiles(data.availableProfiles || []);

    localStorage.setItem('classtrack_token', data.accessToken);
    localStorage.setItem('classtrack_user', JSON.stringify(data.user));
    if (data.activeProfile) {
      localStorage.setItem('classtrack_profile', JSON.stringify(data.activeProfile));
    }
    if (data.availableProfiles) {
      localStorage.setItem('classtrack_profiles', JSON.stringify(data.availableProfiles));
    }
  };

  const switchProfile = (profile: UserSchoolProfile) => {
    setActiveProfile(profile);
    localStorage.setItem('classtrack_profile', JSON.stringify(profile));
    // Si cambia de colegio, recargar para refrescar contexto limpio
    window.location.reload();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setActiveProfile(null);
    setAvailableProfiles([]);
    localStorage.removeItem('classtrack_token');
    localStorage.removeItem('classtrack_user');
    localStorage.removeItem('classtrack_profile');
    localStorage.removeItem('classtrack_profiles');
    localStorage.removeItem('classtrack_override_slug');
    window.location.href = '/login';
  };

  const hasRole = (roles: Role[]): boolean => {
    if (!user) return false;
    if (user.isGlobalAdmin) return true;
    if (!activeProfile) return false;
    return roles.includes(activeProfile.role);
  };

  const isGroupDirector = Boolean(activeProfile?.isGroupDirector);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeProfile,
        availableProfiles,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        switchProfile,
        logout,
        hasRole,
        isGroupDirector,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
