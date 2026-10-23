export type AttendanceStatusType = 'present' | 'absent' | 'late' | 'excused' | 'unregistered';

export interface StudentAttendanceItem {
  studentId: string;
  documentNumber: string;
  documentType: string;
  firstName: string;
  lastName: string;
  email: string;
  recordId: string | null;
  status: AttendanceStatusType;
  remarks: string | null;
  recordedAt: string | null;
}

export interface AttendanceSummary {
  totalStudents: number;
  presents: number;
  absents: number;
  lates: number;
  excused: number;
  unregistered: number;
  attendancePercentage: number;
}

export interface SessionAttendanceResponse {
  sessionId: string;
  sessionDate: string;
  sessionStatus: string;
  summary: AttendanceSummary;
  students: StudentAttendanceItem[];
}

export interface SaveAttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface SaveSessionAttendancePayload {
  records: SaveAttendanceRecord[];
  reason?: string;
}

export interface AttendanceAuditLog {
  id: string;
  studentName: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  changedBy: string;
  changedAt: string;
}
