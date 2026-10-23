export interface SessionItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  cancellationReason?: string | null;
  originalSessionId?: string | null;
  groupId: string;
  groupName: string;
  grade: string;
  subjectId: string;
  subjectName: string;
  classroomId: string;
  classroomName: string;
  teacherId: string;
  teacherFirstName: string;
  teacherLastName: string;
}

export interface SessionListResponse {
  data: SessionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface QuerySessionParams {
  date?: string;
  teacherId?: string;
  groupId?: string;
  classroomId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
