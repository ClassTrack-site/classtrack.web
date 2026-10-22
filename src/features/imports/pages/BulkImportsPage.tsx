import React, { useState } from 'react';
import { Card, Button, SegmentedControl } from '@/shared/components/ui';
import { Upload, Download, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/shared/services/api/apiClient';

export const BulkImportsPage: React.FC = () => {
  const [importType, setImportType] = useState<'students' | 'teachers' | 'schedules'>('students');

  const downloadTemplate = async () => {
    try {
      const response = await apiClient.get(`/imports/templates/${importType}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plantilla_${importType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Error descargando plantilla. Asegúrate de que el backend esté en ejecución.');
    }
  };

  return (
    <div className="space-y-5 max-w-2xl md:max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Cargas Masivas</h1>
        <p className="text-xs text-slate-500 font-medium">Importación atómica por lotes en formato Excel (.xlsx)</p>
      </div>

      <SegmentedControl
        options={[
          { value: 'students', label: 'Estudiantes' },
          { value: 'teachers', label: 'Docentes' },
          { value: 'schedules', label: 'Horarios' },
        ]}
        value={importType}
        onChange={(val) => setImportType(val as any)}
      />

      {/* Descarga de Plantilla Oficial */}
      <Card className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Plantilla Oficial de {importType === 'students' ? 'Estudiantes' : importType === 'teachers' ? 'Docentes' : 'Horarios'}</p>
            <p className="text-xs text-slate-500">Incluye columnas obligatorias y fila de ejemplo</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={downloadTemplate} leftIcon={<Download className="h-4 w-4" />}>
          Descargar
        </Button>
      </Card>

      {/* Dropzone de Carga */}
      <div className="border-2 border-dashed border-sky-300 bg-sky-50/40 rounded-3xl p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-xs text-[#0EA5E9] mx-auto flex items-center justify-center">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">Arrastra tu archivo Excel aquí</p>
          <p className="text-xs text-slate-500 mt-0.5">Soporta únicamente archivos con extensión .xlsx</p>
        </div>
        <Button variant="primary" size="md">
          Seleccionar Archivo
        </Button>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
        <AlertTriangle className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
        <span>
          <strong>Procesamiento Atómico:</strong> La importación es "Todo o Nada". Si alguna fila tiene errores (documento duplicado o formato incorrecto), ninguna fila se guardará y verás el detalle de errores para corregirlo.
        </span>
      </div>
    </div>
  );
};
