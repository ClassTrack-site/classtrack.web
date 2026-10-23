import React, { useState, useEffect } from 'react';
import { Badge, Button, InsetGroup, InsetItem, SegmentedControl, Input, Card } from '@/shared/components/ui';
import { Users, Search, UserPlus, Loader2, Mail } from 'lucide-react';
import { usersService } from '../services/users.service';
import type { UserItem } from '../interfaces/users.types';

export const UsersDirectoryPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState<'teacher' | 'student'>('teacher');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [teacherCount, setTeacherCount] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtenemos los usuarios según el rol actual
      const res = await usersService.getUsers({
        role: roleFilter,
        search: searchTerm || undefined,
        limit: 50,
      });

      setUsers(res.data || []);

      // Contadores
      if (roleFilter === 'teacher') {
        setTeacherCount(res.meta.total);
      } else {
        setStudentCount(res.meta.total);
      }
    } catch (err: any) {
      console.error('Error cargando usuarios:', err);
      setError('No fue posible cargar el directorio de usuarios.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  // Manejo de búsqueda con enter o botón
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleResendActivation = async (id: string, name: string) => {
    try {
      await usersService.resendActivation(id);
      alert(`Invitación de activación reenviada con éxito a ${name}.`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al reenviar activación.');
    }
  };

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Directorio de Usuarios</h1>
          <p className="text-xs text-slate-500 font-medium">Docentes, estudiantes y credenciales de acceso</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
          Nuevo Usuario
        </Button>
      </div>

      <SegmentedControl
        options={[
          { value: 'teacher', label: `Docentes${teacherCount ? ` (${teacherCount})` : ''}` },
          { value: 'student', label: `Estudiantes${studentCount ? ` (${studentCount})` : ''}` },
        ]}
        value={roleFilter}
        onChange={(val) => setRoleFilter(val as any)}
      />

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Buscar por nombre, correo o documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="flex-1"
        />
        <Button type="submit" variant="secondary" size="md">
          Buscar
        </Button>
      </form>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] gap-2">
          <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Consultando registros institucionales...</p>
        </div>
      ) : error ? (
        <Card className="p-6 text-center space-y-2">
          <p className="text-sm text-rose-600 font-medium">{error}</p>
          <Button size="sm" variant="secondary" onClick={fetchUsers}>
            Reintentar
          </Button>
        </Card>
      ) : users.length === 0 ? (
        <Card className="p-8 text-center text-xs text-slate-500">
          No se encontraron usuarios para el filtro seleccionado.
        </Card>
      ) : (
        <InsetGroup title={roleFilter === 'teacher' ? 'Cuerpo Docente Institucional' : 'Alumnos Matriculados'}>
          {users.map((user) => (
            <InsetItem
              key={user.id}
              title={`${user.firstName} ${user.lastName}`}
              subtitle={`${user.email} • Doc: ${user.documentNumber} (${user.documentType}) ${user.phone ? `• Tel: ${user.phone}` : ''}`}
              icon={<Users className="h-4 w-4" />}
              iconBg={roleFilter === 'teacher' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-[#0EA5E9]'}
              trailing={
                <div className="flex items-center gap-2">
                  {user.isGroupDirector && (
                    <Badge variant="sky" size="sm">
                      Director
                    </Badge>
                  )}
                  <Badge variant={user.isActive ? 'present' : 'neutral'} size="sm">
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {!user.isIdentityActive && (
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Reenviar correo de activación"
                      onClick={() => handleResendActivation(user.id, `${user.firstName} ${user.lastName}`)}
                    >
                      <Mail className="h-3.5 w-3.5 text-amber-500" />
                    </Button>
                  )}
                </div>
              }
            />
          ))}
        </InsetGroup>
      )}
    </div>
  );
};
