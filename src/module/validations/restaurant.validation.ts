import { z } from "zod";

export const CreateRestaurantSchema = z.object({
  restaurantName: z.string().trim().min(2, "Name is too short"),
  city: z.string().trim().min(2, "City is required"),
  address: z.string().trim().min(5, "Full address is required"),
  contactNumber: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{10,14}$/,
      "Valid contact number is required (e.g., +88017...)",
    ),
  foodCategories: z.array(z.string()).optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
  cuisine: z.string().optional().or(z.literal("")),
  openingHours: z.string().optional().or(z.literal("")),
  logoFile: z.any().refine((file) => file instanceof File, "Logo is required"),
  coverImageFile: z
    .any()
    .refine((file) => file instanceof File, "Cover image is required"),
});
