import { apiClient } from '@/shared/services/api/apiClient';
import type { DashboardStatsResponse } from '../interfaces/dashboard.types';

export const dashboardService = {
  async getStats(): Promise<DashboardStatsResponse> {
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
    return response.data;
  },
};
