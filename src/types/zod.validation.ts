import { z } from "zod";

export const foodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description should be more detailed"),
  shortDescription: z
    .string()
    .max(100, "Keep it short for UI cards")
    .optional(),
  basePrice: z.coerce.number().min(1, "Price must be at least 1"),
  discountPrice: z.coerce.number().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  stock: z.coerce.number().min(0).default(0),
  isFeatured: z.boolean().default(false),
  // Nested JSON Object for foodInfo
  foodInfo: z.object({
    isVeg: z.boolean().default(false),
    isSpicy: z.boolean().default(false),
    calories: z.coerce.number().optional(),
    preparationTime: z.coerce.number().min(1, "Enter prep time").default(15),
  }),
  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type FoodFormValues = z.infer<typeof foodSchema>;
