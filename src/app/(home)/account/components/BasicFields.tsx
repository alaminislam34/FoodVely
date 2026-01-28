import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

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

interface BasicFieldsProps {
  formData: FormData;
  errors: Partial<FormData>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  PasswordStrengthComponent: React.ComponentType<any>;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BasicFields({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  passwordStrength,
  handleInputChange,
  setShowPassword,
  setShowConfirmPassword,
  PasswordStrengthComponent,
}: BasicFieldsProps) {
  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-Sofia font-semibold text-gray-800">
            First Name
          </label>
          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-sm font-Sofia">{errors.firstName}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-Sofia font-semibold text-gray-800">
            Last Name
          </label>
          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500 text-sm font-Sofia">{errors.lastName}</p>
          )}
        </motion.div>
      </div>

      {/* Email */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm font-Sofia">{errors.email}</p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Password
        </label>
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className={`w-full pl-12 pr-12 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <PasswordStrengthComponent strength={passwordStrength} password={formData.password} />
        {errors.password && (
          <p className="text-red-500 text-sm font-Sofia">{errors.password}</p>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm font-Sofia font-semibold text-gray-800">
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            className={`w-full pl-12 pr-12 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm font-Sofia">{errors.confirmPassword}</p>
        )}
      </motion.div>
    </>
  );
}
