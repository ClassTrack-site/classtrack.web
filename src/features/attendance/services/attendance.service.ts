import { apiClient } from '@/shared/services/api/apiClient';
import type {
  SessionAttendanceResponse,
  SaveSessionAttendancePayload,
  AttendanceAuditLog,
} from '../interfaces/attendance.types';

export const attendanceService = {
  async getSessionAttendance(sessionId: string): Promise<SessionAttendanceResponse> {
    const response = await apiClient.get<SessionAttendanceResponse>(`/attendance/session/${sessionId}`);
    return response.data;
  },

  async saveSessionAttendance(
    sessionId: string,
    payload: SaveSessionAttendancePayload,
  ): Promise<{ success: boolean; message: string; updatedCount: number }> {
    const response = await apiClient.post(`/attendance/session/${sessionId}`, payload);
    return response.data;
  },

  async getSessionAudit(sessionId: string): Promise<AttendanceAuditLog[]> {
    const response = await apiClient.get<AttendanceAuditLog[]>(`/attendance/session/${sessionId}/audit`);
    return response.data;
  },
};
