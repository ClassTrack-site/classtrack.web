import React, { useState, useRef } from 'react';
import { Card, Button, SegmentedControl } from '@/shared/components/ui';
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle2, Loader2, FileCheck } from 'lucide-react';
import { importsService } from '../services/imports.service';
import type { ImportType, BulkImportResponse } from '../interfaces/imports.types';

export const BulkImportsPage: React.FC = () => {
  const [importType, setImportType] = useState<ImportType>('students');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BulkImportResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = async () => {
    try {
      setIsDownloading(true);
      const blob = await importsService.downloadTemplate(importType);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plantilla_${importType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Error descargando la plantilla del servidor.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.xlsx')) {
        alert('Solo se admiten archivos en formato Excel (.xlsx)');
        return;
      }
      setSelectedFile(file);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      setResult(null);

      const res = await importsService.uploadFile(importType, selectedFile);
      setResult(res);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Error al subir archivo:', err);
      const backendError = err.response?.data;
      if (backendError?.errors && Array.isArray(backendError.errors)) {
        setResult(backendError);
      } else {
        setErrorMsg(backendError?.message || 'Error al procesar el archivo Excel.');
      }
    } finally {
      setIsUploading(false);
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
        onChange={(val) => {
          setImportType(val as any);
          setSelectedFile(null);
          setResult(null);
          setErrorMsg(null);
        }}
      />

      {/* Descarga de Plantilla Oficial */}
      <Card className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Plantilla Oficial de {importType === 'students' ? 'Estudiantes' : importType === 'teachers' ? 'Docentes' : 'Horarios'}
            </p>
            <p className="text-xs text-slate-500">Incluye columnas obligatorias y fila de ejemplo para validación</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={downloadTemplate}
          disabled={isDownloading}
          leftIcon={isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        >
          {isDownloading ? 'Descargando...' : 'Descargar'}
        </Button>
      </Card>

      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
      />

      {/* Dropzone de Carga */}
      <div className="border-2 border-dashed border-sky-300 bg-sky-50/40 rounded-3xl p-8 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-xs text-[#0EA5E9] mx-auto flex items-center justify-center">
          {selectedFile ? <FileCheck className="h-6 w-6 text-emerald-600" /> : <Upload className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">
            {selectedFile ? selectedFile.name : 'Arrastra tu archivo Excel aquí o selecciónalo'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedFile
              ? `Tamaño: ${(selectedFile.size / 1024).toFixed(1)} KB`
              : 'Soporta únicamente archivos con extensión .xlsx estructurados según la plantilla'}
          </p>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {selectedFile ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
          </Button>

          {selectedFile && (
            <Button
              variant="primary"
              size="md"
              onClick={handleUpload}
              disabled={isUploading}
              leftIcon={isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            >
              {isUploading ? 'Procesando en Servidor...' : 'Iniciar Importación'}
            </Button>
          )}
        </div>
      </div>

      {/* Resultado Exitoso */}
      {result && result.success && (
        <Card className="p-4 bg-emerald-50 border-emerald-200 text-emerald-900 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <h4 className="text-sm font-bold">¡Carga masiva completada con éxito!</h4>
          </div>
          <p className="text-xs text-emerald-700 pl-7">
            {result.message || `Se procesaron exitosamente ${result.importedCount} de ${result.totalRows} registros.`}
          </p>
        </Card>
      )}

      {/* Resultado con Errores de Validación */}
      {((result && !result.success) || errorMsg) && (
        <Card className="p-5 bg-rose-50 border-rose-200 text-rose-900 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <h4 className="text-sm font-bold">Transacción Cancelada (Regla Todo o Nada)</h4>
          </div>
          <p className="text-xs text-rose-700">
            {errorMsg || result?.message || 'Se detectaron inconsistencias en el archivo. No se guardó ningún registro en la base de datos.'}
          </p>

          {result?.errors && result.errors.length > 0 && (
            <div className="mt-3 bg-white/80 rounded-xl p-3 border border-rose-200 text-xs max-h-48 overflow-y-auto space-y-1.5">
              <span className="font-bold text-rose-900 block mb-1">Detalle de errores encontrados:</span>
              {result.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2 text-rose-800">
                  <span className="font-semibold text-rose-600 shrink-0">Fila {err.row}:</span>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
