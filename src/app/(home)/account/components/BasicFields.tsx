import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import type {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import type { SignupFormValues } from "../signup/types";

interface BasicFieldsProps {
  register: UseFormRegister<SignupFormValues>;
  registerOptions: {
    firstName?: RegisterOptions<SignupFormValues, "firstName">;
    lastName?: RegisterOptions<SignupFormValues, "lastName">;
    email?: RegisterOptions<SignupFormValues, "email">;
    password?: RegisterOptions<SignupFormValues, "password">;
    confirmPassword?: RegisterOptions<SignupFormValues, "confirmPassword">;
  };
  errors: FieldErrors<SignupFormValues>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: number;
  passwordValue: string;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  PasswordStrengthComponent: React.ComponentType<any>;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BasicFields({
  register,
  registerOptions,
  errors,
  showPassword,
  showConfirmPassword,
  passwordStrength,
  passwordValue,
  setShowPassword,
  setShowConfirmPassword,
  PasswordStrengthComponent,
}: BasicFieldsProps) {
  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm  font-semibold text-gray-800">
            First Name
          </label>
          <div className="relative">
            <User
              size={20}
              className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="John"
              {...register("firstName", registerOptions.firstName)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.firstName?.message && (
            <p className="text-red-500 text-sm ">
              {errors.firstName.message as string}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm  font-semibold text-gray-800">
            Last Name
          </label>
          <div className="relative">
            <User
              size={20}
              className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Doe"
              {...register("lastName", registerOptions.lastName)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
              }`}
            />
          </div>
          {errors.lastName?.message && (
            <p className="text-red-500 text-sm ">
              {errors.lastName.message as string}
            </p>
          )}
        </motion.div>
      </div>

      {/* Email */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm  font-semibold text-gray-800">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={20}
            className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", registerOptions.email)}
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
        </div>
        {errors.email?.message && (
          <p className="text-red-500 text-sm ">
            {errors.email.message as string}
          </p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm  font-semibold text-gray-800">
          Password
        </label>
        <div className="relative">
          <Lock
            size={20}
            className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password", registerOptions.password)}
            className={`w-full pl-12 pr-12 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <PasswordStrengthComponent
          strength={passwordStrength}
          password={passwordValue}
        />
        {errors.password?.message && (
          <p className="text-red-500 text-sm ">
            {errors.password.message as string}
          </p>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className="block text-sm  font-semibold text-gray-800">
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            size={20}
            className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword", registerOptions.confirmPassword)}
            className={`w-full pl-12 pr-12 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword?.message && (
          <p className="text-red-500 text-sm ">
            {errors.confirmPassword.message as string}
          </p>
        )}
      </motion.div>
    </>
  );
}
