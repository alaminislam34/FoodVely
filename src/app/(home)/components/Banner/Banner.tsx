"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Products from "../../../ui/Products";

const foodImages = [
  {
    src: "/images/food.png",
    alt: "Chef Spaghetti",
    badge: "Best Seller",
    offer: "10% OFF",
  },
  {
    src: "/images/food2.png",
    alt: "Spicy Wings",
    badge: "Hot",
    offer: "Buy 1 Get 1",
  },
  {
    src: "/images/food3.png",
    alt: "Special Pizza",
    badge: "New",
    offer: "Free Drink",
  },
  {
    src: "/images/food4.png",
    alt: "Veggie Pizza",
    badge: "Chef's Choice",
    offer: "15% OFF",
  },
  {
    src: "/images/food5.png",
    alt: "Cheese Pizza",
    badge: "Popular",
    offer: "Free Delivery",
  },
  {
    src: "/images/food6.png",
    alt: "Meat Lovers Pizza",
    badge: "Limited Time",
    offer: "Save $5",
  },
];

const ImageSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % foodImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-87.5 md:h-125 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="relative w-80 h-80 md:w-120 lg:w-140 md:h-120 lg:h-140 rotate-12 group">
            <Image
              src={foodImages[index].src}
              alt={foodImages[index].alt}
              fill
              className="object-contain"
              priority
            />
            
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-rose-500 to-orange-500 rounded-full blur-lg opacity-60"></div>
                <div className="relative px-4 md:px-5 py-2 md:py-3 bg-linear-to-br from-rose-500 to-orange-500 rounded-full shadow-xl shadow-rose-500/50 border border-white/20 backdrop-blur-md">
                  <p className="text-white font-Sofia font-bold text-xs md:text-sm whitespace-nowrap">
                    {foodImages[index].badge}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Offer Tag */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-orange-400 rounded-full blur-lg opacity-60"></div>
                <div className="relative px-3 md:px-4 py-1.5 md:py-2 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-400/40 border border-white/20 backdrop-blur-md">
                  <p className="text-white font-Sofia font-bold text-xs md:text-sm whitespace-nowrap">
                    {foodImages[index].offer}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function Banner() {
  return (
    <div className="relative py-12 md:py-14 lg:py-16 min-h-180">
      <section className=" flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Content (Text Area) */}
        <div className="md:max-w-3/5 text-center lg:text-left z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-Sofia font-bold leading-normal">
            Fresh, Local, <span className="text-rose-600">Delicious</span>{" "}
            <br /> The Future Table
          </h1>
          <p className="text-gray-500 py-4 md:max-w-3/4 lg:max-w-4/5 mx-auto lg:mx-0">
            "Taste the Local Harvest in Every Bite." We don't just cook; we
            create. Our chefs hand-pick fresh, seasonal produce from local
            growers. Get the latest updates, exclusive offers, and delicious
            recipes delivered to your inbox.
          </p>
          <div className="flex flex-row gap-4 items-center justify-center lg:justify-start my-6">
            <Link
              href="/account/signup"
              className="py-3 px-8 truncate hover:scale-105 rounded-2xl font-Sofia font-semibold bg-rose-500 hover:bg-rose-600 transition-all text-white shadow-lg shadow-rose-200"
            >
              Order Now
            </Link>
            <Link
              href="/account/signin"
              className="py-3 px-8 truncate hover:scale-105 rounded-2xl font-Sofia font-semibold border border-rose-600 text-rose-600 hover:bg-rose-50 transition-all"
            >
              Explore more
            </Link>
          </div>
        </div>
        {/* Right Content (Slider Area) */}
        <div className="flex-1 w-full relative z-10">
          <ImageSlider />
        </div>
      </section>
    </div>
  );
}
