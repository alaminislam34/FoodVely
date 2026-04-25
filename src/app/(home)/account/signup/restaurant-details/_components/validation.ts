import { z } from "zod";

export const CreateRestaurantSchema = z.object({
  restaurantName: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  contactNumber: z.string().min(1),
  foodCategories: z.array(z.string()),
  description: z.string().optional(),
  cuisine: z.string().optional(),
  openingHours: z.string().optional(),
  logoFile: z.instanceof(File).nullable().optional(),
  coverImageFile: z.instanceof(File).nullable().optional(),
});
