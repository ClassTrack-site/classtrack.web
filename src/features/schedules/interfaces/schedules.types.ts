export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado, 7: Domingo
  startTime: string;
  endTime: string;
  validFrom: string;
  validTo?: string | null;
  isActive: boolean;
  classroomId: string;
  classroomName: string;
  classroomCapacity: number;
  groupId: string;
  groupName: string;
  grade: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherFirstName: string;
  teacherLastName: string;
}

export interface QueryScheduleParams {
  groupId?: string;
  teacherId?: string;
  classroomId?: string;
  dayOfWeek?: number;
}
