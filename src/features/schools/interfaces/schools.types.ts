export interface SchoolItem {
  id: string;
  name: string;
  code: string;
  slug: string;
  schemaName: string;
  timezone: string;
  isActive: boolean;
  contactEmail?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
}

export interface CreateSchoolPayload {
  name: string;
  code: string;
  slug: string;
  timezone: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
}
