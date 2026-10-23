import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, InsetGroup, InsetItem } from '@/shared/components/ui';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { schoolsService } from '../services/schools.service';
import type { SchoolItem } from '../interfaces/schools.types';

export const SuperAdminDashboardPage: React.FC = () => {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await schoolsService.getSchools();
        setSchools(data);
      } catch (err: any) {
        console.error('Error cargando colegios:', err);
        setError('No fue posible consultar los colegios registrados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const activeSchoolsCount = schools.filter((s) => s.isActive).length;

  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Super Administrador SaaS</h1>
          <p className="text-xs text-slate-500 font-medium">Gestión global de instituciones y esquemas en PostgreSQL</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Nuevo Colegio
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Colegios Activos</span>
          <p className="text-2xl font-black text-slate-900">{schools.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold">
            {schools.length > 0 ? `${((activeSchoolsCount / schools.length) * 100).toFixed(0)}% Operativos` : 'Sin registros'}
          </span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Esquema Central</span>
          <p className="text-2xl font-black text-slate-900">public</p>
          <span className="text-[10px] text-slate-400">Identidades únicas globales</span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Aislamiento Multi-Tenancy</span>
          <p className="text-2xl font-black text-slate-900">PostgreSQL</p>
          <span className="text-[10px] text-emerald-600 font-bold">Esquemas dinámicos</span>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-2">
          <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Cargando colegios contratantes...</p>
        </div>
      ) : error ? (
        <Card className="p-6 text-center space-y-2">
          <p className="text-sm text-rose-600 font-medium">{error}</p>
          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Card>
      ) : (
        <InsetGroup title="Colegios Contratantes Registrados">
          {schools.map((school) => (
            <InsetItem
              key={school.id}
              title={school.name}
              subtitle={`Slug: ${school.slug} • Esquema: ${school.schemaName} • Zona: ${school.timezone}${school.contactEmail ? ` • ${school.contactEmail}` : ''}`}
              icon={<Building2 className="h-4 w-4" />}
              trailing={
                <Badge variant={school.isActive ? 'present' : 'neutral'}>
                  {school.isActive ? 'Aprovisionado' : 'Inactivo'}
                </Badge>
              }
            />
          ))}
        </InsetGroup>
      )}
    </div>
  );
};
