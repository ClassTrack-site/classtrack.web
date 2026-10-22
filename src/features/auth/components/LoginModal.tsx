import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { authService } from '../services/auth.service';
import {
  Button,
  Input,
  Badge,
  BottomSheet,
  InsetGroup,
  InsetItem,
} from '@/shared/components/ui';
import { Mail, Lock, LogIn, AlertCircle, School } from 'lucide-react';
import type { LoginResponseDto, UserSchoolProfile } from '../interfaces/auth.types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selector condicional para multi-tenancy si el usuario pertenece a más de 1 colegio
  const [pendingLoginData, setPendingLoginData] = useState<LoginResponseDto | null>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  const handleSuccessfulLogin = (data: LoginResponseDto, selectedProfile?: UserSchoolProfile) => {
    const finalData = {
      ...data,
      activeProfile: selectedProfile || data.activeProfile,
    };
    login(finalData);
    onClose();

    // Redirección según rol institucional asignado en el token JWT
    if (finalData.user.isGlobalAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else if (finalData.activeProfile?.role === 'teacher') {
      navigate('/teacher/today', { replace: true });
    } else if (finalData.activeProfile?.role === 'school_admin') {
      navigate('/dashboard', { replace: true });
    } else if (finalData.activeProfile?.role === 'student') {
      navigate('/student/schedule', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await authService.login({ email, password });

      // Si el usuario pertenece a varios colegios y no tiene colegio asignado por defecto
      if (!data.activeProfile && data.availableProfiles?.length > 1) {
        setPendingLoginData(data);
        setIsSchoolModalOpen(true);
        setIsLoading(false);
        return;
      }

      handleSuccessfulLogin(data);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Credenciales inválidas o servicio no disponible. Verifica tus datos de acceso.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Error de autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Acceso a ClassTrack"
        subtitle="Ingresa con tus credenciales institucionales"
      >
        <div className="space-y-4">
          {/* Logo Oficial de ClassTrack */}
          <div className="text-center pb-1">
            <img
              src="/logo.png"
              alt="ClassTrack"
              className="h-10 w-auto object-contain mx-auto mb-1"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-150">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Correo Institucional"
              type="email"
              placeholder="tu.correo@colegio.edu.co"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <div>
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/forgot-password');
                  }}
                  className="text-xs font-semibold text-[#0EA5E9] hover:underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md shadow-sky-500/20"
              isLoading={isLoading}
              leftIcon={<LogIn className="h-4 w-4" />}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            <span>ClassTrack • Acceso Seguro por Cifrado JWT</span>
          </div>
        </div>
      </BottomSheet>

      {/* Selector de Colegio Condicional (Multi-Tenancy) */}
      <BottomSheet
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        title="Selecciona tu Institución"
        subtitle="Tu usuario tiene perfiles en varios colegios activos"
      >
        <div className="space-y-3">
          <InsetGroup>
            {pendingLoginData?.availableProfiles.map((profile) => (
              <InsetItem
                key={profile.schoolId}
                title={profile.schoolName}
                subtitle={`Rol: ${profile.role.toUpperCase()}`}
                icon={<School className="h-4 w-4" />}
                clickable
                onClick={() => {
                  setIsSchoolModalOpen(false);
                  if (pendingLoginData) {
                    handleSuccessfulLogin(pendingLoginData, profile);
                  }
                }}
                trailing={<Badge variant="sky">Ingresar</Badge>}
              />
            ))}
          </InsetGroup>
        </div>
      </BottomSheet>
    </>
  );
};
