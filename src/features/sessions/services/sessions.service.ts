import { apiClient } from '@/shared/services/api/apiClient';
import type { SessionItem, SessionListResponse, QuerySessionParams } from '../interfaces/sessions.types';

export const sessionsService = {
  async getSessions(params?: QuerySessionParams): Promise<SessionListResponse> {
    const response = await apiClient.get<SessionListResponse>('/sessions', { params });
    return response.data;
  },

  async getSessionById(id: string): Promise<SessionItem> {
    const response = await apiClient.get<SessionItem>(`/sessions/${id}`);
    return response.data;
  },

  async reschedule(id: string, dto: { newDate: string; newStartTime: string; newEndTime: string; newClassroomId?: string }): Promise<SessionItem> {
    const response = await apiClient.post<SessionItem>(`/sessions/${id}/reschedule`, dto);
    return response.data;
  },

  async cancel(id: string, dto: { reason: string }): Promise<SessionItem> {
    const response = await apiClient.post<SessionItem>(`/sessions/${id}/cancel`, dto);
    return response.data;
  },
};
