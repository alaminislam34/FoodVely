import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export type Category = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export function useCategory() {
  const queryClient = useQueryClient();

  // ---------------- GET ----------------
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoryService.getAllCategoriesForPublic,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: adminCategories = [],
    isLoading: isAdminCategoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ["adminCategories"],
    queryFn: categoryService.getAllCategoriesForAdmin,
    staleTime: 5 * 60 * 1000,
  });

  // ---------------- CREATE ----------------
  const createCategory = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // ✅ BEST
    },
  });

  // ---------------- UPDATE ----------------
  const updateCategory = useMutation({
    mutationFn: ({ id, ...payload }: any) =>
      categoryService.updateCategory(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    adminCategories,
    isLoading,
    isAdminCategoriesLoading,
    isError,
    error,
    createCategory,
    updateCategory,
  };
}
