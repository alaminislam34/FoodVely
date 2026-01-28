"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
} from "lucide-react";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-linear-to-br from-white to-white/80 backdrop-blur-sm py-16 md:py-20 relative mt-50 shadow-md
    "
    >
      {/* Newsletter Section */}
      <motion.div
        variants={itemVariants}
        className="max-w-3xl mx-auto w-11/12 bg-linear-to-br from-white via-orange-50 to-orange-200 backdrop-blur-2xl rounded-3xl p-6 md:p-8 mb-8 shadow-md absolute -top-40 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-4 items-center">
            <h4 className="font-Sofia font-bold text-gray-900 text-xl md:text-2xl lg:text-3xl mb-2">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-gray-600 text-sm">
              Get the latest updates, exclusive offers, and delicious recipes
              delivered to your inbox.
            </p>
          </div>
          <div className="flex gap-2 max-w-2xl w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm w-full"
            />
            <button className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-Sofia font-semibold hover:bg-rose-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-200">
              Subscribe
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-screen-2xl mx-auto w-11/12 pt-10"
      >
        {/* Main Footer Content */}
        <div className="flex flex-wrap items-start justify-between gap-8 mb-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4 max-w-md">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-Sofia font-bold text-gray-900">
              Food<span className="text-rose-500">Vally</span>
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Taste the Local Harvest in Every Bite. Fresh, local, and delicious
              food delivered right to your doorstep.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="#"
                className="p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-rose-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4 md:min-w-65">
            <h4 className="font-Sofia font-bold text-gray-900 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Menu", href: "/menu" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants} className="space-y-4 md:min-w-65">
            <h4 className="font-Sofia font-bold text-gray-900 text-lg">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { name: "🍔 Burgers", href: "/menu?cat=burger" },
                { name: "🍕 Pizza", href: "/menu?cat=pizza" },
                { name: "🍛 Biryani", href: "/menu?cat=biryani" },
                { name: "🍚 Rice Bowls", href: "/menu?cat=rice" },
                { name: "🥤 Drinks", href: "/menu?cat=drinks" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4 md:min-w-65">
            <h4 className="font-Sofia font-bold text-gray-900 text-lg">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <MapPin size={20} className="text-rose-500 shrink-0 mt-1" />
                <div>
                  <p className="text-gray-600 text-sm">
                    Dhanmondi 27, Dhaka 1205
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={20} className="text-rose-500 shrink-0" />
                <a
                  href="tel:+8801717123456"
                  className="text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                >
                  +880 1717 123 456
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={20} className="text-rose-500 shrink-0" />
                <a
                  href="mailto:info@FoodVally.com"
                  className="text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                >
                  info@FoodVally.com
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Clock size={20} className="text-rose-500 shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm">10 AM - 11 PM Daily</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-8"
        />

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start gap-2">
              &copy; {currentYear} FoodVally. Made with{" "}
              <Heart size={16} className="text-rose-500 fill-rose-500" /> for
              food lovers.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex gap-4 items-center flex-wrap justify-center">
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium hover:underline underline-offset-2"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium hover:underline underline-offset-2"
            >
              Terms & Conditions
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="fixed bottom-0 right-0 -z-10 pointer-events-none opacity-20">
          <div className="w-96 h-96 bg-rose-200 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </footer>
  );
}
