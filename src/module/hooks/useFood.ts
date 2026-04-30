import { useState } from "react";
import toast from "react-hot-toast";
import { foodService, IFoodPayload } from "../services/food.service";

export function useFood() {
  const [isLoading, setIsLoading] = useState(false);

  const createFood = async (data: IFoodPayload) => {
    setIsLoading(true);
    const toastId = toast.loading("Creating your delicious dish...");
    try {
      const res = await foodService.createFood(data);
      toast.success("Food created successfully!", { id: toastId });
      return res;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to create food";
      toast.error(message, { id: toastId });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFood = async (id: string, data: Partial<IFoodPayload>) => {
    setIsLoading(true);
    const toastId = toast.loading("Updating dish details...");
    try {
      const res = await foodService.updateFood(id, data);
      toast.success("Food updated successfully!", { id: toastId });
      return res;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update food";
      toast.error(message, { id: toastId });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createFood, updateFood, isLoading };
}
