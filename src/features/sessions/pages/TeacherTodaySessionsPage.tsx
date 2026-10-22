import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, InsetGroup, InsetItem } from '@/shared/components/ui';
import { Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TeacherTodaySessionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 max-w-xl md:max-w-3xl mx-auto pb-12">
      {/* Resumen del Día */}
      <div className="px-1">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Mis Clases de Hoy
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Lunes, 22 de Octubre de 2026
        </p>
      </div>

      {/* Clase Activa / Destacada */}
      <Card glass className="border-sky-200/50 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="sky" size="sm">En Curso / Hoy</Badge>
              <Badge variant="neutral" size="sm">Aula 101</Badge>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-2">
              Matemáticas • Grado 9-A
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>07:00 - 08:30 (90 min)</span>
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
            onClick={() => navigate('/sessions/demo-session-1/attendance')}
          >
            Abrir Planilla de Asistencia
          </Button>
        </div>
      </Card>

      {/* Próximas Clases */}
      <div className="pt-2">
        <h2 className="px-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          Siguientes Sesiones Programadas
        </h2>

        <InsetGroup>
          <InsetItem
            title="Ciencias Naturales • Grado 9-A"
            subtitle="Martes • 08:30 - 10:00 • Aula 102"
            icon={<Calendar className="h-4 w-4" />}
            iconBg="bg-emerald-100 text-emerald-700"
            trailing={
              <div className="flex items-center gap-1.5">
                <Badge variant="neutral" size="sm">Programada</Badge>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            }
          />
        </InsetGroup>
      </div>
    </div>
  );
};
