export type ImportType = 'students' | 'teachers' | 'schedules';

export interface ImportErrorItem {
  row: number;
  column?: string;
  message: string;
}

export interface BulkImportResponse {
  success: boolean;
  message: string;
  totalRows: number;
  importedCount: number;
  errors?: ImportErrorItem[];
}
