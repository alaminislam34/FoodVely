"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoleSelector from "../components/RoleSelector";
import BasicFields from "../components/BasicFields";
import ProviderFields from "../components/ProviderFields";
import PasswordStrength from "../components/PasswordStrength";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type UserRole = "provider";

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

export default function SignUp() {
  const [role, setRole] = useState<UserRole>("provider");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "provider") {
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.restaurantName)
        newErrors.restaurantName = "Restaurant name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    console.log("Sign up:", {
      role,
      ...formData,
      selectedCategories: activeCategory,
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 shadow-xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-900 mb-2">
              Join FoodVally
            </h1>
            <p className="text-gray-600 font-Sofia">
              Create your account to get started
            </p>
          </div>

          <RoleSelector role={role} setRole={setRole} setErrors={setErrors} />

          <form onSubmit={handleSignUp} className="space-y-4">
            <BasicFields
              formData={formData}
              errors={errors}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              passwordStrength={passwordStrength}
              handleInputChange={handleInputChange}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              PasswordStrengthComponent={PasswordStrength}
            />

            <AnimatePresence mode="wait">
              {role === "provider" && (
                <motion.div
                  key="provider-fields"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-gray-200 pt-6 overflow-visible"
                >
                  <ProviderFields
                    formData={formData}
                    errors={errors}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    handleInputChange={handleInputChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-Sofia font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/40 text-gray-600 font-Sofia">
                  Already have an account?
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/account/signin"
              className="w-full py-3 px-4 rounded-2xl border-2 border-rose-500 text-rose-500 font-Sofia font-bold hover:bg-rose-50 transition-all duration-300 text-center block"
            >
              Sign In Instead
            </Link>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-gray-600 mt-6 font-Sofia"
          >
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-rose-500 hover:text-rose-600 font-semibold"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-rose-500 hover:text-rose-600 font-semibold"
            >
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
