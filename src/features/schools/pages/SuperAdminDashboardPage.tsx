import React from 'react';
import { Card, Badge, Button, InsetGroup, InsetItem } from '@/shared/components/ui';
import { Building2, Plus } from 'lucide-react';

export const SuperAdminDashboardPage: React.FC = () => {
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
          <p className="text-2xl font-black text-slate-900">1</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% Operativos</span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Esquema Base</span>
          <p className="text-2xl font-black text-slate-900">public</p>
          <span className="text-[10px] text-slate-400">Identidades globales</span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Multi-Tenancy</span>
          <p className="text-2xl font-black text-slate-900">Supabase</p>
          <span className="text-[10px] text-emerald-600 font-bold">Conectado IPv4</span>
        </Card>
      </div>

      <InsetGroup title="Colegios Contratantes Registrados">
        <InsetItem
          title="Colegio San José Demo"
          subtitle="Slug: sanjose • Esquema: tenant_sanjose • Zona: America/Bogota"
          icon={<Building2 className="h-4 w-4" />}
          trailing={<Badge variant="present">Aprovisionado</Badge>}
        />
      </InsetGroup>
    </div>
  );
};
