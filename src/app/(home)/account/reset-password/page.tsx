"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/hooks/useAuth";

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const storageKeys = {
  email: "foodvely_password_reset_email",
  token: "foodvely_password_reset_token",
};

const inputClassName =
  "h-11 w-full rounded-xl border border-rose-100 bg-white pl-10 pr-10 text-sm text-stone-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100";

export default function ResetPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams.get("email") || "";
    const storedEmail = window.sessionStorage.getItem(storageKeys.email) || "";
    const initialEmail = queryEmail || storedEmail;
    if (!initialEmail) {
      router.replace("/account/forgot-password");
      return;
    }
    setEmail(initialEmail);
  }, [router, searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        email,
        oldPassword,
        newPassword,
      }
      const res = await resetPassword(payload);

      if (res) {
        toast.success(res);
        router.replace("/account/login");
      } else {
        toast.error(res);
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-10 lg:py-14">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-rose-100 bg-white/95 p-6 shadow-[0_24px_60px_-24px_rgba(190,24,93,0.35)]"
        >
          <div className="mb-6 text-center">
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"
            >
              <KeyRound size={22} />
            </motion.div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a new password for{" "}
              <span className="font-semibold text-gray-800">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Old Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
              Update Password
            </Button>
          </form>

          <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-xs text-gray-600">
            Use a password that is at least 8 characters long and easy for you
            to remember but hard to guess.
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            Need to re-run verification?{" "}
            <Link
              href="/account/forgot-password"
              className="font-semibold text-rose-500 hover:text-rose-600"
            >
              Start again
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
