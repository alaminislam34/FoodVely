"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Hooks & Utils
import { useAuth } from "@/hooks/useAuth";
import { getRedirectPathByRole } from "@/utils/authRedirect";
import { Button } from "@/components/ui/button";

// 1. Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

// Interface with Index Signature to solve your previous TS error
interface LoginFormData extends z.infer<typeof loginSchema> {
  [key: string]: unknown;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const inputClassName =
  "h-11 w-full rounded-xl border border-rose-100 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-rose-200 focus:ring-2 focus:ring-rose-100";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, isAuthenticated, user, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Safe path validation
  const safeNextPath = (value: string | null) => {
    if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
    return value;
  };

  useEffect(() => {
    // Check remembered email
    const rememberedEmail = window.localStorage.getItem(
      "remembered_signin_email",
    );
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }

    // Handle reset password success
    if (searchParams.get("reset") === "success") {
      toast.success("Password updated. Please sign in.");
    }

    // Auth Redirect logic
    if (isAuthenticated) {
      const returnTo = safeNextPath(searchParams.get("next"));
      router.replace(returnTo || getRedirectPathByRole(user?.role));
    }
  }, [isAuthenticated, router, searchParams, user?.role, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (data.rememberMe) {
        window.localStorage.setItem("remembered_signin_email", data.email);
      } else {
        window.localStorage.removeItem("remembered_signin_email");
      }

      await login({ email: data.email, password: data.password });
      toast.success("Login successful!");
    } catch (err: any) {
      // API response mapping based on your shared JSON structure
      const apiError =
        err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(apiError);
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-10 lg:py-14 min-h-[80vh]">
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
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              Sign In
            </h1>
          </div>

          {/* Social Login Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-3 pt-4 flex items-center justify-center"
          >
            <div className="flex items-center gap-4 justify-center">
              <Button className="" variant="outline" type="button">
                <FcGoogle className="mr-2" /> Google
              </Button>
              <Button className="" variant="outline" type="button">
                <FaFacebook className="text-blue-600 mr-2" /> Facebook
              </Button>
            </div>
          </motion.div>

          <div className="relative my-8 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-rose-50"></span>
            <span className="relative bg-white px-4 text-xs uppercase text-gray-400 font-medium">
              Or continue with
            </span>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`${inputClassName} pl-10 pr-10 ${errors.email ? "border-rose-400 ring-4 ring-rose-100" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-semibold text-red-500 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`${inputClassName} pl-10 pr-10 ${errors.password ? "border-rose-400 ring-4 ring-rose-100" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-rose-500`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-semibold text-red-500 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-rose-200 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/account/forgot-password"
                className="text-sm text-rose-500 hover:text-rose-600 font-bold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              size="lg"
              className="h-12 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/signup"
                className="font-bold text-rose-500 hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
