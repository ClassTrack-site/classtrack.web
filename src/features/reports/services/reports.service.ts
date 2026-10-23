import { apiClient } from '@/shared/services/api/apiClient';

export interface ExportReportPayload {
  groupId: string;
  startDate: string;
  endDate: string;
  subjectId?: string;
}

export const reportsService = {
  async downloadExcel(dto: ExportReportPayload): Promise<Blob> {
    const response = await apiClient.post('/reports/excel', dto, {
      responseType: 'blob',
    });
    return response.data;
  },
};
