import { apiClient } from '@/shared/services/api/apiClient';
import type {
  UserItem,
  UserListResponse,
  QueryUserParams,
  CreateUserPayload,
} from '../interfaces/users.types';

export const usersService = {
  async getUsers(params?: QueryUserParams): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>('/users', { params });
    return response.data;
  },

  async getUserById(id: string): Promise<UserItem> {
    const response = await apiClient.get<UserItem>(`/users/${id}`);
    return response.data;
  },

  async createUser(payload: CreateUserPayload): Promise<UserItem> {
    const response = await apiClient.post<UserItem>('/users', payload);
    return response.data;
  },

  async retireUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.patch(`/users/${id}/retire`);
    return response.data;
  },

  async reactivateUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.patch(`/users/${id}/reactivate`);
    return response.data;
  },

  async resendActivation(id: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/users/${id}/resend-activation`);
    return response.data;
  },
};
