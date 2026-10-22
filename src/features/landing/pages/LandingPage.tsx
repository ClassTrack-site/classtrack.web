import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { Button, Card, Badge } from '@/shared/components/ui';
import { LoginModal } from '@/features/auth/components/LoginModal';
import {
  School,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  Users,
  Smartphone,
  ArrowRight,
  Bell,
  Sparkles,
  Calendar,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, activeProfile, user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setIsLoginModalOpen(true);
    }
  }, [searchParams]);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      if (user?.isGlobalAdmin) navigate('/admin/dashboard');
      else if (activeProfile?.role === 'teacher') navigate('/teacher/today');
      else if (activeProfile?.role === 'school_admin') navigate('/dashboard');
      else navigate('/student/schedule');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* iOS Translucent Header Bar */}
      <header className="sticky top-0 z-50 w-full ios-glass border-b border-black/[0.04] transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="ClassTrack"
              className="h-8 w-auto object-contain"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#0EA5E9] transition-colors">Características</a>
            <a href="#roles" className="hover:text-[#0EA5E9] transition-colors">Perfiles y Roles</a>
            <a href="#security" className="hover:text-[#0EA5E9] transition-colors">Seguridad Multi-Tenant</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCtaClick}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              className="font-bold shadow-sky-500/20"
            >
              {isAuthenticated ? 'Ir a mi Panel' : 'Iniciar Sesión'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-ios-slide">
          {/* Emblema Oficial ClassTrack */}
          <div className="flex justify-center">
            <img
              src="/favicon.png"
              alt="ClassTrack Icon"
              className="h-20 w-20 rounded-3xl object-contain shadow-xl shadow-sky-500/20 border border-sky-100/80 bg-white p-1"
            />
          </div>

          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-100/80 border border-sky-200/60 rounded-full text-xs font-bold text-[#0369A1] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>ClassTrack v1.0 • Plataforma Escolar Multi-Tenant</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            La gestión escolar ágil, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              horarios sin cruces
            </span>{' '}
            y control en tiempo real.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Diseñada con estilo táctil <strong>Mobile-First tipo iOS</strong> para que directores y docentes tomen asistencia en menos de 10 segundos, gestionen la regla de 72 horas y automaticen avisos a familias.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-8 font-extrabold shadow-lg shadow-sky-500/25"
              leftIcon={<School className="h-5 w-5" />}
            >
              {isAuthenticated ? 'Acceder a mi Panel' : 'Iniciar Sesión en ClassTrack'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto font-bold bg-white text-slate-700"
            >
              Probar Cuentas Demo
            </Button>
          </div>

          {/* Interactive Mock Preview Card (iOS Look) */}
          <div className="pt-8 max-w-lg md:max-w-xl mx-auto">
            <Card className="p-4 sm:p-5 text-left border-black/[0.06] shadow-xl shadow-slate-900/5 relative overflow-hidden bg-white/95 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">Planilla en Vivo • San José (9-A)</span>
                </div>
                <Badge variant="warning" size="sm" dot>
                  Ventana 72h activa
                </Badge>
              </div>

              <div className="pt-3 space-y-2">
                {[
                  { name: 'Sofía Martínez Gómez', status: 'present', label: '[P] Presente' },
                  { name: 'Valentina Restrepo Torres', status: 'absent', label: '[A] Ausente' },
                  { name: 'Mateo Alejandro Rodríguez', status: 'late', label: '[T] Tarde' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <Badge variant={item.status as any} size="sm">
                      {item.label}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>⚡ Guardado atómico en base de datos</span>
                <span className="font-bold text-[#0EA5E9]">Fórmula Oficial: 95.5%</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-16 bg-white px-4 border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="sky">Arquitectura y Negocio</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Diseñada para la realidad del colegio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Elimina los retrasos burocráticos y centraliza la vida académica en una sola herramienta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 space-y-3 bg-[#F8FAFC] border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-[#E0F2FE] text-[#0EA5E9] flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Mobile-First Táctil (iOS)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sin tablas con scroll horizontal. Los docentes marcan asistencia con botones rápidos [P], [T], [A], [E] desde su celular en segundos.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-[#F8FAFC] border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Regla Estricta de las 72 Horas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bloqueo automático de edición extemporánea. Toda modificación posterior exige justificación obligatoria y auditoría inmutable.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-[#F8FAFC] border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Horarios sin Cruces de Recursos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                El motor previene solapamiento de docentes, aulas ocupadas o grupos con clases simultáneas en tiempo real.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-[#F8FAFC] border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-rose-100 text-[#DC2626] flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Alertas Automáticas (n8n)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cortesía de 30 minutos para corregir tardanzas antes de despachar webhooks por WhatsApp o correo a los padres de familia.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-[#F8FAFC] border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Informes Oficiales en Excel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exportación en un clic con dos hojas: Resumen con % de asistencia y Detalle histórico sesión por sesión con autoría de cambios.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-[#F8FAFC] border-slate-100">
              <div className="h-10 w-10 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Aislamiento Multi-Tenant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada institución cuenta con su propio esquema independiente en PostgreSQL (Supabase), garantizando privacidad y seguridad total.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="sky">Matriz de Acceso</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Una experiencia a la medida de cada rol
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Permisos estrictos y vistas optimizadas para el personal académico.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 space-y-2 text-center bg-white">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 text-[#0EA5E9] mx-auto flex items-center justify-center">
              <School className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Rector / Admin</h4>
            <p className="text-xs text-slate-500">
              Gestión total de usuarios, grupos, aulas, horarios semanales, calendario escolar y reportes analíticos.
            </p>
          </Card>

          <Card className="p-5 space-y-2 text-center bg-white">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-[#16A34A] mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Director de Grupo</h4>
            <p className="text-xs text-slate-500">
              Monitoreo integral de todas las materias de su salón y facultad de corregir asistencia <strong>sin límite de 72h</strong>.
            </p>
          </Card>

          <Card className="p-5 space-y-2 text-center bg-white">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-[#D97706] mx-auto flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Docente Titular</h4>
            <p className="text-xs text-slate-500">
              Vista "Mis Clases de Hoy", planilla rápida táctil de asistencia y control de ventana cronológica de 72 horas.
            </p>
          </Card>

          <Card className="p-5 space-y-2 text-center bg-white">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Super Admin SaaS</h4>
            <p className="text-xs text-slate-500">
              Aprovisionamiento automático de nuevos colegios con esquemas DDL en la base de datos de la nube.
            </p>
          </Card>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-tr from-sky-600 to-sky-500 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-sky-500/20">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Comienza a gestionar tu institución educativa hoy
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            Accede a la plataforma con tu correo institucional y experimenta la rapidez del sistema de asistencia de ClassTrack.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCtaClick}
              className="w-full sm:w-auto font-black bg-white text-[#0369A1] hover:bg-slate-100"
              leftIcon={<School className="h-5 w-5" />}
            >
              {isAuthenticated ? 'Abrir mi Panel' : 'Iniciar Sesión'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-black/[0.04] text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="ClassTrack" className="h-6 w-6 rounded-lg object-contain" />
            <span className="font-bold text-slate-700">ClassTrack</span>
            <span>— Todos los derechos reservados © 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="hover:text-slate-800 transition-colors font-medium cursor-pointer"
            >
              Acceso a Usuarios
            </button>
            <a href="#features" className="hover:text-slate-800 transition-colors font-medium">
              Manual y Guía
            </a>
          </div>
        </div>
      </footer>

      {/* Modal / BottomSheet de Inicio de Sesión */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
