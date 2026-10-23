import { apiClient } from '@/shared/services/api/apiClient';
import type { ImportType, BulkImportResponse } from '../interfaces/imports.types';

export const importsService = {
  async downloadTemplate(type: ImportType): Promise<Blob> {
    const response = await apiClient.get(`/imports/templates/${type}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async uploadFile(type: ImportType, file: File): Promise<BulkImportResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<BulkImportResponse>(`/imports/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
