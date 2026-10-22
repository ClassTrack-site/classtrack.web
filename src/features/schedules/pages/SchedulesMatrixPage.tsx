import React, { useState } from 'react';
import { Badge, Button, InsetGroup, InsetItem, SegmentedControl } from '@/shared/components/ui';
import { Clock, Plus, Calendar } from 'lucide-react';

export const SchedulesMatrixPage: React.FC = () => {
  const [day, setDay] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'>('lunes');

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Horarios Semanales</h1>
          <p className="text-xs text-slate-500 font-medium">Grado 9-A • Prevención de cruces de docente y aula</p>
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

      {day === 'lunes' ? (
        <InsetGroup title="Clases del Lunes">
          <InsetItem
            title="Matemáticas • Grado 9-A"
            subtitle="07:00 - 08:30 • Aula 101 • Prof. Carlos Rector"
            icon={<Clock className="h-4 w-4" />}
            trailing={<Badge variant="present">Sin Cruces</Badge>}
          />
        </InsetGroup>
      ) : day === 'martes' ? (
        <InsetGroup title="Clases del Martes">
          <InsetItem
            title="Ciencias Naturales • Grado 9-A"
            subtitle="08:30 - 10:00 • Aula 102 • Prof. Ciencias San José"
            icon={<Clock className="h-4 w-4" />}
            trailing={<Badge variant="present">Sin Cruces</Badge>}
          />
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
