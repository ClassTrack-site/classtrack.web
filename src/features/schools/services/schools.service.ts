import { apiClient } from '@/shared/services/api/apiClient';
import type { SchoolItem, CreateSchoolPayload } from '../interfaces/schools.types';

export const schoolsService = {
  async getSchools(): Promise<SchoolItem[]> {
    const response = await apiClient.get<SchoolItem[]>('/schools');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async getSchoolById(id: string): Promise<SchoolItem> {
    const response = await apiClient.get<SchoolItem>(`/schools/${id}`);
    return response.data;
  },

  async createSchool(payload: CreateSchoolPayload): Promise<SchoolItem> {
    const response = await apiClient.post<SchoolItem>('/schools', payload);
    return response.data;
  },
};
