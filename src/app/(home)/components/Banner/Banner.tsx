"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShowUpProduct } from "@/types/product";
import { Star } from "lucide-react";

export const products: ShowUpProduct[] = [
  {
    id: "prod_001",
    slug: "chef-spaghetti",
    name: "Chef Spaghetti",
    description: "Delicious spaghetti prepared by our chef with rich sauce.",
    price: 400,
    discountPrice: 360,
    currency: "BDT",
    images: [
      { url: "/images/food.png", alt: "Chef Spaghetti", isPrimary: true },
    ],
    badge: "BEST_SELLER",
    offer: { label: "10% OFF", type: "DISCOUNT" },
    category: "Pasta",
    providerId: "prov_101",
    rating: 4.8,
    totalReviews: 120,
    isAvailable: true,
    tags: ["pasta", "chef-special"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "prod_002",
    slug: "spicy-wings",
    name: "Spicy Wings",
    description: "Hot & crispy chicken wings with special spices.",
    price: 350,
    currency: "BDT",
    images: [{ url: "/images/food2.png", alt: "Spicy Wings", isPrimary: true }],
    badge: "HOT",
    offer: { label: "Buy 1 Get 1", type: "BUNDLE" },
    category: "Chicken",
    providerId: "prov_101",
    rating: 4.6,
    totalReviews: 95,
    isAvailable: true,
    tags: ["spicy", "chicken"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "prod_003",
    slug: "special-pizza",
    name: "Special Pizza",
    description: "Premium pizza topped with special ingredients.",
    price: 650,
    currency: "BDT",
    images: [
      { url: "/images/food3.png", alt: "Special Pizza", isPrimary: true },
    ],
    badge: "NEW",
    offer: { label: "Free Drink", type: "FREEBIE" },
    category: "Pizza",
    providerId: "prov_102",
    rating: 4.7,
    totalReviews: 70,
    isAvailable: true,
    tags: ["pizza", "combo"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "prod_004",
    slug: "veggie-pizza",
    name: "Veggie Pizza",
    description: "Healthy veggie-loaded pizza with fresh toppings.",
    price: 580,
    discountPrice: 490,
    currency: "BDT",
    images: [
      { url: "/images/food4.png", alt: "Veggie Pizza", isPrimary: true },
    ],
    badge: "CHEFS_CHOICE",
    offer: { label: "15% OFF", type: "DISCOUNT" },
    category: "Pizza",
    providerId: "prov_102",
    rating: 4.5,
    totalReviews: 52,
    isAvailable: true,
    tags: ["veg", "healthy"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "prod_005",
    slug: "cheese-pizza",
    name: "Cheese Pizza",
    description: "Cheesy delight with extra mozzarella.",
    price: 520,
    currency: "BDT",
    images: [
      { url: "/images/food5.png", alt: "Cheese Pizza", isPrimary: true },
    ],
    badge: "POPULAR",
    offer: { label: "Free Delivery", type: "FREEBIE" },
    category: "Pizza",
    providerId: "prov_103",
    rating: 4.6,
    totalReviews: 88,
    isAvailable: true,
    tags: ["cheese", "pizza"],
    createdAt: new Date().toISOString(),
  },

  {
    id: "prod_006",
    slug: "meat-lovers-pizza",
    name: "Meat Lovers Pizza",
    description: "Loaded with chicken, beef & sausage toppings.",
    price: 720,
    discountPrice: 670,
    currency: "BDT",
    images: [
      { url: "/images/food6.png", alt: "Meat Lovers Pizza", isPrimary: true },
    ],
    badge: "LIMITED_TIME",
    offer: { label: "Save ৳5", type: "DISCOUNT" },
    category: "Pizza",
    providerId: "prov_103",
    rating: 4.9,
    totalReviews: 140,
    isAvailable: true,
    tags: ["meat", "premium"],
    createdAt: new Date().toISOString(),
  },
];

const ImageSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentProduct = products[index];

  return (
    <div className="relative w-full h-87.5 md:h-125 flex items-center justify-center overflow-visible">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="relative w-80 h-80 md:w-120 lg:w-140 md:h-120 lg:h-140 group">
            {/* --- PLATE SHADOW EFFECT --- */}
            {/* This creates the depth beneath the food */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-[20%] bg-black/40 rounded-[100%] blur-3xl -rotate-12"
            />

            {/* Main Image Container */}
            <div className="relative w-full h-full rotate-12 transition-transform duration-500 group-hover:rotate-6">
              <Image
                src={currentProduct.images[0].url}
                alt={currentProduct.images[0].alt}
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                priority
              />

              {/* Badge (Best Seller / New) */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-rose-500 to-orange-500 rounded-full blur-lg opacity-60"></div>
                  <div className="relative px-4 md:px-5 py-2 md:py-3 bg-linear-to-br from-rose-500 to-orange-500 rounded-full shadow-xl border border-white/20 backdrop-blur-md">
                    <p className="text-white font-bold text-xs md:text-sm whitespace-nowrap">
                      {currentProduct.badge?.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Offer Tag */}
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute bottom-2 left-2 md:bottom-10 md:left-4 z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-orange-400 rounded-full blur-lg opacity-60"></div>
                  <div className="relative px-3 md:px-4 py-1.5 md:py-2 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg border border-white/20 backdrop-blur-md">
                    <p className="text-white font-bold text-xs md:text-sm whitespace-nowrap">
                      {currentProduct.offer?.label}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Rating Tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-10 left-0 flex items-center gap-1 -rotate-12 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-sm"
              >
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-slate-900 text-xs font-bold">
                  {currentProduct.rating}
                </span>
                <span className="text-slate-500 text-[10px]">
                  ({currentProduct.totalReviews})
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function Banner() {
  return (
    <div className="relative min-h-150 md:min-h-160 lg:min-h-175 flex items-center">
      {/* --- MODERN BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-rose-50 rounded-full blur-[120px] opacity-60 z-0" />
      <div className="absolute bottom-[10%] left-[-5%] w-75 h-75 bg-orange-50 rounded-full blur-[100px] opacity-50 z-0" />

      {/* Decorative Floating Circle */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-1/2 w-4 h-4 rounded-full bg-rose-400 opacity-20 hidden lg:block"
      />

      <section className="w-full mx-auto px-6 relative z-10 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Small Highlight Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-6 transition-transform hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-rose-600 text-xs font-bold tracking-widest uppercase">
                Now serving Dhaka
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-Sofia font-bold text-slate-900 leading-normal">
              Fresh, Local, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-500 px-2">
                Delicious
              </span>
            </h1>

            <p className="text-gray-500 text-lg md:text-xl py-6 md:max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the future of dining. We bring the harvest directly
              from local growers to your table with a chef&apos;s touch.
              <span className="hidden md:inline">
                {" "}
                Pure ingredients. Zero compromise.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mt-4">
              <Link
                href="/account/signup"
                className="py-2.5 px-6 rounded-xl font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 w-3 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></div>
                <span className="relative">Order Now</span>
              </Link>

              <Link
                href="/account/signin"
                className="py-2.5 px-6 rounded-xl font-Sofia font-semibold border-2 bg-clip-border border-transparent bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 bg-transparent text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore More
              </Link>
            </div>

            {/* Subtle Trust Indicators */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-400">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-orange-500"
                  >
                    <Image
                      src={"/logos/customer.jpg"}
                      height={100}
                      width={100}
                      alt="Users icon"
                      className="aspect-square object-cover rounded-full drop-shadow-orange-600"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-rose-100 text-rose-600 text-[10px] font-bold">
                  +2k
                </div>
              </div>
              <p className="text-sm font-medium">Happy customers this week</p>
            </div>
          </motion.div>

          {/* RIGHT CONTENT (Slider Area) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full lg:w-auto relative"
          >
            {/* The ImageSlider stays as you designed it */}
            <ImageSlider />

            {/* Floating UI Card Decoration - Fast Food Style */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 hidden xl:block bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-rose-100 z-30"
            >
              <div className="flex items-center gap-4">
                {/* Icon with a glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400 blur-md opacity-30 animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-linear-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-inner">
                    🚀
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">
                    Super Fast
                  </p>
                  <p className="text-sm font-extrabold text-slate-800 leading-none mt-1">
                    30 MIN DELIVERY
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className="w-3 h-1 bg-orange-400 rounded-full"
                      ></div>
                    ))}
                    <div className="w-3 h-1 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
