import { z } from "zod";

export const CreateRestaurantSchema = z.object({
  restaurantName: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  contactNumber: z.string().min(1),
  // Accept string or array, and always transform to array
  foodCategories: z.array(z.string()),
  description: z.string().optional(),
  cuisine: z.string().optional(),
  openingHours: z.string().optional(),
  // Accept string (file path) or undefined
  logo: z.instanceof(File).nullable().optional(),
  coverImage: z.instanceof(File).nullable().optional(),
});
