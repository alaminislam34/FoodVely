"use client";

import { motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { getStoredUser } from "@/services/authService";
import { getRedirectPathByRole } from "@/utils/authRedirect";
import { Button } from "@/components/ui/button";
import { FaFacebook } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const inputClassName =
  "h-11 w-full rounded-xl border border-rose-100 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginRequest, isLoading, isAuthenticated, user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const safeNextPath = (value: string | null) => {
    if (!value) return null;
    if (!value.startsWith("/")) return null;
    if (value.startsWith("//")) return null;
    return value;
  };

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(
      "remembered_signin_email",
    );
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    const resetEmail = searchParams.get("email");
    const resetStatus = searchParams.get("reset");
    if (!rememberedEmail && resetEmail) {
      setEmail(resetEmail);
    }

    if (resetStatus === "success") {
      toast.success("Password updated. Sign in with your new password.");
    }

    const returnTo = safeNextPath(searchParams.get("next"));
    if (isAuthenticated) {
      router.replace(returnTo || getRedirectPathByRole(user?.role));
    }
  }, [isAuthenticated, router, searchParams, user?.role]);

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

    const loadingToast = toast.loading("Signing you in...");

    try {
      if (rememberMe) {
        window.localStorage.setItem("remembered_signin_email", email);
      } else {
        window.localStorage.removeItem("remembered_signin_email");
      }

      await loginRequest(email, password);
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      const returnTo = safeNextPath(searchParams.get("next"));
      const storedUser = getStoredUser();
      const redirectPath =
        returnTo || getRedirectPathByRole(storedUser?.role ?? user?.role);
      setTimeout(() => router.push(redirectPath), 300);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err?.message || "Login failed. Please try again.");
      console.error(err);
    }
  };
  return (
    <section className="flex items-center justify-center px-4 py-10 lg:py-14">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="w-full rounded-3xl border border-rose-100 bg-white/95 p-6 md:p-12 shadow-[0_24px_60px_-24px_rgba(190,24,93,0.35)]"
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900">
              Sign In
            </h1>
          </div>

          <motion.div variants={itemVariants} className="space-y-3 pt-4">
            <div className="flex items-center gap-4 justify-center">
              <Button size={"lg"} className="px-5" variant={"outline"}>
                <FcGoogle />
                Google
              </Button>
              <Button size={"lg"} className="px-5" variant={"outline"}>
                <FaFacebook />
                Facebook
              </Button>
            </div>
          </motion.div>
          <p className="text-center text-xs text-gray-600 my-4">
            Or continue with
          </p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="relative">
                <Mail
                  size={20}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="you@example.com"
                  className={`${inputClassName} pl-10 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="relative">
                <Lock
                  size={20}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  placeholder="••••••••"
                  className={`${inputClassName} pl-10 pr-10 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </motion.div>

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
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/account/forgot-password"
                className="text-sm text-rose-500 hover:text-rose-600 font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            <Button
              size="lg"
              className="h-11 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <motion.div variants={itemVariants} className="my-6">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/signup"
                className="font-semibold text-rose-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
