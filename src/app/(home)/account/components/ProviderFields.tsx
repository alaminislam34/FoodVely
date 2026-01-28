import { motion } from "motion/react";
import { Phone, MapPin, Upload } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  restaurantName?: string;
  address?: string;
  city?: string;
  deliveryFee?: string;
  minimumOrder?: string;
  licenseNumber?: string;
}

interface ProviderFieldsProps {
  formData: FormData;
  errors: Partial<FormData>;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
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

const categories = [
  "🍔 Burgers",
  "🍕 Pizza",
  "🍜 Noodles",
  "🍣 Sushi",
  "🥗 Salads",
  "🍰 Desserts",
  "☕ Beverages",
  "🌮 Mexican",
];

export default function ProviderFields({
  formData,
  errors,
  activeCategory,
  setActiveCategory,
  handleInputChange,
}: ProviderFieldsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.h3
        variants={itemVariants}
        className="text-lg font-Sofia font-bold text-gray-900"
      >
        Restaurant Information
      </motion.h3>

      {/* Phone */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Phone Number
        </label>
        <div className="relative">
          <Phone
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm font-Sofia">{errors.phone}</p>
        )}
      </motion.div>

      {/* Restaurant Name */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Restaurant Name
        </label>
        <input
          type="text"
          name="restaurantName"
          value={formData.restaurantName || ""}
          onChange={handleInputChange}
          placeholder="Your Restaurant"
          className={`w-full px-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
            errors.restaurantName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
          }`}
        />
        {errors.restaurantName && (
          <p className="text-red-500 text-sm font-Sofia">
            {errors.restaurantName}
          </p>
        )}
      </motion.div>

      {/* Address & City */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-Sofia font-semibold text-gray-800">
            Address
          </label>
          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              placeholder="Street address"
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-sm font-Sofia">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-Sofia font-semibold text-gray-800">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleInputChange}
            placeholder="City"
            className={`w-full px-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.city
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm font-Sofia">{errors.city}</p>
          )}
        </div>
      </motion.div>

      {/* Delivery & Order Info */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-Sofia font-semibold text-gray-800">
            Delivery Fee ($)
          </label>
          <input
            type="number"
            name="deliveryFee"
            value={formData.deliveryFee || ""}
            onChange={handleInputChange}
            placeholder="2.99"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-Sofia font-semibold text-gray-800">
            Minimum Order ($)
          </label>
          <input
            type="number"
            name="minimumOrder"
            value={formData.minimumOrder || ""}
            onChange={handleInputChange}
            placeholder="10.00"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Food Categories
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`p-2 rounded-lg text-sm font-Sofia transition-all ${
                activeCategory === cat
                  ? "bg-rose-500 text-white"
                  : "bg-white/30 text-gray-700 hover:bg-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* License Number */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Business License Number
        </label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber || ""}
          onChange={handleInputChange}
          placeholder="License #"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </motion.div>

      {/* Documents Upload */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Upload Documents
        </label>
        <button
          type="button"
          className="w-full px-4 py-3 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50 hover:bg-rose-100 transition-all flex items-center justify-center gap-2 font-Sofia text-rose-600"
        >
          <Upload size={20} />
          Choose files (License, Food Safety Certificate)
        </button>
      </motion.div>
    </motion.div>
  );
}
