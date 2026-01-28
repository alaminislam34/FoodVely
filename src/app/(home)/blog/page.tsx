"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Search,
  X,
  Filter,
  Clock,
  User,
  Tag,
  ChefHat,
  Play,
} from "lucide-react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    role: string;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  relatedRestaurants: any[];
  relatedFoods: any[];
  status: string;
  videoUrl?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(blogs.map((blog) => blog.category.slug))]
    .map((slug) => {
      const blog = blogs.find((b) => b.category.slug === slug);
      return blog ? blog.category : null;
    })
    .filter(Boolean);

  const filtered = useMemo(() => {
    let result = blogs;

    // Search
    if (searchQuery) {
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((blog) => blog.category.slug === selectedCategory);
    }

    // Sort by date (newest first)
    result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return result;
  }, [searchQuery, selectedCategory, blogs]);

  const featuredBlogs = blogs
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  if (loading) {
    return (
      <section className="min-h-screen py-8 md:py-12">
        <div className="max-w-360 mx-auto w-11/12 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full"
          />
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
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-Sofia leading-normal bg-linear-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-3">
            FoodVely Blog
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Discover recipes, food tips, and restaurant guides
          </p>
        </motion.div>

        {/* Featured Blogs Section */}
        {featuredBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-Sofia font-bold text-gray-800 mb-6">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="group relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer h-80"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {blog.category.name}
                    </div>

                    {/* Reading Time */}
                    <div className="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock size={14} />
                      {blog.readingTime}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 h-32 justify-between">
                    <div>
                      <h3 className="text-lg font-Sofia font-bold text-gray-800 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User size={12} />
                      <span>{blog.author.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters Section */}
        <div className="flex gap-6 lg:gap-8 mb-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 lg:w-72 shrink-0`}
          >
            <div className="sticky top-20 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
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
                >
                  <X size={14} /> Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-gray-400"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-Sofia font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                  <ChefHat size={16} className="text-rose-500" /> Categories
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
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
                  {(categories as any[]).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                        selectedCategory === category.slug
                          ? "bg-rose-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
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
                  <span className="font-medium">blogs found</span>
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Mobile Filter Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full mb-6 flex items-center justify-center gap-2 bg-linear-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-Sofia font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Filter size={20} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </motion.button>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 hidden md:block"
            >
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-rose-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search blogs, recipes, tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-gray-400 text-sm"
                />
              </div>
            </motion.div>

            {/* Blogs Grid */}
            <motion.div
              key={`${searchQuery}-${selectedCategory}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {filtered.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={cardVariants}
                  className="group bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-md hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Image Container */}
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-Sofia font-semibold">
                        {blog.category.name}
                      </div>

                      {/* Reading Time Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock size={12} />
                        {blog.readingTime}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-4">
                    {/* Title & Excerpt */}
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="cursor-pointer">
                        <h3 className="text-lg font-Sofia font-bold text-gray-800 line-clamp-2 group-hover:text-rose-600 transition-colors mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      </div>
                    </Link>

                    {/* Meta Info */}
                    <div className="space-y-3 border-t border-gray-200 pt-3">
                      {/* Author */}
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User size={14} />
                        <span>{blog.author.name}</span>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-500">
                        📅{" "}
                        {new Date(blog.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>

                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="text-xs text-gray-600 px-2 py-1">
                              +{blog.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Read More Button */}
                    <Link href={`/blog/${blog.slug}`}>
                      <button className="mt-4 w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl font-Sofia font-semibold transition-all shadow-md shadow-rose-200 hover:shadow-lg">
                        Read Full Article
                      </button>
                    </Link>
                  </div>
                </motion.div>
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
                <div className="mb-6 text-6xl">📝</div>
                <h3 className="text-2xl sm:text-3xl font-Sofia font-bold text-gray-700 mb-2">
                  No blogs found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base mb-6">
                  Try adjusting your search or filters
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-Sofia font-semibold hover:shadow-lg transition-shadow"
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
