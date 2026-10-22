import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { authService } from '../services/auth.service';
import { Button, Input, Card, Badge, BottomSheet, InsetGroup, InsetItem } from '@/shared/components/ui';
import { School, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import type { LoginResponseDto, UserSchoolProfile } from '../interfaces/auth.types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selector condicional si el usuario pertenece a más de 1 colegio
  const [pendingLoginData, setPendingLoginData] = useState<LoginResponseDto | null>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSuccessfulLogin = (data: LoginResponseDto, selectedProfile?: UserSchoolProfile) => {
    const finalData = {
      ...data,
      activeProfile: selectedProfile || data.activeProfile,
    };
    login(finalData);

    // Redirigir según el rol del perfil activo
    if (finalData.user.isGlobalAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else if (finalData.activeProfile?.role === 'teacher') {
      navigate('/teacher/today', { replace: true });
    } else if (finalData.activeProfile?.role === 'school_admin') {
      navigate('/dashboard', { replace: true });
    } else if (finalData.activeProfile?.role === 'student') {
      navigate('/student/schedule', { replace: true });
    } else {
      navigate(from, { replace: true });
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

      // Si el usuario tiene múltiples colegios y no viene perfil asignado por defecto
      if (!data.activeProfile && data.availableProfiles?.length > 1) {
        setPendingLoginData(data);
        setIsSchoolModalOpen(true);
        setIsLoading(false);
        return;
      }

      handleSuccessfulLogin(data);
    } catch (err: any) {
      console.error('Error de login:', err);
      const msg =
        err.response?.data?.message ||
        'Credenciales inválidas o servicio no disponible. Verifica tus datos.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Error de autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logins para exploración interactiva directa si el backend aún no está arriba
  const handleQuickDemoLogin = (roleKey: 'rector' | 'teacher_director' | 'teacher_regular' | 'admin' | 'student') => {
    const demos: Record<string, LoginResponseDto> = {
      rector: {
        accessToken: 'mock_rector_jwt_token',
        user: {
          id: 'e21b7167-27b0-466d-a6aa-a3ce893b8214',
          email: 'rector@sanjose.edu.co',
          firstName: 'Carlos',
          lastName: 'Rector',
          isGlobalAdmin: false,
        },
        activeProfile: {
          userId: 'f8a91c23-4e56-4a7b-8c9d-0123456789ab',
          schoolId: 'd3b07384-d113-46fb-9b22-87f58a741369',
          schoolName: 'Colegio San José Demo',
          schoolSlug: 'sanjose',
          role: 'school_admin',
          isGroupDirector: false,
          documentNumber: '10000001',
        },
        availableProfiles: [],
      },
      teacher_director: {
        accessToken: 'mock_teacher_director_jwt_token',
        user: {
          id: 'u-teacher-1',
          email: 'profesor.mate@sanjose.edu.co',
          firstName: 'Mateo (Mate)',
          lastName: 'Director 9-A',
          isGlobalAdmin: false,
        },
        activeProfile: {
          userId: 'p-teacher-1',
          schoolId: 'd3b07384-d113-46fb-9b22-87f58a741369',
          schoolName: 'Colegio San José Demo',
          schoolSlug: 'sanjose',
          role: 'teacher',
          isGroupDirector: true,
          documentNumber: '20000001',
        },
        availableProfiles: [],
      },
      teacher_regular: {
        accessToken: 'mock_teacher_regular_jwt_token',
        user: {
          id: 'u-teacher-2',
          email: 'profesor.ciencias@sanjose.edu.co',
          firstName: 'Laura (Ciencias)',
          lastName: 'Docente Titular',
          isGlobalAdmin: false,
        },
        activeProfile: {
          userId: 'p-teacher-2',
          schoolId: 'd3b07384-d113-46fb-9b22-87f58a741369',
          schoolName: 'Colegio San José Demo',
          schoolSlug: 'sanjose',
          role: 'teacher',
          isGroupDirector: false,
          documentNumber: '20000002',
        },
        availableProfiles: [],
      },
      admin: {
        accessToken: 'mock_admin_jwt_token',
        user: {
          id: 'u-admin-global',
          email: 'admin@classtrack.site',
          firstName: 'Admin',
          lastName: 'Global',
          isGlobalAdmin: true,
        },
        activeProfile: null,
        availableProfiles: [],
      },
      student: {
        accessToken: 'mock_student_jwt_token',
        user: {
          id: 'u-student-1',
          email: 'estudiante1@sanjose.edu.co',
          firstName: 'Estudiante',
          lastName: 'San José 1',
          isGlobalAdmin: false,
        },
        activeProfile: {
          userId: 'p-student-1',
          schoolId: 'd3b07384-d113-46fb-9b22-87f58a741369',
          schoolName: 'Colegio San José Demo',
          schoolSlug: 'sanjose',
          role: 'student',
          isGroupDirector: false,
          documentNumber: '30000001',
        },
        availableProfiles: [],
      },
    };

    handleSuccessfulLogin(demos[roleKey]);
  };



  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        {/* Cabecera iOS con Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white items-center justify-center shadow-lg shadow-sky-500/25 mb-1">
            <School className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ClassTrack
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Gestión escolar, horarios y control de asistencia
          </p>
        </div>

        {/* Formulario Principal */}
        <Card className="shadow-lg shadow-black/[0.03] border-black/[0.04] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Correo Electrónico"
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
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#0EA5E9] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-bold"
              isLoading={isLoading}
              leftIcon={<LogIn className="h-4 w-4" />}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Accesos Rápidos de Prueba (Demo) */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 justify-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-sky-500" />
              <span>Explorar Vistas en 1 Clic (Demo)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher_director')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-2xl font-bold text-left active:scale-95 transition-all cursor-pointer border border-emerald-200/60"
              >
                🎓 Docente con Grupo
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Director 9-A • Monitoreo & 72h</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher_regular')}
                className="p-2.5 bg-teal-50 hover:bg-teal-100/80 text-teal-800 rounded-2xl font-bold text-left active:scale-95 transition-all cursor-pointer border border-teal-200/60"
              >
                👨‍🏫 Docente sin Grupo
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Prof. Ciencias • Solo sus clases</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rector')}
                className="p-2.5 bg-sky-50 hover:bg-sky-100/80 text-[#0369A1] rounded-2xl font-bold text-left active:scale-95 transition-all cursor-pointer border border-sky-200/60"
              >
                🏫 Rector (Admin)
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Dashboard, Usuarios, Horarios</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 bg-purple-50 hover:bg-purple-100/80 text-purple-800 rounded-2xl font-bold text-left active:scale-95 transition-all cursor-pointer border border-purple-200/60"
              >
                ⚡ Super Admin
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Gestión SaaS Colegios</span>
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal BottomSheet: Selector de Colegio (Solo si tiene múltiples perfiles) */}
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
    </div>
  );
};
