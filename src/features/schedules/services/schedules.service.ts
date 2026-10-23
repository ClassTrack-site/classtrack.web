import { apiClient } from '@/shared/services/api/apiClient';
import type { ScheduleItem, QueryScheduleParams } from '../interfaces/schedules.types';

export const schedulesService = {
  async getSchedules(params?: QueryScheduleParams): Promise<ScheduleItem[]> {
    const response = await apiClient.get<ScheduleItem[]>('/schedules', { params });
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async createSchedule(dto: any): Promise<ScheduleItem> {
    const response = await apiClient.post<ScheduleItem>('/schedules', dto);
    return response.data;
  },

  async deleteSchedule(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/schedules/${id}`);
    return response.data;
  },
};
