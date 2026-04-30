import { useMutation, useQuery } from "@tanstack/react-query";
import {
  restaurantService,
  RestaurantPayload,
} from "../services/restaurant.service";

export function useRestaurant() {
  const { data: restaurantProfile, isLoading: isFetchingRestaurant } = useQuery(
    {
      queryKey: ["restaurant"],
      queryFn: () => restaurantService.getRestaurant(),
      staleTime: 5 * 60 * 1000,
    },
  );

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

  const updateRestaurant = useMutation({
    mutationFn: async (payload: Partial<RestaurantPayload>) => {
      console.log(payload);
      return restaurantService.updateRestaurant(payload);
    },

    onSuccess: (data) => {
      console.log("Restaurant updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating restaurant:", error);
    },
  });

  return {
    restaurantProfile,
    isFetchingRestaurant,
    createRestaurant: createRestaurant.mutate,
    isCreatingRestaurant: createRestaurant.isPending,
    updateRestaurant: updateRestaurant.mutate,
    isUpdatingRestaurant: updateRestaurant.isPending,
  };
}
