"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";
import { getRedirectPathByRole } from "@/utils/authRedirect";

// --- Components & Constants ---

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function SignUp() {
  const router = useRouter();
  const { register, verifyAccount, isLoading, isAuthenticated, user } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getRedirectPathByRole(user?.role));
    }
  }, [isAuthenticated, router, user?.role]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.length < 2) newErrors.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (formData.password.length < 8)
      newErrors.password = "Password must be 8+ characters";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!acceptTerms) newErrors.terms = "You must accept the terms to continue";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const loadingToast = toast.loading("Creating account...");
    try {
      await register(formData.name, formData.email, formData.password);
      toast.dismiss(loadingToast);
      toast.success("Account created. Check your email for OTP.");
      setStep("verify");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.message || "Registration failed");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    const loadingToast = toast.loading("Verifying account...");
    try {
      await verifyAccount(formData.email, otp);
      toast.dismiss(loadingToast);
      toast.success("Account verified. Please sign in.");
      router.push("/account/signin");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.message || "Verification failed");
    }
  };

  if (step === "verify") {
    return (
      <section className="relative h-full py-12 lg:py-14 flex items-center justify-center px-4">
        <div className="w-full max-w-120">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 text-center">
              Verify Account
            </h1>
            <p className="text-gray-500 font-medium text-center mb-8">
              Enter the OTP sent to {formData.email}
            </p>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-semibold text-center tracking-widest"
                />
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full mt-4 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify Account"}
              </motion.button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-full py-12 lg:py-14 flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-125 h-125 bg-rose-100/50 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-[10%] -left-[10%] w-100 h-100 bg-orange-100/40 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-120"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block p-4 rounded-3xl bg-rose-50 mb-6"
            >
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <User className="text-white" size={24} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 font-medium">
              Join the food community today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/50 border ${errors.name ? "border-red-400" : "border-gray-200"} rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 ml-1">{errors.name}</p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/50 border ${errors.email ? "border-red-400" : "border-gray-200"} rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 ml-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 bg-white/50 border ${errors.password ? "border-red-400" : "border-gray-200"} rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 ml-1">{errors.password}</p>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/50 border ${errors.confirmPassword ? "border-red-400" : "border-gray-200"} rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="font-semibold text-rose-500 hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and privacy policy.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 ml-7">{errors.terms}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !acceptTerms}
              className="w-full mt-4 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Free Account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Already a member?{" "}
              <Link
                href="/account/signin"
                className="text-rose-500 font-bold hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
