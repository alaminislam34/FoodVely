import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";
import { APIResponse } from "./auth.service";

/* -----------------------------
   CLEAN PAYLOAD (JSON ONLY)
------------------------------*/
export type RestaurantPayload = {
  restaurantName: string;
  description?: string;
  city: string;
  address: string;
  contactNumber: string;
  cuisine?: string;
  openingHours?: string;
  foodCategories: string[];
};

/* -----------------------------
   FORM DATA TYPE (UPLOAD ONLY)
------------------------------*/
export type RestaurantFormData = {
  logoFile?: File | null;
  coverImageFile?: File | null;
};

/* -----------------------------
   GET RESTAURANT
------------------------------*/
const getRestaurant = async (slug: string) => {
  const res = await httpClient.get(API_ENDPOINTS.GET_RESTAURANT(slug));
  return res;
};

/* -----------------------------
   CREATE RESTAURANT
------------------------------*/
const createRestaurant = async (
  payload: RestaurantPayload & RestaurantFormData,
): Promise<APIResponse<unknown, unknown>> => {
  const formData = new FormData();

  // 1. append normal fields
  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      key !== "logoFile" &&
      key !== "coverImageFile"
    ) {
      formData.append(key, JSON.stringify(value));
    }
  });

  // 2. append files
  if (payload.logoFile instanceof File) {
    formData.append("logo", payload.logoFile);
  }

  if (payload.coverImageFile instanceof File) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const res = await httpClient.post(API_ENDPOINTS.CREATE_RESTAURANT, formData);

  return res;
};

/* -----------------------------
   EXPORT
------------------------------*/
export const restaurantService = {
  createRestaurant,
  getRestaurant,
};
