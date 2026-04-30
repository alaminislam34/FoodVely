import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService, ICategory } from "../services/category.service";
import toast from "react-hot-toast";

export function useCategory() {
  const queryClient = useQueryClient();

  // ---------------- GET ----------------
  const {
    data: categoriesForPublic = [] as ICategory[],
    isLoading,
    isError,
    refetch: refetchPublicCategories,
  } = useQuery<ICategory[]>({
    queryKey: ["categories", "public"],
    queryFn: categoryService.getAllCategoriesForPublic,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: adminCategories = [] as ICategory[],
    isLoading: isAdminCategoriesLoading,
    refetch: refetchAdminCategories,
  } = useQuery<ICategory[]>({
    queryKey: ["categories", "admin"],
    queryFn: categoryService.getAllCategoriesForAdmin,
  });

  // ---------------- CREATE ----------------
  const createCategoryMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      toast.success("Category created successfully!");
      // Invalidate both to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category",
      );
    },
  });

  // ---------------- UPDATE ----------------
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      toast.success("Category updated!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  // ---------------- DELETE ----------------
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  // ---------------- ACTIVATE ----------------
  const activateCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.activateCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "admin"] });
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  // ---------------- DEACTIVATE ----------------
  const deactivateCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deactivateCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "admin"] });
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  return {
    categoriesForPublic,
    adminCategories,
    isLoading,
    isAdminCategoriesLoading,
    isError,
    // Return the mutation objects or specific trigger functions
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isPending,
    refetchPublicCategories,
    refetchAdminCategories,
    activateCategory: activateCategoryMutation.mutateAsync,
    deactivateCategory: deactivateCategoryMutation.mutateAsync,
  };
}
