import React, { useState, useEffect } from 'react';
import { Badge, Button, InsetGroup, InsetItem, SegmentedControl, Card } from '@/shared/components/ui';
import { Clock, Plus, Calendar, Loader2 } from 'lucide-react';
import { schedulesService } from '../services/schedules.service';
import type { ScheduleItem } from '../interfaces/schedules.types';

const DAYS_MAP: Record<string, number> = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
};

export const SchedulesMatrixPage: React.FC = () => {
  const [day, setDay] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'>('lunes');
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await schedulesService.getSchedules();
        setSchedules(data);
      } catch (err: any) {
        console.error('Error cargando matriz de horarios:', err);
        setError('No fue posible cargar los horarios semanales.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const currentDayNumber = DAYS_MAP[day];
  const filteredSchedules = schedules.filter((s) => s.dayOfWeek === currentDayNumber);

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Horarios Semanales</h1>
          <p className="text-xs text-slate-500 font-medium">
            Matriz horaria institucional • Prevención de choques de docente, aula y grupo
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Asignar
        </Button>
      </div>

      <SegmentedControl
        options={[
          { value: 'lunes', label: 'Lun' },
          { value: 'martes', label: 'Mar' },
          { value: 'miercoles', label: 'Mié' },
          { value: 'jueves', label: 'Jue' },
          { value: 'viernes', label: 'Vie' },
        ]}
        value={day}
        onChange={(val) => setDay(val as any)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-2">
          <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Cargando malla de horarios...</p>
        </div>
      ) : error ? (
        <Card className="p-6 text-center space-y-2">
          <p className="text-sm text-rose-600 font-medium">{error}</p>
          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Card>
      ) : filteredSchedules.length > 0 ? (
        <InsetGroup title={`Clases programadas para el ${day.charAt(0).toUpperCase() + day.slice(1)}`}>
          {filteredSchedules.map((s) => (
            <InsetItem
              key={s.id}
              title={`${s.subjectName} • ${s.groupName}`}
              subtitle={`${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)} • ${s.classroomName} • Prof. ${s.teacherFirstName} ${s.teacherLastName}`}
              icon={<Clock className="h-4 w-4" />}
              trailing={
                <Badge variant={s.isActive ? 'present' : 'neutral'}>
                  {s.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              }
            />
          ))}
        </InsetGroup>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-black/[0.04]">
          <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-600">No hay clases programadas para este día.</p>
          <p className="text-xs text-slate-400 mt-1">Usa el botón "Asignar" para crear una franja horaria.</p>
        </div>
      )}
    </div>
  );
};
