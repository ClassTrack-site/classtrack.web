import { apiClient } from '@/shared/services/api/apiClient';
import type {
  AcademicGroup,
  SubjectItem,
  ClassroomItem,
  CalendarEventItem,
  GroupEnrollmentItem,
} from '../interfaces/academic.types';

export const academicService = {
  async getGroups(): Promise<AcademicGroup[]> {
    const response = await apiClient.get<AcademicGroup[]>('/academic/groups');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async getSubjects(): Promise<SubjectItem[]> {
    const response = await apiClient.get<SubjectItem[]>('/academic/subjects');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async getClassrooms(): Promise<ClassroomItem[]> {
    const response = await apiClient.get<ClassroomItem[]>('/academic/classrooms');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async getCalendar(): Promise<CalendarEventItem[]> {
    const response = await apiClient.get<CalendarEventItem[]>('/academic/calendar');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async getGroupEnrollments(groupId: string): Promise<GroupEnrollmentItem[]> {
    const response = await apiClient.get<GroupEnrollmentItem[]>(`/academic/enrollments/group/${groupId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  },
};
