"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SignIn() {
  const router = useRouter();
  const { login, verifyOtp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const loadingToast = toast.loading("Sending OTP to your email...");

    try {
      await login({ email, password });
      toast.dismiss(loadingToast);
      toast.success("OTP sent! Check your email.");
      setStep("otp");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err?.message);
      console.error(err);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    const loadingToast = toast.loading("Verifying OTP...");

    try {
      await verifyOtp({ email, otp });
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Invalid OTP. Try again.");
      console.error(err);
    }
  };

  if (step === "otp") {
    return (
      <section className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
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
                Verify OTP
              </h1>
              <p className="text-gray-600 font-Sofia">
                Enter the code sent to {email}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-Sofia font-semibold text-gray-800">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-center text-lg tracking-widest font-bold"
                />
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !otp}
                className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-Sofia font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-full text-rose-500 font-Sofia font-semibold hover:underline"
              >
                Back to Login
              </button>
            </form>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Decorative Blobs */}
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

        {/* Sign In Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-Sofia">
              Sign in to your Foodvely account
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm font-Sofia">
                  {errors.email}
                </p>
              )}
            </motion.div>

            {/* Password Field */}
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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-Sofia">
                  {errors.password}
                </p>
              )}
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-600 font-Sofia">
                  Remember me
                </span>
              </label>
              <Link
                href="/account/forgot-password"
                className="text-sm text-rose-500 hover:text-rose-600 font-Sofia font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-Sofia font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/40 text-gray-600 font-Sofia">
                  Don't have an account?
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants}>
            <Link
              href="/account/signup"
              className="w-full py-3 px-4 rounded-2xl border-2 border-rose-500 text-rose-500 font-Sofia font-bold hover:bg-rose-50 transition-all duration-300 text-center block"
            >
              Create New Account
            </Link>
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="mt-8 space-y-3">
            <p className="text-center text-sm text-gray-600 font-Sofia">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 px-4 rounded-2xl bg-white/50 border border-gray-200 hover:bg-white transition-all flex items-center justify-center gap-2 font-Sofia">
                <span>🔵</span>
                <span className="text-sm font-semibold">Google</span>
              </button>
              <button className="py-2 px-4 rounded-2xl bg-white/50 border border-gray-200 hover:bg-white transition-all flex items-center justify-center gap-2 font-Sofia">
                <span>📱</span>
                <span className="text-sm font-semibold">Apple</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-600 mt-6 font-Sofia"
        >
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="text-rose-500 hover:text-rose-600 font-semibold"
          >
            Terms & Conditions
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
