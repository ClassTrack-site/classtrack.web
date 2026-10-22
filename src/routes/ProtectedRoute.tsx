import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#0EA5E9]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-500 tracking-tight">
          Cargando ClassTrack...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/?login=true" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
