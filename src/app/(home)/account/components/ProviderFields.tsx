import { motion } from "motion/react";
import { Phone, MapPin, Upload } from "lucide-react";
import type {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import type { SignupFormValues } from "../signup/types";

interface ProviderFieldsProps {
  register: UseFormRegister<SignupFormValues>;
  registerOptions: {
    phone?: RegisterOptions<SignupFormValues, "phone">;
    restaurantName?: RegisterOptions<SignupFormValues, "restaurantName">;
    address?: RegisterOptions<SignupFormValues, "address">;
    city?: RegisterOptions<SignupFormValues, "city">;
    deliveryFee?: RegisterOptions<SignupFormValues, "deliveryFee">;
    minimumOrder?: RegisterOptions<SignupFormValues, "minimumOrder">;
  };
  errors: FieldErrors<SignupFormValues>;
  activeCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  cuisineInputProps: ReturnType<UseFormRegister<SignupFormValues>>;
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
  register,
  registerOptions,
  errors,
  activeCategory,
  onSelectCategory,
  cuisineInputProps,
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
        className="text-lg  font-bold text-gray-900"
      >
        Restaurant Information
      </motion.h3>

      {/* Phone */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm  font-semibold text-gray-800">
          Phone Number
        </label>
        <div className="relative">
          <Phone
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("phone", registerOptions.phone)}
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
        </div>
        {errors.phone?.message && (
          <p className="text-red-500 text-sm ">
            {errors.phone.message as string}
          </p>
        )}
      </motion.div>

      {/* Restaurant Name */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm  font-semibold text-gray-800">
          Restaurant Name
        </label>
        <input
          type="text"
          placeholder="Your Restaurant"
          {...register("restaurantName", registerOptions.restaurantName)}
          className={`w-full px-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
            errors.restaurantName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
          }`}
        />
        {errors.restaurantName?.message && (
          <p className="text-red-500 text-sm ">
            {errors.restaurantName.message as string}
          </p>
        )}
      </motion.div>

      {/* Address & City */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm  font-semibold text-gray-800">
            Address
          </label>
          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Street address"
              {...register("address", registerOptions.address)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.address?.message && (
            <p className="text-red-500 text-sm ">
              {errors.address.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm  font-semibold text-gray-800">
            City
          </label>
          <input
            type="text"
            placeholder="City"
            {...register("city", registerOptions.city)}
            className={`w-full px-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.city
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
          {errors.city?.message && (
            <p className="text-red-500 text-sm ">
              {errors.city.message as string}
            </p>
          )}
        </div>
      </motion.div>

      {/* Delivery & Order Info */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <label className="block text-sm  font-semibold text-gray-800">
            Delivery Fee ($)
          </label>
          <input
            type="number"
            placeholder="2.99"
            {...register("deliveryFee", registerOptions.deliveryFee)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm  font-semibold text-gray-800">
            Minimum Order ($)
          </label>
          <input
            type="number"
            placeholder="10.00"
            {...register("minimumOrder", registerOptions.minimumOrder)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm  font-semibold text-gray-800">
          Food Categories
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                onSelectCategory(activeCategory === cat ? null : cat)
              }
              className={`p-2 rounded-lg text-sm  transition-all ${
                activeCategory === cat
                  ? "bg-rose-500 text-white"
                  : "bg-white/30 text-gray-700 hover:bg-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input type="hidden" {...cuisineInputProps} />
        {errors.cuisineTypes && (
          <p className="text-red-500 text-sm ">
            {errors.cuisineTypes.message as string}
          </p>
        )}
      </motion.div>

      {/* License Number */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm  font-semibold text-gray-800">
          Business License Number
        </label>
        <input
          type="text"
          placeholder="License #"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </motion.div>
    </motion.div>
  );
}
