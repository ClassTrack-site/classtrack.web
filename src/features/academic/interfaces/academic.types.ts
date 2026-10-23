export interface AcademicGroup {
  id: string;
  name: string;
  grade: string;
  schoolYear: number;
  directorId?: string | null;
  directorFirstName?: string | null;
  directorLastName?: string | null;
  directorEmail?: string | null;
  studentCount: number;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
}

export interface ClassroomItem {
  id: string;
  name: string;
  code: string;
  capacity: number;
  location?: string | null;
  isActive: boolean;
}

export interface CalendarEventItem {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string | null;
}

export interface GroupEnrollmentItem {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  documentNumber: string;
  documentType: string;
  email: string;
  enrolledAt: string;
}
