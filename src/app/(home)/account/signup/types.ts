export type UserRole = "CUSTOMER" | "PROVIDER";

export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
  restaurantName?: string;
  address?: string;
  city?: string;
  deliveryFee?: number;
  minimumOrder?: number;
  cuisineTypes: string[];
}
