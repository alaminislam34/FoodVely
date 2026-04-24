export type AccountFormData = {
  fullName: string;
  email: string;
  password: string;
};

export type RestaurantFormData = {
  restaurantName: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  contactNumber: string;
  cuisine: string;
  openingHours: string;
  logoFile: File | null;
  coverImageFile: File | null;
  foodCategories: string[];
};

export type FieldErrors = Record<string, string>;

