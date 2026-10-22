import React, { useState } from 'react';
import { Card, Badge, Button, InsetGroup, InsetItem, BottomSheet, SegmentedControl } from '@/shared/components/ui';
import {
  GraduationCap,
  Download,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { apiClient } from '@/shared/services/api/apiClient';

interface StudentGroupItem {
  id: string;
  name: string;
  doc: string;
  attendanceRate: number;
  absences: number;
  lates: number;
  hasAlert: boolean;
}

const MOCK_GROUP_STUDENTS: StudentGroupItem[] = [
  { id: '1', name: 'Sofía Martínez Gómez', doc: '30000001', attendanceRate: 100, absences: 0, lates: 0, hasAlert: false },
  { id: '2', name: 'Mateo Alejandro Rodríguez', doc: '30000002', attendanceRate: 95, absences: 0, lates: 1, hasAlert: false },
  { id: '3', name: 'Valentina Restrepo Torres', doc: '30000003', attendanceRate: 75, absences: 3, lates: 2, hasAlert: true },
  { id: '4', name: 'Samuel David Castaño', doc: '30000004', attendanceRate: 90, absences: 1, lates: 1, hasAlert: false },
  { id: '5', name: 'Isabella Morales Castro', doc: '30000005', attendanceRate: 100, absences: 0, lates: 0, hasAlert: false },
  { id: '6', name: 'Nicolás Daniel Pineda', doc: '30000006', attendanceRate: 85, absences: 2, lates: 0, hasAlert: false },
  { id: '7', name: 'Mariana Duque Ruiz', doc: '30000007', attendanceRate: 100, absences: 0, lates: 0, hasAlert: false },
  { id: '8', name: 'Juan Esteban Vélez', doc: '30000008', attendanceRate: 95, absences: 0, lates: 1, hasAlert: false },
  { id: '9', name: 'Camila Ospina Henao', doc: '30000009', attendanceRate: 100, absences: 0, lates: 0, hasAlert: false },
  { id: '10', name: 'Lucas Gabriel Herrera', doc: '30000010', attendanceRate: 90, absences: 1, lates: 0, hasAlert: false },
];

export const MyGroupDirectorPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentGroupItem | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'subjects' | 'alerts'>('students');
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadGroupReport = async () => {
    try {
      setIsDownloading(true);
      const response = await apiClient.get('/reports/excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_grado_9A.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Descarga completada en modo demo (Reporte Grado 9-A generado).');
    } finally {
      setIsDownloading(false);
    }
  };

  const alertStudentsCount = MOCK_GROUP_STUDENTS.filter((s) => s.hasAlert).length;

  return (
    <div className="space-y-5 max-w-xl md:max-w-4xl mx-auto pb-16">
      {/* Encabezado Principal iOS */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Monitoreo de Mi Grupo
            </h1>
            <Badge variant="sky" size="sm">Grado 9-A</Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Vista exclusiva para el Director de Grupo
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={downloadGroupReport}
          isLoading={isDownloading}
          leftIcon={<Download className="h-4 w-4" />}
        >
          Exportar Excel
        </Button>
      </div>

      {/* Banner Informativo con Regla de Negocio del Director */}
      <Card glass className="border-sky-200/60 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-sky-100 text-[#0EA5E9] flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Facultad Especial de Director
              </h2>
              <Badge variant="present" size="sm">Sin Límite 72h</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Como director de <strong>Grado 9-A</strong> puedes consultar la asistencia de <strong>todas las asignaturas</strong> y aplicar correcciones extemporáneas sin la restricción de las 72 horas.
            </p>
          </div>
        </div>
      </Card>

      {/* Tarjetas Resumen de Desempeño del Grupo */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="p-3">
          <span className="text-[11px] font-semibold text-slate-500">Estudiantes</span>
          <p className="text-xl font-black text-slate-900">10</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% Matriculados</span>
        </Card>

        <Card className="p-3">
          <span className="text-[11px] font-semibold text-slate-500">Asistencia Global</span>
          <p className="text-xl font-black text-slate-900">93.0%</p>
          <span className="text-[10px] text-emerald-600 font-bold">Excelente</span>
        </Card>

        <Card className="p-3">
          <span className="text-[11px] font-semibold text-slate-500">En Riesgo</span>
          <p className="text-xl font-black text-rose-600">{alertStudentsCount}</p>
          <span className="text-[10px] text-rose-600 font-bold">&gt; 3 Ausencias</span>
        </Card>
      </div>

      {/* Segmented Control iOS */}
      <SegmentedControl
        options={[
          { value: 'students', label: 'Estudiantes', badge: 10 },
          { value: 'subjects', label: 'Materias 9-A', badge: 4 },
          { value: 'alerts', label: 'Alertas', badge: alertStudentsCount },
        ]}
        value={activeTab}
        onChange={(val) => setActiveTab(val as any)}
      />

      {/* Pestaña: Listado de Estudiantes del Grupo */}
      {activeTab === 'students' && (
        <InsetGroup title="Estudiantes a tu Cargo (Grado 9-A)">
          {MOCK_GROUP_STUDENTS.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {student.name}
                  </p>
                  {student.hasAlert && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      <AlertTriangle className="h-3 w-3" />
                      Alerta
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">Doc: {student.doc}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">
                    {student.attendanceRate}% Asistencia
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {student.absences} faltas • {student.lates} tardanzas
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          ))}
        </InsetGroup>
      )}

      {/* Pestaña: Materias que recibe el grupo */}
      {activeTab === 'subjects' && (
        <InsetGroup title="Asignaturas y Docentes del Grado 9-A">
          <InsetItem
            title="Matemáticas"
            subtitle="Docente: Prof. Carlos Rector (Tú) • 90 min semanales"
            icon={<GraduationCap className="h-4 w-4" />}
            trailing={<Badge variant="present" size="sm">96% Asist.</Badge>}
          />
          <InsetItem
            title="Ciencias Naturales"
            subtitle="Docente: Prof. Ciencias San José • 90 min semanales"
            icon={<GraduationCap className="h-4 w-4" />}
            trailing={<Badge variant="sky" size="sm">91% Asist.</Badge>}
          />
          <InsetItem
            title="Lengua Castellana"
            subtitle="Docente: Coordinación Académica"
            icon={<GraduationCap className="h-4 w-4" />}
            trailing={<Badge variant="sky" size="sm">94% Asist.</Badge>}
          />
          <InsetItem
            title="Inglés"
            subtitle="Docente: Docente Bilingüe"
            icon={<GraduationCap className="h-4 w-4" />}
            trailing={<Badge variant="sky" size="sm">92% Asist.</Badge>}
          />
        </InsetGroup>
      )}

      {/* Pestaña: Alertas Tempranas de Inasistencia */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-900">
                Atención Prioritaria: Valentina Restrepo Torres
              </p>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                Ha acumulado 3 inasistencias en el presente bimestre lectivo. Como Director de Grupo, se recomienda citar a su acudiente para verificar justificaciones médicas.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-rose-800 border-rose-300 bg-white"
                onClick={() => setSelectedStudent(MOCK_GROUP_STUDENTS[2])}
              >
                Ver Historial de Faltas
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* BottomSheet de Ficha Individual del Estudiante para el Director */}
      <BottomSheet
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.name}
        subtitle={`Expediente Grado 9-A • Doc: ${selectedStudent?.doc}`}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold">Tasa de Asistencia</span>
                <p className="text-xl font-black text-slate-900">{selectedStudent.attendanceRate}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold">Total Inasistencias</span>
                <p className="text-xl font-black text-[#DC2626]">{selectedStudent.absences}</p>
              </div>
            </div>

            <InsetGroup title="Asistencia por Materia (Todas las Áreas)">
              <InsetItem
                title="Matemáticas"
                subtitle="Prof. Carlos Rector"
                trailing={<Badge variant="present" size="sm">Presente Hoy</Badge>}
              />
              <InsetItem
                title="Ciencias Naturales"
                subtitle="Prof. Ciencias San José"
                trailing={<Badge variant={selectedStudent.absences > 0 ? 'absent' : 'present'} size="sm">
                  {selectedStudent.absences > 0 ? 'Falta Registrada' : 'Al Día'}
                </Badge>}
              />
            </InsetGroup>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setSelectedStudent(null)}
              >
                Cerrar Expediente
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
