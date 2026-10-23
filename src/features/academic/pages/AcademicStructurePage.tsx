import React, { useState, useEffect } from 'react';
import { Badge, Button, InsetGroup, InsetItem, SegmentedControl, Card } from '@/shared/components/ui';
import { BookOpen, School, Building, Calendar, Plus, Loader2 } from 'lucide-react';
import { academicService } from '../services/academic.service';
import type {
  AcademicGroup,
  SubjectItem,
  ClassroomItem,
  CalendarEventItem,
} from '../interfaces/academic.types';

export const AcademicStructurePage: React.FC = () => {
  const [tab, setTab] = useState<'groups' | 'subjects' | 'classrooms' | 'calendar'>('groups');
  const [groups, setGroups] = useState<AcademicGroup[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [calendar, setCalendar] = useState<CalendarEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAcademicData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [grp, sub, cls, cal] = await Promise.all([
          academicService.getGroups().catch(() => []),
          academicService.getSubjects().catch(() => []),
          academicService.getClassrooms().catch(() => []),
          academicService.getCalendar().catch(() => []),
        ]);
        setGroups(grp);
        setSubjects(sub);
        setClassrooms(cls);
        setCalendar(cal);
      } catch (err: any) {
        console.error('Error al cargar estructura académica:', err);
        setError('No fue posible cargar los datos académicos del colegio.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAcademicData();
  }, []);

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Gestión Académica</h1>
          <p className="text-xs text-slate-500 font-medium">Grupos, materias, aulas y calendario escolar</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Agregar
        </Button>
      </div>

      <SegmentedControl
        options={[
          { value: 'groups', label: `Grupos (${groups.length})` },
          { value: 'subjects', label: `Materias (${subjects.length})` },
          { value: 'classrooms', label: `Aulas (${classrooms.length})` },
          { value: 'calendar', label: `Calendario (${calendar.length})` },
        ]}
        value={tab}
        onChange={(val) => setTab(val as any)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-2">
          <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Cargando catálogo institucional...</p>
        </div>
      ) : error ? (
        <Card className="p-6 text-center space-y-2">
          <p className="text-sm text-rose-600 font-medium">{error}</p>
          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Card>
      ) : (
        <>
          {tab === 'groups' && (
            <InsetGroup title="Grupos Académicos Registrados">
              {groups.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No hay grupos creados todavía.</div>
              ) : (
                groups.map((g) => (
                  <InsetItem
                    key={g.id}
                    title={g.name}
                    subtitle={`Director: ${g.directorFirstName ? `${g.directorFirstName} ${g.directorLastName}` : 'Sin asignar'} • ${g.studentCount} Estudiantes matriculados`}
                    icon={<School className="h-4 w-4" />}
                    trailing={<Badge variant="present">Año {g.schoolYear}</Badge>}
                  />
                ))
              )}
            </InsetGroup>
          )}

          {tab === 'subjects' && (
            <InsetGroup title="Catálogo de Asignaturas">
              {subjects.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No hay materias registradas.</div>
              ) : (
                subjects.map((s) => (
                  <InsetItem
                    key={s.id}
                    title={s.name}
                    subtitle={`Código: ${s.code}${s.description ? ` • ${s.description}` : ''}`}
                    icon={<BookOpen className="h-4 w-4" />}
                    trailing={<Badge variant={s.isActive ? 'present' : 'neutral'}>{s.isActive ? 'Activa' : 'Inactiva'}</Badge>}
                  />
                ))
              )}
            </InsetGroup>
          )}

          {tab === 'classrooms' && (
            <InsetGroup title="Espacios Físicos y Aulas">
              {classrooms.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No hay aulas registradas.</div>
              ) : (
                classrooms.map((c) => (
                  <InsetItem
                    key={c.id}
                    title={c.name}
                    subtitle={`Capacidad: ${c.capacity} alumnos • Código: ${c.code}${c.location ? ` • ${c.location}` : ''}`}
                    icon={<Building className="h-4 w-4" />}
                    trailing={<Badge variant={c.isActive ? 'present' : 'neutral'}>{c.isActive ? 'Disponible' : 'Inactiva'}</Badge>}
                  />
                ))
              )}
            </InsetGroup>
          )}

          {tab === 'calendar' && (
            <InsetGroup title="Eventos del Calendario Escolar">
              {calendar.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No hay eventos especiales programados. Todos los días regulares siguen el horario base.
                </div>
              ) : (
                calendar.map((ev) => (
                  <InsetItem
                    key={ev.id}
                    title={ev.name}
                    subtitle={`Fecha: ${ev.date} • Tipo: ${ev.type}`}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                ))
              )}
            </InsetGroup>
          )}
        </>
      )}
    </div>
  );
};
