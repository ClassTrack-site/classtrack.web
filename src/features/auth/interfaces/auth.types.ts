export type Role = 'general_admin' | 'school_admin' | 'teacher' | 'student';

export interface UserIdentity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isGlobalAdmin: boolean;
}

export interface UserSchoolProfile {
  userId: string;
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  role: Role;
  isGroupDirector?: boolean;
  documentNumber?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: UserIdentity;
  activeProfile: UserSchoolProfile | null;
  availableProfiles: UserSchoolProfile[];
}

export interface LoginRequestDto {
  email: string;
  password: string;
}
