import { useMutation, useQuery } from "@tanstack/react-query";
import {
  restaurantService,
  RestaurantPayload,
} from "../services/restaurant.service";

export function useRestaurant() {
  const { mutate, data, isPending } = useMutation({
    mutationFn: (targetSlug: string) =>
      restaurantService.getRestaurant(targetSlug),
    onSuccess: (data) => {
      console.log("Fetched successfully:", data);
    },
  });

  const createRestaurant = useMutation({
    mutationFn: async (payload: RestaurantPayload) =>
      restaurantService.createRestaurant(payload),
    onSuccess: (data) => {
      console.log("Restaurant created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating restaurant:", error);
    },
  });

  return {
    getRestaurant: mutate,
    restaurantData: data,
    isFetchingRestaurant: isPending,
    createRestaurant: createRestaurant.mutate,
    isCreatingRestaurant: createRestaurant.isPending,
  };
}
