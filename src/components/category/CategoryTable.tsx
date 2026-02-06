"use client";

import { useMemo, useState } from "react";
import { useAdminCategories, useCategories, useDeleteCategory } from "@/hooks/category.hooks";

type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";

type Category = {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
};

interface CategoryTableProps {
  role: Role;
  onEdit?: (category: Category) => void;
  pageSize?: number;
}

function normalizeCategories(payload: unknown): { items: Category[]; totalPages?: number } {
  const data = (payload as { data?: unknown } | undefined)?.data ?? payload;
  if (Array.isArray(data)) {
    return { items: data as Category[] };
  }
  const items =
    (data as { data?: Category[] } | undefined)?.data ??
    (data as { items?: Category[] } | undefined)?.items ??
    [];
  const totalPages = (data as { totalPages?: number } | undefined)?.totalPages;
  return { items, totalPages };
}

export default function CategoryTable({ role, onEdit, pageSize = 10 }: CategoryTableProps) {
  const [page, setPage] = useState(1);
  const isAdmin = role === "ADMIN";
  const isEditable = role === "ADMIN" || role === "PROVIDER";

  const adminQuery = useAdminCategories(isAdmin ? { page, limit: pageSize } : undefined);
  const userQuery = useCategories(!isAdmin ? { page, limit: pageSize } : undefined);

  const query = isAdmin ? adminQuery : userQuery;
  const { items, totalPages } = useMemo(() => normalizeCategories(query.data), [query.data]);

  const deleteMutation = useDeleteCategory();

  const handleDelete = async (id: string) => {
    if (!isEditable) return;
    if (!window.confirm("Delete this category?")) return;
    await deleteMutation.mutateAsync(id);
  };

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : items.length === pageSize;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-Sofia font-bold text-gray-800">Categories</h3>
        <div className="text-sm text-gray-500">Page {page}</div>
      </div>

      {query.isLoading ? (
        <div className="p-6 text-center text-gray-500">Loading categories...</div>
      ) : query.isError ? (
        <div className="p-6 text-center text-red-500">Failed to load categories</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No categories found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Image</th>
                {isEditable && (
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((category) => (
                <tr key={category.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.slug || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.imageUrl ? (
                      <a
                        href={category.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-600 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  {isEditable && (
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(category)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!canPrev}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!canNext}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
