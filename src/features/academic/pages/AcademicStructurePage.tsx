import React, { useState } from 'react';
import { Badge, Button, InsetGroup, InsetItem, SegmentedControl } from '@/shared/components/ui';
import { BookOpen, School, Building, Calendar, Plus } from 'lucide-react';

export const AcademicStructurePage: React.FC = () => {
  const [tab, setTab] = useState<'groups' | 'subjects' | 'classrooms' | 'calendar'>('groups');

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
          { value: 'groups', label: 'Grupos' },
          { value: 'subjects', label: 'Materias' },
          { value: 'classrooms', label: 'Aulas' },
          { value: 'calendar', label: 'Calendario' },
        ]}
        value={tab}
        onChange={(val) => setTab(val as any)}
      />

      {tab === 'groups' && (
        <InsetGroup title="Grupos Académicos (Ciclo 2026)">
          <InsetItem
            title="Grado 9-A"
            subtitle="Director: Prof. Carlos Rector • 10 Estudiantes matriculados"
            icon={<School className="h-4 w-4" />}
            trailing={<Badge variant="present">Activo</Badge>}
          />
        </InsetGroup>
      )}

      {tab === 'subjects' && (
        <InsetGroup title="Catálogo de Asignaturas">
          <InsetItem title="Matemáticas" subtitle="Código: MAT-01" icon={<BookOpen className="h-4 w-4" />} />
          <InsetItem title="Ciencias Naturales" subtitle="Código: CN-01" icon={<BookOpen className="h-4 w-4" />} />
          <InsetItem title="Lengua Castellana" subtitle="Código: ESP-01" icon={<BookOpen className="h-4 w-4" />} />
          <InsetItem title="Inglés" subtitle="Código: ENG-01" icon={<BookOpen className="h-4 w-4" />} />
        </InsetGroup>
      )}

      {tab === 'classrooms' && (
        <InsetGroup title="Espacios Físicos">
          <InsetItem title="Aula 101" subtitle="Capacidad: 35 estudiantes • Bloque A" icon={<Building className="h-4 w-4" />} />
          <InsetItem title="Aula 102" subtitle="Capacidad: 35 estudiantes • Bloque A" icon={<Building className="h-4 w-4" />} />
          <InsetItem title="LAB-01 (Laboratorio)" subtitle="Capacidad: 30 estudiantes • Sistemas" icon={<Building className="h-4 w-4" />} />
        </InsetGroup>
      )}

      {tab === 'calendar' && (
        <InsetGroup title="Eventos del Calendario Escolar">
          <InsetItem
            title="Primer Periodo Lectivo 2026"
            subtitle="01 Feb 2026 - 15 Abr 2026 • Periodo Académico"
            icon={<Calendar className="h-4 w-4" />}
            trailing={<Badge variant="sky">Vigente</Badge>}
          />
          <InsetItem
            title="Semana Santa"
            subtitle="29 Mar 2026 - 05 Abr 2026 • Vacaciones (No lectivo)"
            icon={<Calendar className="h-4 w-4" />}
            trailing={<Badge variant="warning">Receso</Badge>}
          />
        </InsetGroup>
      )}
    </div>
  );
};
