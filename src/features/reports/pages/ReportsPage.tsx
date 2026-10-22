import React, { useState } from 'react';
import { Card, Button } from '@/shared/components/ui';
import { FileSpreadsheet, Download } from 'lucide-react';
import { apiClient } from '@/shared/services/api/apiClient';

export const ReportsPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      const response = await apiClient.get('/reports/excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_asistencia_sanjose.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Error descargando reporte analítico. Verifica que el backend esté arriba.');
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

        <Button
          variant="primary"
          size="lg"
          className="w-full font-bold"
          onClick={downloadReport}
          isLoading={isDownloading}
          leftIcon={<Download className="h-5 w-5" />}
        >
          Descargar Informe Oficial en Excel
        </Button>
      </Card>
    </div>
  );
};
