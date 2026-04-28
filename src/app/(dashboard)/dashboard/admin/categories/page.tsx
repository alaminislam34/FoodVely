"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Package,
  Layers,
  Loader2,
} from "lucide-react";
import { useCategory } from "@/hooks/hooks/useCategory";
import { CategoryFormModal } from "@/components/admin/AddCategoryModal";
import { CategoryFormModel } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ICategory } from "@/hooks/services/category.service";
import Swal from "sweetalert2";

export default function CategoriesPage() {
  const router = useRouter();
  const {
    adminCategories: categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    refetchAdminCategories,
    activateCategory,
    deactivateCategory,
  } = useCategory();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  // --- Handlers ---
  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CategoryFormModel) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);

    // Use 'image' to match Multer backend requirement
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      if (selectedCategory) {
        await updateCategory({ id: selectedCategory.id, data: formData });
      } else {
        await createCategory(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Form Action Failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(id);
        } catch (error) {
          console.error("Delete failed", error);
        } finally {
          refetchAdminCategories();
        }
      }
    });
  };

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 className="animate-spin text-rose-500" size={40} />
        <p className="font-bold animate-pulse">Loading Kitchen Categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen pb-20">
      {/* --- HEADER --- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage your menu architecture and groups.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-100 transition-all transform active:scale-95"
        >
          <Plus size={20} />
          New Category
        </button>
      </motion.div>

      {/* --- ANALYTICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Categories"
          value={categories.length}
          icon={Layers}
          color="text-rose-600"
        />
        <StatCard
          label="Active Categories"
          value={categories.filter((c) => c.isActive).length}
          icon={Package}
          color="text-blue-600"
        />
        <StatCard
          label="Inactive Categories"
          value={categories.filter((c) => !c.isActive).length}
          icon={Package}
          color="text-gray-600"
        />
        <StatCard
          label="Deleted Categories"
          value={categories.filter((c) => c.isDeleted).length}
          icon={TrendingUp}
          color="text-green-600"
        />
      </div>

      {/* --- SEARCH --- */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-4 focus:ring-rose-50 transition-all outline-none font-bold text-gray-700"
        />
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => handleOpenEdit(category)}
              onClick={() =>
                router.push(
                  `/dashboard/provider/products?category=${category.slug}`,
                )
              }
              onDelete={() => handleDelete(category.id)}
              onActive={() => activateCategory(category.id)}
              onDeactivate={() => deactivateCategory(category.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredCategories.length === 0 && <EmptyState />}

      {/* --- SHARED MODAL --- */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory} // Pass the category to edit
        isPending={isCreating || isUpdating}
      />
    </div>
  );
}

// --- Reusable Sub-Components ---

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/50 p-8 shadow-xl backdrop-blur-md"
  >
    <div className={`absolute -right-4 -top-4 p-8 opacity-5 ${color}`}>
      <Icon size={120} />
    </div>
    <p className={`text-5xl font-black ${color} mb-2`}>{value}</p>
    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
      {label}
    </p>
  </motion.div>
);

interface CategoryCardProps {
  category: ICategory;
  onEdit: () => void;
  onClick: () => void;
  onDelete: () => void;
  onActive: () => void;
  onDeactivate: () => void;
}

const CategoryCard = ({
  category,
  onEdit,
  onClick,
  onDelete,
  onActive,
  onDeactivate,
}: CategoryCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative flex flex-col bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/20 shadow-xl hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Top Status Badge (Visual Ease) */}
      <div className="absolute top-6 right-6 z-10">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border ${
            category.isActive
              ? "bg-green-500/10 border-green-500/20 text-green-600"
              : category.isDeleted
                ? "bg-red-500/10 border-red-500/20 text-red-600"
                : "bg-gray-500/10 border-gray-500/20 text-gray-500"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${category.isActive ? "bg-green-500 animate-pulse" : category.isDeleted ? "bg-red-500" : "bg-gray-400"}`}
          />
          <span
            className={`text-[10px] ${category.isDeleted ? "text-red-500" : "text-gray-500"} font-black `}
          >
            {category.isActive
              ? "Live"
              : category.isDeleted
                ? "Deleted"
                : "Paused"}
          </span>
        </div>
      </div>

      {/* Image Section */}
      <div
        onClick={onClick}
        className="relative aspect-video w-full overflow-hidden rounded-[2rem] cursor-pointer bg-gray-100/50"
      >
        <Image
          src={category.image}
          alt={category.title}
          fill
          priority
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="mt-5 w-full px-1 flex flex-col gap-2 grow">
        <div className="text-center">
          <h3 className="text-xl font-Sofia font-black text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-1">
            {category.title}
          </h3>
          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 min-h-8 leading-relaxed">
            {category.description ||
              "No description provided for this category."}
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-auto border-t border-white/30 space-y-2">
          {/* Status Toggle */}
          <div className="flex items-center justify-between bg-white/30 p-2 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">
              Visibility
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                category.isActive ? onDeactivate() : onActive();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                category.isActive
                  ? "bg-green-500 shadow-md shadow-green-100"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  category.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-gray-200/50 group/btn"
            >
              <Edit2
                size={16}
                className="group-hover/btn:rotate-12 transition-transform"
              />
              <span className="text-xs">Edit Details</span>
            </button>

            {!category.isDeleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="px-4 py-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-300 group/del"
                title="Delete Category"
              >
                <Trash2
                  size={18}
                  className="group-hover/del:scale-110 group-hover/del:rotate-6 transition-transform"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center py-32 bg-white/40 rounded-[3rem] border border-dashed border-gray-200">
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="text-gray-300" size={32} />
    </div>
    <p className="text-2xl font-black text-gray-700">No categories matching</p>
    <p className="text-gray-400 font-medium">
      Try a different keyword or create a new one.
    </p>
  </div>
);
