"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChefHat, Leaf, Zap, Heart } from "lucide-react";

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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center gap-8 lg:justify-start "
          >
            <div className="relative w-full max-w-sm">
              {/* Chef image container */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto"
              >
                {/* Image  */}
                <div className="absolute inset-0 bottom-0 right-0">
                  <div className="w-full h-full flex items-center justify-center relative">
                    <Image
                      src="/images/chef2.png"
                      alt="Professional Chef"
                      fill
                      className=" absolute translate-x-2 object-contain bg-center border-2 rounded-2xl border-rose-500 drop-shadow-2xl drop-shadow-rose-300 max-h-180 h-full"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

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
