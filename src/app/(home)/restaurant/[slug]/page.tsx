"use client";

import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Check,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { Provider } from "@/types/provider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function RestaurantDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>("");
  const [restaurant, setRestaurant] = useState<Provider | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high">(
    "rating",
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const mockRestaurant: Provider = {
          id: "prov_101",
          name: "FoodVally Kitchen",
          slug: "FoodVally-kitchen",
          description: "Best homemade food with authentic Bangla taste.",
          owner: {
            name: "Rahim Uddin",
            phone: "017XXXXXXXX",
            email: "FoodVally@gmail.com",
          },
          location: {
            address: "Dhanmondi 27, Dhaka",
            city: "Dhaka",
            lat: 23.7465,
            lng: 90.376,
          },
          categories: ["Biriyani", "Chicken", "Rice Bowls"],
          images: {
            logo: "/images/providers/FoodVally-logo.png",
            cover: "/images/providers/covers/FoodVelyKitchen.jpg",
          },
          rating: { average: 4.6, totalReviews: 320 },
          delivery: {
            isAvailable: true,
            deliveryTime: "30-45 min",
            deliveryFee: 60,
            minimumOrder: 300,
          },
          openingHours: {
            open: "10:00 AM",
            close: "11:00 PM",
            isOpenNow: true,
          },
          status: {
            isVerified: true,
            isActive: true,
            isSuspended: false,
          },
          stats: { totalFoods: 48, totalOrders: 1250 },
          createdAt: "2025-01-12T10:30:00Z",
          updatedAt: "2025-01-20T08:15:00Z",
        };

        setRestaurant(mockRestaurant);

        // Fetch products for this restaurant
        const response = await fetch("/FoodProducts.json");
        const data = await response.json();
        const productsArray = Array.isArray(data) ? data : data.products || [];

        // Filter products by restaurant ID
        const restaurantProducts = productsArray.filter(
          (p: Product) => p.provider?.id === mockRestaurant.id,
        );
        setProducts(restaurantProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const filtered = useMemo(() => {
    let result = products;

    // Search
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category?.id === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort(
          (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0),
        );
        break;
      case "price-low":
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
        break;
      case "price-high":
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, products]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("rating");
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-linear-to-br from-white via-rose-50 to-orange-50">
        <div className="max-w-360 mx-auto w-11/12 min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full"
          />
        </div>
      </section>
    );
  }

  if (!restaurant) {
    return (
      <section className="min-h-screen bg-linear-to-br from-white via-rose-50 to-orange-50">
        <div className="max-w-360 mx-auto w-11/12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-4">
              Restaurant Not Found
            </h1>
            <Link
              href="/restaurant"
              className="px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-Sofia font-semibold hover:shadow-lg transition-shadow inline-block"
            >
              Back to Restaurants
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const categories = [
    ...new Set(products.map((p) => p.category?.id).filter(Boolean)),
  ] as string[];

  return (
    <section className="min-h-screen bg-white pb-16">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden">
        {/* Cover Image */}
        <Image
          src={restaurant.images.cover}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Restaurant Info Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white"
        >
          <div className="max-w-360 mx-auto w-11/12 flex items-end gap-6">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white shadow-lg shrink-0 -mb-12">
              <Image
                src={restaurant.images.logo}
                alt={restaurant.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-Sofia font-bold">
                  {restaurant.name}
                </h1>
                {restaurant.status.isVerified && (
                  <Check size={24} className="text-green-400 fill-green-400" />
                )}
              </div>
              <p className="text-sm text-gray-200">{restaurant.description}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-360 mx-auto w-11/12 mt-16">
        {/* --- INFO CARDS --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {/* Rating */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="fill-orange-400 text-orange-400" />
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Rating
              </span>
            </div>
            <div className="text-2xl font-black text-gray-900">
              {restaurant.rating.average}
            </div>
            <div className="text-xs text-gray-500">
              {restaurant.rating.totalReviews} reviews
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Delivery
              </span>
            </div>
            <div className="text-xl font-black text-gray-900">
              {restaurant.delivery.deliveryTime}
            </div>
            <div className="text-xs text-gray-500">
              Fee: {restaurant.delivery.deliveryFee} BDT
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  restaurant.openingHours.isOpenNow
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Status
              </span>
            </div>
            <div className="text-lg font-black text-gray-900">
              {restaurant.openingHours.isOpenNow ? "Open Now" : "Closed"}
            </div>
            <div className="text-xs text-gray-500">
              {restaurant.openingHours.open} - {restaurant.openingHours.close}
            </div>
          </div>

          {/* Total Foods */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Total Items
              </span>
            </div>
            <div className="text-2xl font-black text-gray-900">
              {restaurant.stats.totalFoods}
            </div>
            <div className="text-xs text-gray-500">
              {restaurant.stats.totalOrders} orders
            </div>
          </div>
        </motion.div>

        {/* --- CONTACT INFO --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {/* Location */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-600 shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs uppercase font-semibold text-blue-700 mb-1">
                  Location
                </p>
                <p className="text-sm font-semibold text-blue-900">
                  {restaurant.location.address}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {restaurant.location.city}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-green-600 shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs uppercase font-semibold text-green-700 mb-1">
                  Contact
                </p>
                <p className="text-sm font-semibold text-green-900">
                  {restaurant.owner.phone}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {restaurant.owner.name}
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-purple-600 shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs uppercase font-semibold text-purple-700 mb-1">
                  Email
                </p>
                <p className="text-sm font-semibold text-purple-900 truncate">
                  {restaurant.owner.email}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {restaurant.categories[0]}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- FOOD SECTION HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-900 mb-2">
            Our Menu
          </h2>
          <p className="text-gray-600">{filtered.length} items available</p>
        </motion.div>

        {/* Mobile Filter Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 bg-linear-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-Sofia font-semibold shadow-lg"
        >
          <Filter size={20} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </motion.button>

        <div className="flex gap-6 lg:gap-8">
          {/* --- SIDEBAR FILTERS --- */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-56 shrink-0`}
          >
            <div className="sticky top-20 bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-Sofia font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={18} className="text-rose-500" />
                  Filter
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-Sofia font-bold text-gray-800 mb-3 text-sm">
                  Category
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all font-medium ${
                      selectedCategory === ""
                        ? "bg-rose-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-all font-medium ${
                        selectedCategory === cat
                          ? "bg-rose-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="bg-linear-to-r from-rose-100 to-orange-100 rounded-lg p-4 border border-rose-200">
                <p className="text-sm text-gray-700">
                  <span className="font-Sofia font-bold text-rose-600">
                    {filtered.length}
                  </span>{" "}
                  items found
                </p>
              </div>
            </div>
          </motion.aside>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 w-full">
            {/* Search & Sort */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex flex-col sm:flex-row gap-4"
            >
              {/* Search */}
              <div className="flex-1 relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "rating" | "price-low" | "price-high",
                  )
                }
                className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700 font-semibold cursor-pointer text-sm"
              >
                <option value="rating">⭐ Rating</option>
                <option value="price-low">💵 Price: Low to High</option>
                <option value="price-high">💰 Price: High to Low</option>
              </select>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              key={`${searchQuery}-${selectedCategory}-${sortBy}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <Link href={`/menu/${product.slug}`}>
                    <div className="h-full group relative flex flex-col bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer">
                      {/* Image */}
                      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={product.images[0] || "/images/food.png"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.discountPrice && (
                          <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                            Save{" "}
                            {Math.round(
                              ((product.price - product.discountPrice) /
                                product.price) *
                                100,
                            )}
                            %
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-Sofia font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-rose-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-xs mb-3 line-clamp-1">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Rating */}
                        {product.rating?.average && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star
                              size={13}
                              className="fill-orange-400 text-orange-400"
                            />
                            <span className="text-xs font-bold text-gray-800">
                              {product.rating.average}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.rating.totalReviews})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                          <div>
                            {product.discountPrice && (
                              <div className="text-xs line-through text-gray-400">
                                {product.currency || "BDT"} {product.price}
                              </div>
                            )}
                            <div className="text-lg font-black text-gray-900">
                              {product.currency || "BDT"}{" "}
                              {product.discountPrice || product.price}
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <ShoppingCart size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-6 text-6xl">🍽️</div>
                <h3 className="text-2xl font-Sofia font-bold text-gray-700 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-Sofia font-semibold hover:shadow-lg transition-shadow"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
