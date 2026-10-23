export interface UserItem {
  id: string;
  identityId: string;
  email: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: string;
  role: 'school_admin' | 'group_director' | 'teacher' | 'student';
  isGroupDirector: boolean;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  isIdentityActive: boolean;
  createdAt: string;
}

export interface UserListResponse {
  data: UserItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface QueryUserParams {
  role?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: string;
  role: 'school_admin' | 'group_director' | 'teacher' | 'student';
  phone?: string;
  address?: string;
}
