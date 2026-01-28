"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChefHat, Leaf, Zap, Heart, Utensils, Award } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Fresh Ingredients",
      description: "Every Time",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Crispy, Juicy,",
      description: "Irresistible",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Perfect Meals",
      description: "For Everyone",
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Taste That",
      description: "Brings Smiles",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center">
          {/* Left Side - Chef Image */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center gap-8 lg:justify-start "
            >
              <div className="relative w-full max-w-sm">
                <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center py-10">
                  {/* --- DECORATIVE BACKGROUND ELEMENTS --- */}
                  {/* Large Soft Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-rose-200/50 rounded-full blur-[80px] z-0" />

                  {/* Modern Animated Blob Shape */}
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute w-64 h-64 md:w-80 md:h-80 border-2 border-dashed border-rose-200 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] z-0"
                  />

                  {/* --- MAIN CHEF CONTAINER --- */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative w-72 h-96 md:w-96 md:h-125 z-10"
                  >
                    {/* The Glassy Card Background */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-2xl rotate-3 translate-x-4" />

                    {/* Image Wrapper */}
                    <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:-rotate-2">
                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-rose-950/20 to-transparent z-10" />

                      <Image
                        src="/images/chef2.png"
                        alt="Professional Chef"
                        fill
                        className="object-cover object-top scale-110" // scale-110 helps if the image has cut-off edges
                        priority
                      />
                    </div>

                    {/* --- FLOATING BADGES --- */}

                    {/* Experience Badge */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -right-8 top-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-50 z-20"
                    >
                      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          Experience
                        </p>
                        <p className="text-sm font-black text-slate-800 italic">
                          15+ Years
                        </p>
                      </div>
                    </motion.div>

                    {/* Signature Dish Badge */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="absolute -left-12 bottom-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50 z-20"
                    >
                      <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                        <Utensils size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Chef Special
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className="text-[10px]">
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Bottom Decorative Label */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 bg-slate-900 py-3 rounded-2xl text-center shadow-2xl z-20">
                      <p className="text-white font-Sofia font-bold text-sm tracking-widest uppercase">
                        Master Chef
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Heading */}
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-Sofia font-bold bg-linear-to-r from-gray-900 via-rose-600 to-orange-600 bg-clip-text text-transparent leading-normal pl-2"
              >
                About FoodVally
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                At FoodVally, we serve the most delicious and crispy fried
                chicken that you'll ever taste. Our recipes are crafted with
                love and perfection, bringing people together over great food!
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div className="grid grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group bg-linear-to-br from-white/80 to-orange-50/80 backdrop-blur-lg border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl hover:border-rose-300/60 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-Sofia font-bold text-gray-900 text-sm sm:text-base">
                        {feature.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/about">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 sm:px-10 py-4 bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-Sofia font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  More About Us
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              viewport={{ once: true }}
              className="pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>Trusted by thousands of happy customers worldwide</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
