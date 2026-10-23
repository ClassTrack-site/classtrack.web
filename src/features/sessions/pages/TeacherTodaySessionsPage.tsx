import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, InsetGroup, InsetItem } from '@/shared/components/ui';
import { Calendar, Clock, ChevronRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { sessionsService } from '../services/sessions.service';
import type { SessionItem } from '../interfaces/sessions.types';

export const TeacherTodaySessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile } = useAuth();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaySessions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Si el usuario es docente, el backend ya filtra o podemos enviar su teacherId
        const res = await sessionsService.getSessions({
          teacherId: activeProfile?.userId,
        });
        setSessions(res.data || []);
      } catch (err: any) {
        console.error('Error cargando sesiones del docente:', err);
        setError('No fue posible cargar tus clases del día.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodaySessions();
  }, [activeProfile?.userId]);

  const activeSession = sessions.length > 0 ? sessions[0] : null;
  const remainingSessions = sessions.length > 1 ? sessions.slice(1) : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Cargando tus clases programadas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center space-y-3 max-w-md mx-auto">
        <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
        <p className="text-sm font-semibold text-rose-600">{error}</p>
        <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-5 max-w-xl md:max-w-3xl mx-auto pb-12">
      {/* Resumen del Día */}
      <div className="px-1">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Mis Clases de Hoy
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No tienes clases asignadas hoy</h3>
          <p className="text-xs text-slate-500">
            Disfruta tu jornada o consulta la matriz completa de horarios escolares.
          </p>
          <div className="pt-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/schedules')}>
              Ver Mi Horario Semanal
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Clase Activa / Destacada */}
          {activeSession && (
            <Card glass className="border-sky-200/50 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={activeSession.status === 'completed' ? 'present' : 'sky'} size="sm">
                      {activeSession.status === 'completed' ? 'Asistencia Tomada' : 'En Curso / Programada'}
                    </Badge>
                    <Badge variant="neutral" size="sm">{activeSession.classroomName}</Badge>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-2">
                    {activeSession.subjectName} • {activeSession.groupName}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {activeSession.startTime.substring(0, 5)} - {activeSession.endTime.substring(0, 5)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Badge variant="warning" size="sm" dot>
                      Ventana de 72h activa: puedes registrar asistencia
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => navigate(`/sessions/${activeSession.id}/attendance`)}
                >
                  Abrir Planilla de Asistencia
                </Button>
              </div>
            </Card>
          )}

          {/* Próximas Clases */}
          {remainingSessions.length > 0 && (
            <div className="pt-2">
              <h2 className="px-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Siguientes Sesiones Programadas
              </h2>

              <InsetGroup>
                {remainingSessions.map((s) => (
                  <InsetItem
                    key={s.id}
                    title={`${s.subjectName} • ${s.groupName}`}
                    subtitle={`${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)} • ${s.classroomName}`}
                    icon={<Calendar className="h-4 w-4" />}
                    iconBg="bg-emerald-100 text-emerald-700"
                    trailing={
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" size="sm">
                          {s.status === 'completed' ? 'Completada' : 'Programada'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/sessions/${s.id}/attendance`)}
                        >
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    }
                  />
                ))}
              </InsetGroup>
            </div>
          )}
        </>
      )}
    </div>
  );
};
