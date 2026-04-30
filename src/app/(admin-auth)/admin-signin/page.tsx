"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { adminService } from "@/module/services/admin.service";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

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

export default function AdminSignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const res = await adminService.adminSignIn({
        email: data.email,
        password: data.password,
      });

      if (res.token) {
        localStorage.setItem("admin_token", res.token);
        toast.success("Admin login successful!");
        router.push("/dashboard/admin");
      }
    } catch (err: any) {
      const errorData = err?.response?.data?.error;

      if (errorData?.details && Array.isArray(errorData.details)) {
        errorData.details.forEach((err: { path: string; message: string }) => {
          setError(err.path as any, {
            type: "manual",
            message: err.message,
          });
        });
      }
      setServerError(
        err?.response?.data?.message || err.message || "Login failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-10 lg:py-14 h-full border min-h-screen">
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
              Admin Login
            </h1>
            <p className="mt-4 text-sm text-gray-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {serverError}
              </div>
            )}

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
                    placeholder="admin@example.com"
                    className={`${inputClassName} pl-10 pr-10 ${errors.email ? "border-rose-400 ring-4 ring-rose-100" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-semibold text-red-500 ml-1">
                    {errors.email.message as string}
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
                    {errors.password.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Remember */}
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
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-rose-500 hover:text-rose-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              size="lg"
              className="h-12 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Protected by secure authentication
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
