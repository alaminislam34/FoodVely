import toast from "react-hot-toast";
import { foodService, IFoodPayload } from "../services/food.service";

export function useFood() {
  const createFood = async (data: IFoodPayload) => {
    try {
      const res = await foodService.createFood(data);
      toast.success("Food created successfully!");
      return res;
    } catch (error: unknown) {
      toast.error("Failed to create food. Please try again.");
      throw error;
    }
  };

  const updateFood = async (id: string, data: IFoodPayload) => {
    try {
      const res = await foodService.updateFood(id, data);
      toast.success("Food updated successfully!");
      return res;
    } catch (error: unknown) {
      toast.error("Failed to update food. Please try again.");
      throw error;
    }
  };

  return { createFood, updateFood };
}
