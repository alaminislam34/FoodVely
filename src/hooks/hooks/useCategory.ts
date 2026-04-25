import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export function useCategory() {
  const queryClient = useQueryClient();

  // ---------------- GET ----------------
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAllCategoriesForPublic,
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
    isLoading,
    isError,
    error,
    createCategory,
    updateCategory,
  };
}
