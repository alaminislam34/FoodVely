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
/* -----------------------------
   ENUM TYPES
------------------------------*/
export type UserRole = "ADMIN" | "PROVIDER" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "DELETED" | "BLOCKED";

/* -----------------------------
   RESTAURANT (SHORT VERSION)
------------------------------*/
export interface IUserRestaurant {
  id: string;
  userId: string;
  restaurantName: string;
  slug: string;
  description: string | null;
  city: string;

  providerName: string | null;
  providerEmail: string | null;
  providerImage: string | null;

  address: string;
  contactNumber: string | null;
  cuisine: string | null;
  openingHours: string | null;

  logo: string | null;
  coverImage: string | null;

  rating: number;
  totalOrders: number;

  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

/* -----------------------------
   ORDER (MINIMAL - expand later)
------------------------------*/
export interface IUserOrder {
  id: string;
  status: string;
  totalPrice?: number;
  createdAt?: string;
}

/* -----------------------------
   USER PROFILE DATA
------------------------------*/
export interface IUserProfile {
  id: string;
  name: string;
  email: string;

  role: UserRole;
  status: UserStatus;

  image: string | null;

  isDeleted: boolean;
  deletedAt: string | null;

  emailVerified: boolean;
  needPasswordReset: boolean;

  createdAt: string;
  updatedAt: string;

  restaurant: IUserRestaurant | null;
  orders: IUserOrder[];
}

/* -----------------------------
   MAIN RESPONSE
------------------------------*/
export interface IUserProfileResponse {
  success: boolean;
  message: string;
  data: IUserProfile;
  meta: {
    requestId: string;
  };
}
