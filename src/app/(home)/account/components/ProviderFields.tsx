import { motion } from "motion/react";
import {
  Phone,
  MapPin,
  Clock,
  Utensils,
  Image as ImageIcon,
} from "lucide-react";
import { Category } from "@/types/product";
import { useEffect, useState } from "react";
import axios from "axios";
const base_url =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber?: string;
  restaurantName?: string;
  address?: string;
  city?: string;
  cuisine?: string;
  openingHours?: string;
  logo?: string;
  coverImage?: string;
}

interface ProviderFieldsProps {
  formData: FormData;
  errors: Partial<FormData>;
  activeCategories: string[];
  setActiveCategories: React.Dispatch<React.SetStateAction<string[]>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProviderFields({
  formData,
  errors,
  activeCategories,
  setActiveCategories,
  handleInputChange,
}: ProviderFieldsProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${base_url}/food-categories`, {
          withCredentials: true,
        });
        console.log(res.data.data);
        if (res.status === 200) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  console.log(categories);
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.h3
        variants={itemVariants}
        className="text-lg font-bold text-gray-900"
      >
        Restaurant Details
      </motion.h3>

      {/* Restaurant Name */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Restaurant Name
        </label>
        <input
          type="text"
          name="restaurantName"
          value={formData.restaurantName || ""}
          onChange={handleInputChange}
          placeholder="e.g. Burger Hub"
          className={`w-full px-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
            errors.restaurantName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:ring-rose-500"
          }`}
        />
      </motion.div>

      {/* Contact & Cuisine */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Contact Number
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber || ""}
              onChange={handleInputChange}
              placeholder="+8801712345678"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Cuisine Type
          </label>
          <div className="relative">
            <Utensils
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine || ""}
              onChange={handleInputChange}
              placeholder="e.g. Italian, Fast Food"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Address & City */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Address
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              placeholder="House 12, Road 5, Dhanmondi"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleInputChange}
            placeholder="Dhaka"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>
      </motion.div>

      {/* Opening Hours */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Opening Hours
        </label>
        <div className="relative">
          <Clock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="openingHours"
            value={formData.openingHours || ""}
            onChange={handleInputChange}
            placeholder="10:00 AM - 11:00 PM"
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>
      </motion.div>

      {/* Media Links */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Logo URL
          </label>
          <input
            type="text"
            name="logo"
            value={formData.logo || ""}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Cover Image URL
          </label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage || ""}
            onChange={handleInputChange}
            placeholder="https://example.com/cover.jpg"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800">
          Food Categories
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                setActiveCategories((prev) =>
                  prev.includes(cat.id)
                    ? prev.filter((id) => id !== cat.id)
                    : [...prev, cat.id],
                )
              }
              className={`p-2 rounded-xl text-sm transition-all border ${
                activeCategories.includes(cat.id)
                  ? "bg-rose-500 text-white border-rose-600 shadow-md"
                  : "bg-white/40 text-gray-700 border-gray-100 hover:bg-white/60"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
