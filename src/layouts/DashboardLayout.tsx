import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { TopNavBar } from '@/shared/components/navigation/TopNavBar';
import { BottomTabBar, type TabItem } from '@/shared/components/navigation/BottomTabBar';
import { BottomSheet, Badge, InsetGroup, InsetItem } from '@/shared/components/ui';
import {
  Calendar,
  Clock,
  Users,
  LayoutDashboard,
  BookOpen,
  LogOut,
  Building2,
  ChevronDown,
  School,
  GraduationCap,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, activeProfile, availableProfiles, switchProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [isSchoolSwitcherOpen, setIsSchoolSwitcherOpen] = useState(false);

  const role = activeProfile?.role;
  const isGlobalAdmin = user?.isGlobalAdmin;

  // Tabs de navegación para móvil según el rol
  const getMobileTabs = (): TabItem[] => {
    if (isGlobalAdmin) {
      return [
        { id: '/admin/dashboard', label: 'Colegios', icon: <Building2 className="h-5 w-5" /> },
      ];
    }

    if (role === 'teacher') {
      return [
        { id: '/teacher/today', label: 'Mis Clases', icon: <Calendar className="h-5 w-5" /> },
        { id: '/schedules', label: 'Horarios', icon: <Clock className="h-5 w-5" /> },
        ...(activeProfile?.isGroupDirector
          ? [{ id: '/teacher/my-group', label: 'Mi Grupo 9-A', icon: <GraduationCap className="h-5 w-5" /> }]
          : []),
      ];
    }

    if (role === 'school_admin') {
      return [
        { id: '/dashboard', label: 'Inicio', icon: <LayoutDashboard className="h-5 w-5" /> },
        { id: '/users', label: 'Usuarios', icon: <Users className="h-5 w-5" /> },
        { id: '/academic', label: 'Académico', icon: <BookOpen className="h-5 w-5" /> },
        { id: '/schedules', label: 'Horarios', icon: <Clock className="h-5 w-5" /> },
      ];
    }

    return [
      { id: '/student/schedule', label: 'Mi Horario', icon: <Calendar className="h-5 w-5" /> },
    ];
  };

  const mobileTabs = getMobileTabs();
  const activeTabId = mobileTabs.find((t) => location.pathname.startsWith(t.id))?.id || mobileTabs[0]?.id;

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-sans pb-20 sm:pb-8">
      {/* Top Navigation Bar con Glassmorphism */}
      <TopNavBar
        leading={
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt="ClassTrack"
              className="h-8 w-8 rounded-xl object-contain shadow-xs"
            />
            <img
              src="/logo.png"
              alt="ClassTrack"
              className="h-7 w-auto object-contain hidden sm:inline"
            />
          </div>
        }
        centerNode={
          activeProfile ? (
            <button
              type="button"
              onClick={() => {
                if (availableProfiles.length > 1 || isGlobalAdmin) {
                  setIsSchoolSwitcherOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 hover:bg-white border border-black/[0.04] rounded-full shadow-xs active:scale-98 transition-all cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[150px] sm:max-w-[240px]">
                {activeProfile.schoolName}
              </span>
              {(availableProfiles.length > 1 || isGlobalAdmin) && (
                <ChevronDown className="h-3 w-3 text-slate-400" />
              )}
            </button>
          ) : isGlobalAdmin ? (
            <Badge variant="sky">Super Administrador SaaS</Badge>
          ) : null
        }
        trailing={
          <button
            type="button"
            onClick={() => setIsProfileSheetOpen(true)}
            className="h-8 w-8 rounded-full bg-sky-100 text-[#0369A1] font-bold text-xs flex items-center justify-center hover:bg-sky-200 transition-colors cursor-pointer border border-sky-200"
            aria-label="Perfil de usuario"
          >
            {user?.firstName?.charAt(0) || 'U'}
          </button>
        }
      />

      {/* Navegación Desktop (Píldoras tipo iOS debajo de TopBar) */}
      <div className="hidden sm:block border-b border-black/[0.04] bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto">
          {role === 'school_admin' && (
            <>
              <Link to="/dashboard" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname === '/dashboard' ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Dashboard</Link>
              <Link to="/users" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/users') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Usuarios</Link>
              <Link to="/academic" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/academic') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Académico</Link>
              <Link to="/schedules" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/schedules') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Horarios</Link>
              <Link to="/imports" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/imports') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Cargas Excel</Link>
              <Link to="/reports" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/reports') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Reportes</Link>
            </>
          )}

          {role === 'teacher' && (
            <>
              <Link to="/teacher/today" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/teacher') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Mis Clases de Hoy</Link>
              <Link to="/schedules" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/schedules') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Mi Horario</Link>
              {activeProfile?.isGroupDirector && (
                <Link to="/teacher/my-group" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/teacher/my-group') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Mi Grupo Dirigido (9-A)</Link>
              )}
            </>
          )}

          {isGlobalAdmin && (
            <Link to="/admin/dashboard" className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${location.pathname.startsWith('/admin') ? 'bg-[#0EA5E9] text-white shadow-xs' : 'text-slate-600 hover:bg-white/80'}`}>Colegios SaaS</Link>
          )}
        </div>
      </div>

      {/* Contenedor Principal de la Vista con animación de entrada fluida */}
      <main key={location.pathname} className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 animate-ios-slide">
        <Outlet />
      </main>

      {/* Barra de Navegación Inferior (Móvil) */}
      <BottomTabBar
        tabs={mobileTabs}
        activeTab={activeTabId}
        onChange={(tabId) => navigate(tabId)}
      />

      {/* BottomSheet de Perfil y Cierre de Sesión */}
      <BottomSheet
        isOpen={isProfileSheetOpen}
        onClose={() => setIsProfileSheetOpen(false)}
        title="Mi Perfil"
        subtitle={user?.email}
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white font-bold flex items-center justify-center text-sm shadow-xs shadow-sky-500/20">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {activeProfile ? `${activeProfile.role.toUpperCase()} • Doc: ${activeProfile.documentNumber || 'N/A'}` : 'Super Administrador'}
              </p>
            </div>
          </div>

          <InsetGroup title="Opciones de Sesión">
            <InsetItem
              title="Cerrar Sesión"
              icon={<LogOut className="h-4 w-4" />}
              iconBg="bg-rose-100 text-rose-600"
              clickable
              onClick={() => {
                setIsProfileSheetOpen(false);
                logout();
              }}
            />
          </InsetGroup>
        </div>
      </BottomSheet>

      {/* BottomSheet Selector de Colegio (Solo si tiene múltiples perfiles o Super Admin) */}
      <BottomSheet
        isOpen={isSchoolSwitcherOpen}
        onClose={() => setIsSchoolSwitcherOpen(false)}
        title="Cambiar de Colegio"
        subtitle="Selecciona la institución con la que deseas operar"
      >
        <div className="space-y-3">
          <InsetGroup>
            {availableProfiles.map((p) => {
              const isCurrent = p.schoolId === activeProfile?.schoolId;
              return (
                <InsetItem
                  key={p.schoolId}
                  title={p.schoolName}
                  subtitle={`Rol: ${p.role}`}
                  icon={<School className="h-4 w-4" />}
                  clickable={!isCurrent}
                  onClick={() => {
                    switchProfile(p);
                    setIsSchoolSwitcherOpen(false);
                  }}
                  trailing={
                    isCurrent ? (
                      <Badge variant="present" size="sm">Activo</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Seleccionar</Badge>
                    )
                  }
                />
              );
            })}
          </InsetGroup>
        </div>
      </BottomSheet>
    </div>
  );
};
