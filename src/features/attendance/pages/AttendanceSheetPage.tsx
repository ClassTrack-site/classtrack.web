import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Badge, Button, InsetGroup, BottomSheet } from '@/shared/components/ui';
import { CheckCircle2, ChevronLeft, Clock, Save } from 'lucide-react';

interface StudentRow {
  id: string;
  name: string;
  doc: string;
  status: 'present' | 'late' | 'absent' | 'excused';
}

const INITIAL_STUDENTS: StudentRow[] = [
  { id: '1', name: 'Sofía Martínez Gómez', doc: '30000001', status: 'present' },
  { id: '2', name: 'Mateo Alejandro Rodríguez', doc: '30000002', status: 'present' },
  { id: '3', name: 'Valentina Restrepo Torres', doc: '30000003', status: 'absent' },
  { id: '4', name: 'Samuel David Castaño', doc: '30000004', status: 'late' },
  { id: '5', name: 'Isabella Morales Castro', doc: '30000005', status: 'present' },
  { id: '6', name: 'Nicolás Daniel Pineda', doc: '30000006', status: 'excused' },
  { id: '7', name: 'Mariana Duque Ruiz', doc: '30000007', status: 'present' },
  { id: '8', name: 'Juan Esteban Vélez', doc: '30000008', status: 'present' },
  { id: '9', name: 'Camila Ospina Henao', doc: '30000009', status: 'present' },
  { id: '10', name: 'Lucas Gabriel Herrera', doc: '30000010', status: 'present' },
];

export const AttendanceSheetPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const updateStudentStatus = (id: string, status: StudentRow['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const handleSave = () => {
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      navigate('/teacher/today');
    }, 1500);
  };

  const counts = {
    present: students.filter((s) => s.status === 'present').length,
    late: students.filter((s) => s.status === 'late').length,
    absent: students.filter((s) => s.status === 'absent').length,
    excused: students.filter((s) => s.status === 'excused').length,
  };

  return (
    <div className="space-y-5 max-w-xl md:max-w-3xl mx-auto pb-16">
      {/* Botón Volver & Título */}
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
            Planilla: Matemáticas 9-A
          </h1>
          <p className="text-xs text-slate-500">Sesión: {sessionId || 'Actual'}</p>
        </div>
      </div>

      {/* Regla de 72 Horas y Contador */}
      <Card glass className="border-sky-200/50 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-[#0EA5E9]" />
            <span className="text-sm font-bold text-slate-800">Ventana de edición:</span>
          </div>
          <Badge variant="warning" size="md" dot>
            71h 38m restantes
          </Badge>
        </div>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Puedes registrar o corregir la asistencia sin autorización hasta cumplidas las 72 horas de inicio de clase.
        </p>
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
          <p className="text-xl font-black text-[#DC2626]">{counts.absent}</p>
          <p className="text-xs font-bold text-rose-700">Ausentes</p>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-xl font-black text-[#2563EB]">{counts.excused}</p>
          <p className="text-xs font-bold text-blue-700">Excusas</p>
        </div>
      </div>

      {/* Lista Agrupada Inset con Botones Táctiles Directos */}
      <InsetGroup title="Listado de Estudiantes">
        {students.map((student) => (
          <div
            key={student.id}
            className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
          >
            <div
              className="min-w-0 flex-1 cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <p className="text-base font-bold text-slate-900 truncate">{student.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Doc: {student.doc}</p>
            </div>

            {/* Botones de Selección Rápida P / T / A / E Grandes y Cómodos */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateStudentStatus(student.id, 'present')}
                className={`h-10 w-10 rounded-2xl font-black text-sm transition-all active:scale-90 ${
                  student.status === 'present'
                    ? 'bg-[#16A34A] text-white shadow-sm shadow-emerald-500/30 animate-ios-pulse'
                    : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                title="Presente"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => updateStudentStatus(student.id, 'late')}
                className={`h-10 w-10 rounded-2xl font-black text-sm transition-all active:scale-90 ${
                  student.status === 'late'
                    ? 'bg-[#D97706] text-white shadow-sm shadow-amber-500/30 animate-ios-pulse'
                    : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700'
                }`}
                title="Tarde"
              >
                T
              </button>
              <button
                type="button"
                onClick={() => updateStudentStatus(student.id, 'absent')}
                className={`h-10 w-10 rounded-2xl font-black text-sm transition-all active:scale-90 ${
                  student.status === 'absent'
                    ? 'bg-[#DC2626] text-white shadow-sm shadow-rose-500/30 animate-ios-pulse'
                    : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700'
                }`}
                title="Ausente"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => updateStudentStatus(student.id, 'excused')}
                className={`h-10 w-10 rounded-2xl font-black text-sm transition-all active:scale-90 ${
                  student.status === 'excused'
                    ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/30 animate-ios-pulse'
                    : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                }`}
                title="Excusado"
              >
                E
              </button>
            </div>
          </div>
        ))}
      </InsetGroup>

      {/* Botón Guardar Flotante */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full font-bold shadow-lg shadow-sky-500/25"
          onClick={handleSave}
          leftIcon={<Save className="h-5 w-5" />}
        >
          Guardar Asistencia de la Clase
        </Button>
      </div>

      {/* Toast de Confirmación */}
      {isSavedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="h-4 w-4" />
          <span>¡Asistencia guardada exitosamente!</span>
        </div>
      )}

      {/* BottomSheet de Detalle del Estudiante */}
      <BottomSheet
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.name}
        subtitle={`Documento: ${selectedStudent?.doc}`}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Selecciona el estado individual o agrega una observación de asistencia:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedStudent.status === 'present' ? 'primary' : 'outline'}
                className={selectedStudent.status === 'present' ? 'bg-[#16A34A] hover:bg-emerald-700' : ''}
                onClick={() => {
                  updateStudentStatus(selectedStudent.id, 'present');
                  setSelectedStudent(null);
                }}
              >
                [P] Presente
              </Button>
              <Button
                variant={selectedStudent.status === 'late' ? 'primary' : 'outline'}
                className={selectedStudent.status === 'late' ? 'bg-[#D97706] hover:bg-amber-700' : ''}
                onClick={() => {
                  updateStudentStatus(selectedStudent.id, 'late');
                  setSelectedStudent(null);
                }}
              >
                [T] Tarde
              </Button>
              <Button
                variant={selectedStudent.status === 'absent' ? 'primary' : 'outline'}
                className={selectedStudent.status === 'absent' ? 'bg-[#DC2626] hover:bg-rose-700' : ''}
                onClick={() => {
                  updateStudentStatus(selectedStudent.id, 'absent');
                  setSelectedStudent(null);
                }}
              >
                [A] Ausente
              </Button>
              <Button
                variant={selectedStudent.status === 'excused' ? 'primary' : 'outline'}
                className={selectedStudent.status === 'excused' ? 'bg-[#2563EB] hover:bg-blue-700' : ''}
                onClick={() => {
                  updateStudentStatus(selectedStudent.id, 'excused');
                  setSelectedStudent(null);
                }}
              >
                [E] Excusado
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
