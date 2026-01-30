"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Search,
  X,
  Filter,
  Sliders,
  MapPin,
  Star,
  Clock,
  ChefHat,
} from "lucide-react";
import RestaurantCard from "@/app/ui/ProviderCard";
import RestaurantCardSkeleton from "@/app/ui/RestaurantCardSkeleton";
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

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"rating" | "delivery" | "price">(
    "rating",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/Restaurants.json")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      });
  }, []);

  const locations = [...new Set(restaurants.map((r) => r.location.city))];
  const categories = [...new Set(restaurants.flatMap((r) => r.categories))];

  // Apply delivery fee filter based on selection
  const applyDeliveryFeeFilter = (restaurants: Provider[]) => {
    if (!selectedPriceRange) return restaurants;
    return restaurants.filter((r) => {
      const fee = r.delivery.deliveryFee;
      if (selectedPriceRange === "low") return fee < 50;
      if (selectedPriceRange === "medium") return fee >= 50 && fee <= 100;
      if (selectedPriceRange === "high") return fee > 100;
      return true;
    });
  };

  const filtered = useMemo(() => {
    let result = restaurants;

    // Search by name or category
    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.categories.some((category: string) =>
            category.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Filter by location
    if (selectedLocation) {
      result = result.filter((r) => r.location.city === selectedLocation);
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((r) => r.categories.includes(selectedCategory));
    }

    // Filter by rating
    if (selectedRating) {
      result = result.filter((r) => r.rating.average >= selectedRating);
    }

    // Apply delivery fee filter
    result = applyDeliveryFeeFilter(result);

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case "delivery":
        // Parse delivery time like "30-45 min" and get the average
        const parseDeliveryTime = (time: string) => {
          const numbers = time.match(/\d+/g);
          if (!numbers) return 0;
          return numbers.length === 2
            ? (parseInt(numbers[0]) + parseInt(numbers[1])) / 2
            : parseInt(numbers[0]);
        };
        result.sort(
          (a, b) =>
            parseDeliveryTime(a.delivery.deliveryTime) -
            parseDeliveryTime(b.delivery.deliveryTime),
        );
        break;
      case "price":
        result.sort((a, b) => a.delivery.deliveryFee - b.delivery.deliveryFee);
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedLocation,
    selectedCategory,
    selectedPriceRange,
    selectedRating,
    sortBy,
    restaurants,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedCategory("");
    setSelectedPriceRange("");
    setSelectedRating(0);
    setSortBy("rating");
  };

  if (loading) {
    return (
      <section className="min-h-screen py-8 md:py-12">
        <div className="max-w-360 mx-auto w-11/12 pb-16">
          {/* Header Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-12 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 mx-auto mb-3"
            />
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 mx-auto"
            />
          </motion.div>

          {/* Mobile Filter Toggle Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:hidden w-full mb-6 h-12 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"
          />

          <div className="flex gap-6 lg:gap-8">
            {/* Sidebar Filter Skeleton */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:block w-full md:w-64 lg:w-72 shrink-0"
            >
              <div className="sticky top-20 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-8 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-6 w-1/2"
                />

                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="mb-6 pb-6 border-b border-gray-200">
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-2/3 mb-3"
                    />
                    {[1, 2, 3].map((j) => (
                      <motion.div
                        key={j}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1 + j * 0.05,
                        }}
                        className="h-9 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-2"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </motion.aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 w-full">
              {/* Search & Sort Skeleton */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8 flex gap-4"
              >
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-1 h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                />
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
                  className="w-32 h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                />
              </motion.div>

              {/* Restaurant Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-8 md:py-12">
      <div className="max-w-360 mx-auto w-11/12 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-Sofia bg-linear-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-3">
            Our Restaurants
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Browse and order from our partner restaurants
          </p>
        </motion.div>

        {/* Mobile Filter Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 bg-linear-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-Sofia font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <Sliders size={20} />
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
            } md:block w-full md:w-64 lg:w-72 shrink-0`}
          >
            <div className="sticky top-20 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-rose-500" />
                  <h3 className="text-lg font-Sofia font-bold text-gray-800">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  title="Clear all filters"
                >
                  <X size={14} /> Reset
                </button>
              </div>

              {/* Search in Filters */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 md:py-3.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-gray-400"
                />
              </div>

              {/* Location Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-Sofia font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-rose-500" /> Location
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedLocation("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                      selectedLocation === ""
                        ? "bg-rose-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Locations
                  </button>
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                        selectedLocation === location
                          ? "bg-rose-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-Sofia font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <ChefHat size={16} className="text-rose-500" /> Category
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                      selectedCategory === ""
                        ? "bg-rose-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                        selectedCategory === category
                          ? "bg-rose-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-Sofia font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  💰 Delivery Fee
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "All Delivery Fees", value: "" },
                    { label: "Under 50 BDT", value: "low" },
                    { label: "50-100 BDT", value: "medium" },
                    { label: "Over 100 BDT", value: "high" },
                  ].map((price) => (
                    <button
                      key={price.value}
                      onClick={() => {
                        if (price.value === "") setSelectedPriceRange("");
                        else setSelectedPriceRange(price.value);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                        selectedPriceRange === price.value
                          ? "bg-rose-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {price.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-Sofia font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <Star size={16} className="text-orange-400" /> Rating
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "All Ratings", value: 0 },
                    { label: "4.0+", value: 4.0 },
                    { label: "4.5+", value: 4.5 },
                    { label: "4.8+", value: 4.8 },
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setSelectedRating(rating.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center gap-2 ${
                        selectedRating === rating.value
                          ? "bg-rose-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {rating.value > 0 && (
                        <>
                          {[...Array(Math.floor(rating.value))].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={`${
                                selectedRating === rating.value
                                  ? "fill-white text-white"
                                  : "fill-orange-400 text-orange-400"
                              }`}
                            />
                          ))}
                        </>
                      )}
                      {rating.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-6 bg-linear-to-r from-rose-100 to-orange-100 rounded-lg p-4 border border-rose-200">
                <p className="text-sm text-gray-700">
                  <span className="font-Sofia font-bold text-rose-600 text-base">
                    {filtered.length}
                  </span>{" "}
                  <span className="font-medium">restaurants found</span>
                </p>
              </div>
            </div>
          </motion.aside>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 w-full">
            {/* Search & Sort Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-rose-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search restaurants, cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-gray-400 text-sm"
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "rating" | "delivery" | "price")
                  }
                  className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700 font-semibold transition-all cursor-pointer text-sm"
                >
                  <option value="rating">⭐ Rating</option>
                  <option value="delivery">🚚 Delivery Time</option>
                  <option value="price">💰 Price</option>
                </select>
              </div>
            </motion.div>

            {/* Restaurants Grid */}
            <motion.div
              key={`${searchQuery}-${selectedLocation}-${selectedCategory}-${selectedPriceRange}-${selectedRating}-${sortBy}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} provider={restaurant} />
              ))}
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-6 text-6xl">🍽️</div>
                <h3 className="text-2xl sm:text-3xl font-Sofia font-bold text-gray-700 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base mb-6">
                  Try adjusting your filters or search terms
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-Sofia font-semibold hover:shadow-lg transition-shadow"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
