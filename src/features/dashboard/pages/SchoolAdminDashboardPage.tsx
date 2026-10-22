import React from 'react';
import { Card, Badge, InsetGroup, InsetItem } from '@/shared/components/ui';
import { Users, GraduationCap, School, Calendar, TrendingUp } from 'lucide-react';

export const SchoolAdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-5 max-w-2xl md:max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Panel de Control Institucional
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Colegio San José Demo • Ciclo 2026
        </p>
      </div>

      {/* KPI Cards Estilo iOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estudiantes</span>
            <div className="h-8 w-8 rounded-xl bg-sky-100 text-[#0EA5E9] flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">10</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% Matriculados</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Docentes</span>
            <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">2</p>
          <span className="text-[10px] text-slate-400">Activos en nómina</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Grupos</span>
            <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <School className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">1</p>
          <span className="text-[10px] text-slate-400">Grado 9-A</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Asistencia Semanal</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">95.5%</p>
          <span className="text-[10px] text-emerald-600 font-bold">Fórmula oficial</span>
        </Card>
      </div>

      {/* Sesiones de Hoy */}
      <div>
        <h2 className="px-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Operación de Hoy
        </h2>
        <InsetGroup>
          <InsetItem
            title="Matemáticas • Grado 9-A"
            subtitle="07:00 - 08:30 • Aula 101 • Docente: Carlos Rector"
            icon={<Calendar className="h-4 w-4" />}
            trailing={<Badge variant="sky">Programada</Badge>}
          />
        </InsetGroup>
      </div>
    </div>
  );
};
