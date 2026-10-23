import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, InsetGroup, InsetItem, Button } from '@/shared/components/ui';
import { Users, GraduationCap, School, Calendar, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import { sessionsService } from '@/features/sessions/services/sessions.service';
import type { DashboardStatsResponse } from '../interfaces/dashboard.types';
import type { SessionItem } from '@/features/sessions/interfaces/sessions.types';

export const SchoolAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [todaySessions, setTodaySessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsData, sessionsData] = await Promise.all([
          dashboardService.getStats(),
          sessionsService.getSessions({ limit: 10 }),
        ]);

        setStats(statsData);
        setTodaySessions(sessionsData.data || []);
      } catch (err: any) {
        console.error('Error cargando métricas del dashboard:', err);
        setError('No fue posible cargar las estadísticas institucionales.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3">
        <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Cargando métricas institucionales...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-center space-y-3 max-w-md mx-auto">
        <p className="text-sm font-semibold text-rose-600">{error || 'Error al obtener datos'}</p>
        <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: SessionItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="present">Completada</Badge>;
      case 'scheduled':
        return <Badge variant="sky">Programada</Badge>;
      case 'cancelled':
        return <Badge variant="absent">Cancelada</Badge>;
      case 'rescheduled':
        return <Badge variant="warning">Reprogramada</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Panel de Control Institucional
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {stats.school.name} ({stats.school.code}) • Fecha: {stats.today.date}
        </p>
      </div>

      {/* KPI Cards Estilo iOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estudiantes</span>
            <div className="h-8 w-8 rounded-xl bg-sky-100 text-[#0EA5E9] flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.counts.totalStudents}</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% Matriculados</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Docentes</span>
            <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.counts.totalTeachers}</p>
          <span className="text-[10px] text-slate-400">Activos en nómina</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Grupos</span>
            <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <School className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.counts.totalGroups}</p>
          <span className="text-[10px] text-slate-400">{stats.counts.totalClassrooms} Aulas activas</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Asistencia Semanal</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {stats.weeklyAttendanceRate.percentage.toFixed(1)}%
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">
            {stats.weeklyAttendanceRate.totalRecords} asistencias registradas
          </span>
        </Card>
      </div>

      {/* Sesiones de Hoy */}
      <div>
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Operación de Hoy ({todaySessions.length} {todaySessions.length === 1 ? 'sesión' : 'sesiones'})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/schedules')}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Ver Horarios
          </Button>
        </div>

        {todaySessions.length === 0 ? (
          <Card className="p-6 text-center text-xs text-slate-500">
            No hay clases programadas para el día de hoy en el calendario escolar.
          </Card>
        ) : (
          <InsetGroup>
            {todaySessions.map((session) => (
              <InsetItem
                key={session.id}
                title={`${session.subjectName} • ${session.groupName}`}
                subtitle={`${session.startTime.substring(0, 5)} - ${session.endTime.substring(0, 5)} • ${session.classroomName} • Docente: ${session.teacherFirstName} ${session.teacherLastName}`}
                icon={<Calendar className="h-4 w-4" />}
                trailing={
                  <div className="flex items-center gap-2">
                    {getStatusBadge(session.status)}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/sessions/${session.id}/attendance`)}
                    >
                      Asistencia
                    </Button>
                  </div>
                }
              />
            ))}
          </InsetGroup>
        )}
      </div>
    </div>
  );
};
