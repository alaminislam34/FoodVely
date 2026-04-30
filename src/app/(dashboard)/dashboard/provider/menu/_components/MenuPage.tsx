"use client";

import { providerApi } from "@/api/providerApi";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Product } from "@/types/product";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import normalizeProducts from "./NormaliziedProduct";
import AnalyticsCards from "./AnalyticsCards";
import Toolbar from "./Toolbar";
import ProductsMobileView from "./ProductsMobileViews";
import PaginationFooter from "./Pagination";
import { ProviderProductsEmptyState } from "@/components/provider/ProviderEmptyStates";
import EditProductModal from "./EditProductModal";
import ProductsTable from "./ProductsTable";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    isAvailable: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadProducts = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);

      try {
        const response = await providerApi.listProducts({
          page: 1,
          limit: 200,
        });

        if (response.items.length > 0) {
          const mapped = normalizeProducts(
            response.items as unknown as Record<string, unknown>[],
          );
          setProducts(mapped);
          setUsingFallback(false);
          return;
        }

        const fallbackRes = await fetch("/FoodProducts.json");
        const fallbackJson = await fallbackRes.json();
        const fallbackArray = Array.isArray(fallbackJson)
          ? fallbackJson
          : fallbackJson.products || [];

        setProducts(
          normalizeProducts(fallbackArray as Record<string, unknown>[]),
        );
        setUsingFallback(true);
      } catch {
        setError("Failed to load products from API and fallback source.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadProducts("initial");
  }, [loadProducts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      await providerApi.deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product deleted");
      loadProducts("refresh");
    } catch {
      toast.error("Delete failed. Check API endpoint and try again.");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: String(product.price ?? 0),
      category:
        product.category?.title ?? product.category?.title ?? "Uncategorized",
      stock: String(product.availability?.stock ?? 0),
      isAvailable: Boolean(product.availability?.isAvailable ?? true),
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setIsSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    const parsedPrice = Number(editForm.price);
    const parsedStock = Number(editForm.stock);

    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      toast.error("Stock must be a valid non-negative number");
      return;
    }

    setIsSavingEdit(true);

    try {
      await providerApi.updateProduct(editingProduct.id, {
        name: editForm.name.trim(),
        price: parsedPrice,
        category: editForm.category,
        stock: parsedStock,
        isAvailable: editForm.isAvailable,
      });

      toast.success("Product updated");
      closeEditModal();
      await loadProducts("refresh");
    } catch {
      toast.error("Update failed. Please verify API endpoint.");
      setIsSavingEdit(false);
    }
  };

  const toggleStock = async (product: Product) => {
    const nextAvailability = !Boolean(product.availability?.isAvailable);
    const previousProducts = products;

    setUpdatingStockId(product.id);
    setProducts((prev: Product[]) =>
      prev.map((item) => {
        if (item.id !== product.id) return item;
        const updatedAvailability = {
          ...(item.availability as Partial<
            NonNullable<Product["availability"]>
          >),
          isAvailable: nextAvailability,
        } as NonNullable<Product["availability"]>;
        return {
          ...item,
          availability: updatedAvailability,
        } as Product;
      }),
    );

    try {
      await providerApi.updateProductStock(product.id, {
        isAvailable: nextAvailability,
        stock: product.availability?.stock,
      });
      toast.success(
        nextAvailability ? "Marked as available" : "Marked as unavailable",
      );
      await loadProducts("refresh");
    } catch {
      setProducts(previousProducts);
      toast.error("Stock update failed. Please try again.");
    } finally {
      setUpdatingStockId(null);
    }
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(
      products
        .map((p) => p.category?.title)
        .filter((v): v is string => typeof v === "string" && !!v),
    );
    return ["All", ...Array.from(cats)];
  }, [products]);

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          (p.category?.title ?? "").toLowerCase().includes(lowerQuery),
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category?.title === selectedCategory);
    }
    if (stockFilter === "in-stock") {
      result = result.filter((p) => (p.availability?.stock ?? 0) > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter((p) => (p.availability?.stock ?? 0) === 0);
    }
    if (ratingFilter === "4.5+") {
      result = result.filter((p) => (p.rating?.average ?? 0) >= 4.5);
    } else if (ratingFilter === "4.0+") {
      result = result.filter((p) => (p.rating?.average ?? 0) >= 4.0);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.rating?.average ?? 0) - (a.rating?.average ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    stockFilter,
    ratingFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = processedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter, ratingFilter, sortBy]);

  const totalStock = products.reduce(
    (sum, p) => sum + (p.availability?.stock ?? 0),
    0,
  );
  const avgStock = products.length
    ? Math.floor(totalStock / products.length)
    : 0;
  const avgRating =
    products.reduce((acc, p) => acc + (p.rating?.average ?? 0), 0) /
    (products.length || 1);

  if (loading) {
    return (
      <div className="space-y-6 lg:space-y-8 min-h-screen">
        <TableSkeleton rows={6} columns={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => loadProducts("initial")} />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-800">
            Inventory Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Tracking {products.length} menu items across{" "}
            {uniqueCategories.length - 1} categories.
          </p>
          {usingFallback ? (
            <p className="text-xs text-amber-600 mt-2">
              Running in fallback mode using local data.
            </p>
          ) : null}
          {isRefreshing ? (
            <p className="text-xs text-blue-600 mt-1">
              Syncing latest products...
            </p>
          ) : null}
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <AnalyticsCards
        products={products}
        avgStock={avgStock}
        avgRating={avgRating}
      />

      {/* Main Container */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        {/* Toolbar */}
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          uniqueCategories={uniqueCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Desktop Table View */}
        <ProductsTable
          currentProducts={currentProducts}
          openEditModal={openEditModal}
          toggleStock={toggleStock}
          updatingStockId={updatingStockId}
          handleDelete={handleDelete}
        />

        {/* Mobile View */}
        <ProductsMobileView
          currentProducts={currentProducts}
          openEditModal={openEditModal}
          toggleStock={toggleStock}
          handleDelete={handleDelete}
        />

        {/* Pagination Footer */}
        <PaginationFooter
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          processedProducts={processedProducts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

        {!loading && currentProducts.length === 0 ? (
          <div className="p-6 border-t border-gray-100">
            <ProviderProductsEmptyState />
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {editingProduct ? (
          <EditProductModal
            editingProduct={editingProduct}
            closeEditModal={closeEditModal}
            editForm={editForm}
            setEditForm={setEditForm}
            handleSaveEdit={handleSaveEdit}
            isSavingEdit={isSavingEdit}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
