"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Heart,
  ShoppingCart,
  Clock,
  Flame,
  Leaf,
  Star,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface MenuDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default function MenuDetailsPage({ params }: MenuDetailsPageProps) {
  const [slug, setSlug] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Get slug from params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Fetch product data
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch("/FoodProducts.json");
        const data = await response.json();
        const productsArray = Array.isArray(data) ? data : data.products || [];
        const foundProduct = productsArray.find(
          (p: Product) => p.slug === slug,
        );
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        ...product,
        cartQuantity: quantity,
      };
      console.log("Added to cart:", cartItem);
      // You can integrate with cart context/store here
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && formData.name && formData.phone && formData.address) {
      console.log("Order submitted:", {
        product: product.id,
        quantity,
        ...formData,
      });
      alert("Order submitted successfully! We will contact you soon.");
      setShowOrderForm(false);
      setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
      setQuantity(1);
    }
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

  if (!product) {
    return (
      <section className="min-h-screen bg-linear-to-br from-white via-rose-50 to-orange-50">
        <div className="max-w-360 mx-auto w-11/12 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
            <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/menu"
              className="px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-Sofia font-semibold hover:shadow-lg transition-shadow"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  return (
    <section className="min-h-screen py-8 md:py-12">
      <div className="max-w-360 mx-auto w-11/12 pb-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-sm text-gray-600"
        >
          <Link href="/menu" className="hover:text-rose-500 transition-colors">
            Menu
          </Link>
          <span>/</span>
          <span className="text-rose-600 font-semibold">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* --- LEFT: PRODUCT IMAGES --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-4xl overflow-hidden bg-white/60 backdrop-blur-md border border-white/40 shadow-xl">
              <Image
                src={product.images[0] || "/images/food.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-6 right-6 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
                  Save {discount}%
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md border border-white/40 cursor-pointer hover:border-rose-500 transition-all"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* --- RIGHT: PRODUCT DETAILS --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category & Rating */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
                {product.category?.name || "Uncategorized"}
              </span>
              {product.rating?.average && (
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-orange-400 text-orange-400" />
                  <span className="font-bold text-sm text-gray-800">
                    {product.rating.average}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.rating.totalReviews})
                  </span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl lg:text-4xl font-Sofia font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {product.description || product.shortDescription}
            </p>

            {/* Food Info Badges */}
            <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
              {product.foodInfo?.isVeg && (
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-xs">
                  <Leaf size={13} className="text-green-600" />
                  <span className="font-semibold text-green-700">
                    Vegetarian
                  </span>
                </div>
              )}
              {product.foodInfo?.isSpicy && (
                <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg text-xs">
                  <Flame size={13} className="text-orange-600" />
                  <span className="font-semibold text-orange-700">Spicy</span>
                </div>
              )}
              {product.foodInfo?.preparationTime && (
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs">
                  <Clock size={13} className="text-blue-600" />
                  <span className="font-semibold text-blue-700">
                    {product.foodInfo.preparationTime} min
                  </span>
                </div>
              )}
              {product.foodInfo?.calories && (
                <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg text-xs">
                  <span className="font-semibold text-purple-700">
                    {product.foodInfo.calories} kcal
                  </span>
                </div>
              )}
            </div>

            {/* Availability Status */}
            {product.availability && (
              <div className="mb-6 p-3 rounded-lg bg-linear-to-r from-green-50 to-green-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-700 font-semibold uppercase">
                      Availability
                    </p>
                    <p className="text-sm font-bold text-blue-900 mt-0.5">
                      {product.availability.status === "active"
                        ? "Available Now"
                        : "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Provider Info */}
            {product.provider && (
              <motion.div whileHover={{ y: -2 }} className="mb-8 ">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-3">
                  From Restaurant
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={product.provider.logo}
                      alt={product.provider.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-Sofia font-semibold text-gray-900 text-sm">
                      {product.provider.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs mt-1">
                      <Star
                        size={12}
                        className="fill-orange-400 text-orange-400"
                      />
                      <span className="font-semibold text-gray-700">
                        {product.provider.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pricing */}
            <div className="mb-8 py-6 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Price
              </p>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-black text-gray-900">
                  {product.currency || "BDT"} {displayPrice}
                </div>
                {product.discountPrice && (
                  <div className="text-lg line-through text-gray-400 mb-1">
                    {product.currency || "BDT"} {product.price}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity */}
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-gray-600 hover:text-rose-500 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 text-gray-600 hover:text-rose-500 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-gray-200 hover:border-rose-500 transition-colors"
              >
                <Heart
                  size={18}
                  className={`${
                    isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-400"
                  } transition-colors`}
                />
                <span className="text-sm font-semibold text-gray-700">
                  {isFavorite ? "Saved" : "Save"}
                </span>
              </motion.button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-rose-500 text-rose-500 py-2.5 px-5 rounded-lg font-Sofia font-semibold hover:bg-rose-50 transition-colors"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </motion.button>

              {/* Order Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOrderForm(true)}
                className="flex-1 bg-linear-to-r from-rose-500 to-orange-500 text-white py-2.5 px-5 rounded-lg font-Sofia font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                Order Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* --- ORDER FORM MODAL --- */}
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-Sofia font-bold text-gray-800">
                  Complete Your Order
                </h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-linear-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-100"
              >
                <h3 className="font-Sofia font-bold text-gray-800 mb-4">
                  Order Summary
                </h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">
                    {product.name} x {quantity}
                  </span>
                  <span className="font-bold text-gray-900">
                    {product.currency || "BDT"}{" "}
                    {(displayPrice * quantity).toFixed(0)}
                  </span>
                </div>
                <div className="border-t border-rose-200 pt-3">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-rose-600">
                      {product.currency || "BDT"}{" "}
                      {(displayPrice * quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Order Form */}
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone size={20} className="text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                      placeholder="+880 1XXXXXXXXX"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <div className="flex items-start gap-2">
                    <MapPin size={20} className="text-gray-400 mt-3" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
                      rows={3}
                      placeholder="Enter your complete delivery address"
                    />
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Notes/Requests
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
                    rows={3}
                    placeholder="Any special requests or dietary preferences? (Optional)"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 px-6 rounded-xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Place Order
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
