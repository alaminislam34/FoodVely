import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";
import { APIResponse } from "./auth.service";
import { object } from "zod";

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

  // Append all text fields except file fields
  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      key !== "logoFile" &&
      key !== "coverImageFile" &&
      key !== "logo" && // <-- Prevent sending logo as object
      key !== "coverImage" // <-- Prevent sending coverImage as object
    ) {
      if (key === "foodCategories") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }
  });

  // Append files
  if (payload.logoFile instanceof File) {
    formData.append("logo", payload.logoFile);
  }
  if (payload.coverImageFile instanceof File) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const formDataToObject = (formData: FormData) =>
    Object.fromEntries(formData.entries());

  console.log(formDataToObject(formData));

  // Do NOT set Content-Type header manually!
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
