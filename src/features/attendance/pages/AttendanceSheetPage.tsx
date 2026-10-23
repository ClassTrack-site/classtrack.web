import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Badge, Button, InsetGroup, BottomSheet, Input } from '@/shared/components/ui';
import { CheckCircle2, ChevronLeft, Clock, Save, Loader2, AlertTriangle, CheckCheck } from 'lucide-react';
import { attendanceService } from '../services/attendance.service';
import { sessionsService } from '@/features/sessions/services/sessions.service';
import { useAuth } from '@/shared/context/AuthContext';
import type { StudentAttendanceItem, SessionAttendanceResponse } from '../interfaces/attendance.types';
import type { SessionItem } from '@/features/sessions/interfaces/sessions.types';

export const AttendanceSheetPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { activeProfile } = useAuth();

  const [session, setSession] = useState<SessionItem | null>(null);
  const [data, setData] = useState<SessionAttendanceResponse | null>(null);
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceItem | null>(null);
  const [remarksInput, setRemarksInput] = useState('');
  const [adminReason, setAdminReason] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [sessionInfo, attendanceData] = await Promise.all([
          sessionsService.getSessionById(sessionId).catch(() => null),
          attendanceService.getSessionAttendance(sessionId),
        ]);

        setSession(sessionInfo);
        setData(attendanceData);
        setStudents(attendanceData.students || []);
      } catch (err: any) {
        console.error('Error al cargar la planilla de asistencia:', err);
        setError(err.response?.data?.message || 'Error al conectar con el servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId]);

  const updateStudentStatus = (
    studentId: string,
    status: 'present' | 'late' | 'absent' | 'excused',
    remarks?: string,
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status, remarks: remarks !== undefined ? remarks : s.remarks } : s)),
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'present',
      })),
    );
  };

  const handleSave = async () => {
    if (!sessionId) return;
    try {
      setIsSaving(true);
      setError(null);

      // Si algún alumno quedó como unregistered, lo marcamos por defecto como present
      const records = students.map((s) => ({
        studentId: s.studentId,
        status: (s.status === 'unregistered' ? 'present' : s.status) as 'present' | 'late' | 'absent' | 'excused',
        remarks: s.remarks || undefined,
      }));

      await attendanceService.saveSessionAttendance(sessionId, {
        records,
        reason: adminReason || undefined,
      });

      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        navigate(-1);
      }, 1500);
    } catch (err: any) {
      console.error('Error guardando asistencia:', err);
      setError(err.response?.data?.message || 'No se pudo guardar la asistencia.');
    } finally {
      setIsSaving(false);
    }
  };

  const counts = {
    present: students.filter((s) => s.status === 'present').length,
    late: students.filter((s) => s.status === 'late').length,
    absent: students.filter((s) => s.status === 'absent').length,
    excused: students.filter((s) => s.status === 'excused').length,
    unregistered: students.filter((s) => s.status === 'unregistered').length,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
        <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Cargando lista de estudiantes y sesión...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <Card className="p-6 text-center space-y-3 max-w-md mx-auto">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
        <p className="text-sm font-semibold text-rose-600">{error}</p>
        <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </Card>
    );
  }

  const isAdmin = activeProfile?.role === 'school_admin';

  return (
    <div className="space-y-5 max-w-xl md:max-w-3xl mx-auto pb-24">
      {/* Botón Volver & Título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ChevronLeft className="h-5 w-5" />}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {session ? `${session.subjectName} • ${session.groupName}` : 'Planilla de Asistencia'}
            </h1>
            <p className="text-xs text-slate-500">
              {session ? `${session.date} • ${session.startTime.substring(0, 5)} a ${session.endTime.substring(0, 5)} • ${session.classroomName}` : `Sesión: ${sessionId}`}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={markAllPresent}
          leftIcon={<CheckCheck className="h-4 w-4 text-emerald-600" />}
        >
          Todos Presentes
        </Button>
      </div>

      {/* Regla de 72 Horas y Contador */}
      <Card glass className="border-sky-200/50 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-[#0EA5E9]" />
            <span className="text-sm font-bold text-slate-800">Control de la regla de 72 Horas:</span>
          </div>
          <Badge variant="warning" size="md" dot>
            Ventana activa
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Los docentes disponen de hasta 72 horas para registrar o corregir la asistencia. Los administradores pueden aplicar modificaciones extemporáneas con motivo justificado.
        </p>

        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Motivo de modificación institucional (Auditoría obligatoria si aplica):
            </label>
            <Input
              placeholder="Ej: Corrección autorizada por Coordinación Académica tras excusa médica"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              className="text-xs"
            />
          </div>
        )}
      </Card>

      {/* Resumen Rápido de Conteos */}
      <div className="grid grid-cols-4 gap-2.5 text-center">
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <p className="text-xl font-black text-[#16A34A]">{counts.present}</p>
          <p className="text-xs font-bold text-emerald-700">Presentes</p>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
          <p className="text-xl font-black text-[#D97706]">{counts.late}</p>
          <p className="text-xs font-bold text-amber-700">Tardes</p>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl">
          <p className="text-xl font-black text-[#E11D48]">{counts.absent}</p>
          <p className="text-xs font-bold text-rose-700">Ausentes</p>
        </div>
        <div className="p-3 bg-sky-50 border border-sky-100 rounded-2xl">
          <p className="text-xl font-black text-[#0EA5E9]">{counts.excused}</p>
          <p className="text-xs font-bold text-sky-700">Excusas</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista de Estudiantes */}
      <div>
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estudiantes Matriculados ({students.length})
          </h2>
          <span className="text-[11px] text-slate-400">Toca el estado o la fila para editar</span>
        </div>

        <InsetGroup>
          {students.map((student) => {
            return (
              <div
                key={student.studentId}
                onClick={() => {
                  setSelectedStudent(student);
                  setRemarksInput(student.remarks || '');
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Doc: {student.documentNumber} {student.remarks ? `• "${student.remarks}"` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => updateStudentStatus(student.studentId, 'present')}
                    className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === 'present'
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStudentStatus(student.studentId, 'late')}
                    className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === 'late'
                        ? 'bg-[#D97706] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    T
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStudentStatus(student.studentId, 'absent')}
                    className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === 'absent'
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStudentStatus(student.studentId, 'excused')}
                    className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === 'excused'
                        ? 'bg-[#0EA5E9] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    E
                  </button>
                </div>
              </div>
            );
          })}
        </InsetGroup>
      </div>

      {/* Barra Inferior Fija para Guardar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/60 z-30 flex items-center justify-center">
        <div className="max-w-xl md:max-w-3xl w-full flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            {counts.unregistered > 0
              ? `${counts.unregistered} sin registrar se guardarán como presentes.`
              : 'Todos los estados están asignados.'}
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto font-bold px-8 shadow-md"
            leftIcon={isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Guardando en BD...' : 'Guardar Asistencia'}
          </Button>
        </div>
      </div>

      {/* Bottom Sheet de Detalle del Estudiante */}
      {selectedStudent && (
        <BottomSheet
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
        >
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-xs text-slate-400 font-medium">Documento de Identidad:</p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedStudent.documentType} {selectedStudent.documentNumber}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-2">Seleccionar Estado:</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedStudent.status === 'present' ? 'primary' : 'secondary'}
                  size="md"
                  className={selectedStudent.status === 'present' ? 'bg-[#16A34A] border-[#16A34A]' : ''}
                  onClick={() => updateStudentStatus(selectedStudent.studentId, 'present')}
                >
                  Presente (P)
                </Button>
                <Button
                  variant={selectedStudent.status === 'late' ? 'primary' : 'secondary'}
                  size="md"
                  className={selectedStudent.status === 'late' ? 'bg-[#D97706] border-[#D97706]' : ''}
                  onClick={() => updateStudentStatus(selectedStudent.studentId, 'late')}
                >
                  Tardanza (T)
                </Button>
                <Button
                  variant={selectedStudent.status === 'absent' ? 'primary' : 'secondary'}
                  size="md"
                  className={selectedStudent.status === 'absent' ? 'bg-[#E11D48] border-[#E11D48]' : ''}
                  onClick={() => updateStudentStatus(selectedStudent.studentId, 'absent')}
                >
                  Inasistencia (A)
                </Button>
                <Button
                  variant={selectedStudent.status === 'excused' ? 'primary' : 'secondary'}
                  size="md"
                  className={selectedStudent.status === 'excused' ? 'bg-[#0EA5E9] border-[#0EA5E9]' : ''}
                  onClick={() => updateStudentStatus(selectedStudent.studentId, 'excused')}
                >
                  Excusado (E)
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">
                Observaciones o Justificación:
              </label>
              <Input
                placeholder="Ej. Llegó 15 min tarde por cita odontológica..."
                value={remarksInput}
                onChange={(e) => setRemarksInput(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold mt-2"
              onClick={() => {
                updateStudentStatus(
                  selectedStudent.studentId,
                  (selectedStudent.status === 'unregistered' ? 'present' : selectedStudent.status) as any,
                  remarksInput,
                );
                setSelectedStudent(null);
              }}
            >
              Confirmar Cambios
            </Button>
          </div>
        </BottomSheet>
      )}

      {/* Toast de Éxito */}
      {successToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#16A34A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5" />
          <span>¡Asistencia guardada exitosamente en el servidor!</span>
        </div>
      )}
    </div>
  );
};
