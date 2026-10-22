import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import type { Role } from '@/features/auth/interfaces/auth.types';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, activeProfile, hasRole } = useAuth();

  if (user?.isGlobalAdmin) {
    return <>{children}</>;
  }

  if (!activeProfile || !hasRole(allowedRoles)) {
    // Redirigir según el rol real que posea
    if (activeProfile?.role === 'teacher') return <Navigate to="/teacher/today" replace />;
    if (activeProfile?.role === 'school_admin') return <Navigate to="/dashboard" replace />;
    if (activeProfile?.role === 'student') return <Navigate to="/student/schedule" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
