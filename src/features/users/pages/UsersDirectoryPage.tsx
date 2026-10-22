import React, { useState } from 'react';
import { Badge, Button, InsetGroup, InsetItem, SegmentedControl, Input } from '@/shared/components/ui';
import { Users, Search, UserPlus } from 'lucide-react';

export const UsersDirectoryPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState<'teacher' | 'student'>('teacher');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Directorio de Usuarios</h1>
          <p className="text-xs text-slate-500 font-medium">Docentes, estudiantes y credenciales</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
          Nuevo
        </Button>
      </div>

      <SegmentedControl
        options={[
          { value: 'teacher', label: 'Docentes (2)', badge: 2 },
          { value: 'student', label: 'Estudiantes (10)', badge: 10 },
        ]}
        value={roleFilter}
        onChange={(val) => setRoleFilter(val as any)}
      />

      <Input
        placeholder="Buscar por nombre, correo o documento..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
      />

      {roleFilter === 'teacher' ? (
        <InsetGroup title="Cuerpo Docente">
          <InsetItem
            title="Prof. Carlos Rector"
            subtitle="profesor.mate@sanjose.edu.co • Doc: 20000001"
            icon={<Users className="h-4 w-4" />}
            trailing={<Badge variant="sky">Director 9-A</Badge>}
          />
          <InsetItem
            title="Prof. Ciencias San José"
            subtitle="profesor.ciencias@sanjose.edu.co • Doc: 20000002"
            icon={<Users className="h-4 w-4" />}
            trailing={<Badge variant="neutral">Docente</Badge>}
          />
        </InsetGroup>
      ) : (
        <InsetGroup title="Alumnos Grado 9-A">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <InsetItem
              key={num}
              title={`Estudiante San José ${num}`}
              subtitle={`estudiante${num}@sanjose.edu.co • Doc: 3000000${num < 10 ? '0' + num : num}`}
              icon={<Users className="h-4 w-4" />}
              iconBg="bg-slate-100 text-slate-600"
              trailing={<Badge variant="present" size="sm">Matriculado</Badge>}
            />
          ))}
        </InsetGroup>
      )}
    </div>
  );
};
