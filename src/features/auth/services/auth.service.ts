import { apiClient } from '@/shared/services/api/apiClient';
import type { LoginRequestDto, LoginResponseDto } from '../interfaces/auth.types';

export const authService = {
  async login(dto: LoginRequestDto, schoolSlugOrId?: string): Promise<LoginResponseDto> {
    const headers: Record<string, string> = {};
    if (schoolSlugOrId) {
      headers['x-school-slug'] = schoolSlugOrId;
    }
    const response = await apiClient.post<LoginResponseDto>('/auth/login', dto, { headers });
    return response.data;
  },

  async activate(token: string, password: string):Promise<{ message: string }> {
    const response = await apiClient.post('/auth/activate', { token, password });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
