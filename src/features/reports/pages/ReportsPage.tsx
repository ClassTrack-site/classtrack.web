import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '@/shared/components/ui';
import { FileSpreadsheet, Download, Loader2, AlertCircle } from 'lucide-react';
import { reportsService } from '../services/reports.service';
import { academicService } from '@/features/academic/services/academic.service';
import type { AcademicGroup } from '@/features/academic/interfaces/academic.types';

export const ReportsPage: React.FC = () => {
  const [groups, setGroups] = useState<AcademicGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoadingGroups(true);
        const data = await academicService.getGroups();
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroupId(data[0].id);
        }
      } catch (err: any) {
        console.error('Error cargando grupos:', err);
        setError('No fue posible cargar los grupos institucionales.');
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const downloadReport = async () => {
    if (!selectedGroupId) {
      alert('Debes seleccionar un grupo académico.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Debes indicar fecha inicial y fecha final.');
      return;
    }

    try {
      setIsDownloading(true);
      setError(null);
      const blob = await reportsService.downloadExcel({
        groupId: selectedGroupId,
        startDate,
        endDate,
      });

      const selGroup = groups.find((g) => g.id === selectedGroupId);
      const groupNameClean = selGroup ? selGroup.name.replace(/\s+/g, '_') : 'reporte';

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_asistencia_${groupNameClean}_${startDate}_a_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error('Error en descarga de reporte:', err);
      setError(err.response?.data?.message || 'Error al generar y descargar el reporte Excel.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl md:max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Reportes y Analítica</h1>
        <p className="text-xs text-slate-500 font-medium">Informes oficiales en Excel con dos hojas: Resumen y Detalle</p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Consolidado General de Asistencia (Excel)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Genera un archivo con fórmulas oficiales de porcentaje, desglose por estudiante y auditoría completa de modificaciones.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Hoja 1: Resumen</span>
            <span className="font-semibold text-slate-800">Totales, % de asistencia y tardanzas</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Hoja 2: Detalle</span>
            <span className="font-semibold text-slate-800">Sesión por sesión con autor de cambios</span>
          </div>
        </div>

        {/* Parámetros de Generación */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Grupo Académico a Exportar:
            </label>
            {isLoadingGroups ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando grupos...
              </div>
            ) : (
              <Select
                value={selectedGroupId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGroupId(e.target.value)}
                options={groups.map((g) => ({
                  value: g.id,
                  label: `${g.name} (${g.studentCount} estudiantes)`,
                }))}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fecha Inicial:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fecha Final:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          variant="primary"
          size="md"
          className="w-full font-bold shadow-xs mt-2"
          onClick={downloadReport}
          disabled={isDownloading || isLoadingGroups || !selectedGroupId}
          leftIcon={isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        >
          {isDownloading ? 'Generando archivo Excel...' : 'Descargar Consolidado (.xlsx)'}
        </Button>
      </Card>
    </div>
  );
};
