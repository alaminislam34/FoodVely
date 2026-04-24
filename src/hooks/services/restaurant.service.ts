import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";
import { APIResponse } from "./auth.service";

export type RestaurantSubmitPayload = {
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
  [key: string]: unknown;
};

const getRestaurant = async (slug: string) => {
  const res = await httpClient.get(API_ENDPOINTS.GET_RESTAURANT(slug));
  return res;
};

const createRestaurant = async (
  payload: RestaurantSubmitPayload,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.CREATE_RESTAURANT, payload);
  return res;
};

export const restaurantService = {
  createRestaurant,
  getRestaurant,
};
