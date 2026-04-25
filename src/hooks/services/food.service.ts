import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

const createFood = async (data: FormData) => {
  const res = await httpClient.post(API_ENDPOINTS.FOOD.CREATE, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};
