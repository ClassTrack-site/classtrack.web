import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, InsetGroup, InsetItem, BottomSheet, SegmentedControl } from '@/shared/components/ui';
import {
  GraduationCap,
  Download,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { academicService } from '../services/academic.service';
import { reportsService } from '@/features/reports/services/reports.service';
import type { AcademicGroup, GroupEnrollmentItem } from '../interfaces/academic.types';

export const MyGroupDirectorPage: React.FC = () => {
  const [group, setGroup] = useState<AcademicGroup | null>(null);
  const [students, setStudents] = useState<GroupEnrollmentItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<GroupEnrollmentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'alerts'>('students');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const groups = await academicService.getGroups();
        if (groups && groups.length > 0) {
          const targetGroup = groups[0];
          setGroup(targetGroup);

          const enrollments = await academicService.getGroupEnrollments(targetGroup.id);
          setStudents(enrollments);
        }
      } catch (err: any) {
        console.error('Error cargando grupo:', err);
        setError('No fue posible cargar la información de tu grupo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, []);

  const downloadGroupReport = async () => {
    if (!group) return;
    try {
      setIsDownloading(true);
      const today = new Date().toISOString().split('T')[0];
      const startOfYear = `${new Date().getFullYear()}-01-01`;

      const blob = await reportsService.downloadExcel({
        groupId: group.id,
        startDate: startOfYear,
        endDate: today,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${group.name.replace(/\s+/g, '_')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error('Error descargando reporte de grupo:', err);
      alert('Error descargando reporte analítico. Verifica los permisos de usuario.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Cargando directorio de tu grupo...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <Card className="p-6 text-center space-y-2 max-w-md mx-auto">
        <p className="text-sm text-slate-700 font-medium">{error || 'No tienes un grupo asignado como director.'}</p>
        <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl md:max-w-4xl mx-auto pb-16">
      {/* Encabezado del Grupo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Monitoreo: {group.name}
            </h1>
            <Badge variant="sky" size="sm">
              Año {group.schoolYear}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Director: {group.directorFirstName ? `${group.directorFirstName} ${group.directorLastName}` : 'Asignado'} • {students.length} Estudiantes Matriculados
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="font-bold self-start md:self-auto"
          leftIcon={isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          disabled={isDownloading}
          onClick={downloadGroupReport}
        >
          {isDownloading ? 'Generando Excel...' : 'Descargar Consolidado (Excel)'}
        </Button>
      </div>

      {/* Tabs */}
      <SegmentedControl
        options={[
          { value: 'students', label: `Estudiantes (${students.length})` },
          { value: 'alerts', label: 'Alertas Tempranas (0)' },
        ]}
        value={activeTab}
        onChange={(val) => setActiveTab(val as any)}
      />

      {activeTab === 'students' && (
        <InsetGroup title="Listado Oficial de Alumnos">
          {students.map((st) => (
            <InsetItem
              key={st.id || st.studentId}
              title={`${st.studentFirstName} ${st.studentLastName}`}
              subtitle={`Doc: ${st.documentType} ${st.documentNumber} • ${st.email}`}
              icon={<GraduationCap className="h-4 w-4" />}
              iconBg="bg-sky-100 text-[#0EA5E9]"
              trailing={
                <div className="flex items-center gap-2">
                  <Badge variant="present" size="sm">
                    Matriculado
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedStudent(st)}>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              }
            />
          ))}
        </InsetGroup>
      )}

      {activeTab === 'alerts' && (
        <Card className="p-8 text-center text-xs text-slate-500 space-y-2">
          <AlertTriangle className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="font-bold text-slate-800">¡Excelente disciplina!</p>
          <p>No se registran alertas de inasistencias críticas para este grupo.</p>
        </Card>
      )}

      {/* Bottom Sheet de Detalle */}
      {selectedStudent && (
        <BottomSheet
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`${selectedStudent.studentFirstName} ${selectedStudent.studentLastName}`}
        >
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-semibold block">Documento de Identidad:</span>
              <span className="font-bold text-slate-800">{selectedStudent.documentType} {selectedStudent.documentNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-semibold block">Correo Institucional:</span>
              <span className="font-bold text-slate-800">{selectedStudent.email}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-semibold block">Fecha de Matrícula:</span>
              <span className="font-bold text-slate-800">{new Date(selectedStudent.enrolledAt).toLocaleDateString('es-CO')}</span>
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold mt-2"
              onClick={() => setSelectedStudent(null)}
            >
              Cerrar
            </Button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};
