import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";
import { APIResponse } from "./auth.service";
import { IUserRestaurantResponse } from "@/types/api.types";

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

export type RestaurantFormData = {
  logoFile?: File | null;
  coverImageFile?: File | null;
};

const getRestaurant = async () => {
  const res = await httpClient.get(
    API_ENDPOINTS.RESTAURANT.GET_RESTAURANT_PROFILE,
  );
  return res.data as IUserRestaurantResponse;
};

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
  const res = await httpClient.post(
    API_ENDPOINTS.RESTAURANT.CREATE_RESTAURANT,
    formData,
  );
  return res;
};

const updateRestaurant = async (
  payload: Partial<RestaurantPayload & RestaurantFormData>,
): Promise<APIResponse<unknown, unknown>> => {
  const formData = new FormData() as FormData & Record<string, any>;

  Object.entries(payload).forEach(([key, value]) => {
    const skipFields = ["logoFile", "coverImageFile", "logo", "coverImage"];

    if (value !== undefined && value !== null && !skipFields.includes(key)) {
      if (key === "foodCategories" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  if (payload.logoFile instanceof File) {
    formData.append("logo", payload.logoFile);
  }

  if (payload.coverImageFile instanceof File) {
    formData.append("coverImage", payload.coverImageFile);
  }

  const updateUrl = `${API_ENDPOINTS.RESTAURANT.UPDATE_API}`;

  try {
    const res = await httpClient.put(updateUrl, formData);
    return res;
  } catch (error) {
    console.error("Frontend Update Error:", error);
    throw error;
  }
};

export const restaurantService = {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
};
