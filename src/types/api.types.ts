export interface ApiResponse<TData> {
  statusCode: number;
  success: boolean;
  message: string;
  data: TData;
  meta?: PaginatedMeta;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export interface LoginErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  requestId: string;
  errorSource: {
    path: string;
    message: string;
  }[];
}

export interface JobSeekerProfileResponse {
  id: string;
  userId: string;
  resumeUrl: string;
  portfolioUrl: string;
  bio: string;
  skills: string[];
  experience: string[];
  education: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
type USER_ROLE = "CUSTOMER" | "PROVIDER" | "ADMIN";
type USER_STATUS = "ACTIVE" | "BLOCKED" | "DELETED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: USER_ROLE;
  status: USER_STATUS;
  isDeleted: boolean;
  deletedAt?: Date | string | null;
  needPasswordReset: boolean;
  rememberMe: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  restaurant?: any;
  sessions?: any[];
  accounts?: any[];
  orders?: any[];
}
