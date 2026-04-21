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
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

// --- Components & Constants ---

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const inputClassName =
  "h-11 w-full rounded-xl border border-rose-100 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100";

export default function SignUp() {
  const router = useRouter();
  const { register, verifyAccount, isLoading, isAuthenticated, user } =
    useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

    toast.loading("Creating account...");

    setTimeout(() => {
      toast.success("Account created. Check your email for OTP.");
      setStep("verify");
    }, 1000);
    // try {
    //   await register(formData.name, formData.email, formData.password);
    //   toast.dismiss(loadingToast);
    //   toast.success("Account created. Check your email for OTP.");
    //   setStep("verify");
    // } catch (error: any) {
    //   toast.dismiss(loadingToast);
    //   toast.error(error?.message || "Registration failed");
    // }
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
      <section className="flex items-center min-h-180 justify-center px-4 py-10 lg:py-14">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white/95 p-8 lg:p-12 shadow-[0_24px_60px_-24px_rgba(190,24,93,0.15)]">
            <h1 className="text-center text-2xl font-semibold text-gray-900">
              Verify Account
            </h1>
            <p className="mb-6 mt-2 text-center text-sm text-gray-600">
              Enter the OTP sent to {formData.email}
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  OTP Code
                </label>
                <div className="w-full">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value.toUpperCase())}
                    className="w-full"
                  >
                    <InputOTPGroup className="grid w-full grid-cols-6 gap-2 rounded-none">
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-full rounded-md border text-lg font-semibold first:rounded-md first:border"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-12 w-full rounded-md border text-lg font-semibold first:rounded-md first:border"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-12 w-full rounded-md border text-lg font-semibold first:rounded-md first:border"
                      />
                      <InputOTPSlot
                        index={3}
                        className="h-12 w-full rounded-md border text-lg font-semibold first:rounded-md first:border"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-12 w-full rounded-md border text-lg font-semibold first:rounded-md first:border"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-12 w-full rounded-md border text-lg font-semibold first:rounded-md first:border"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                size="lg"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-full items-center justify-center px-4 py-10 lg:py-14">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        <div className="rounded-3xl border border-gray-100 bg-white/95 p-6 lg:p-12 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.15)]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-rose-50">
              <User size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join Foodvely in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClassName} pl-10 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClassName} pl-10 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClassName} pl-10 pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-[10px] border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-rose-500 hover:underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and privacy policy.
                </span>
              </label>
              {errors.terms && (
                <p className="ml-7 text-xs text-red-500">{errors.terms}</p>
              )}
            </motion.div>
            <br />
            <Button
              size="lg"
              disabled={isLoading || !acceptTerms}
              className="h-11 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Create Free Account
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>
          <motion.div className="text-black">
            <p className="text-sm text-center text-gray-600 mt-4">
              Want to sell your food?{" "}
              <Link
                href="/account/signup/provider"
                className="font-semibold text-rose-500 hover:underline"
              >
                Become a Food Provider
              </Link>
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3 py-4">
            <div className="grid grid-cols-2 items-center gap-4 justify-center">
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

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already a member?{" "}
              <Link
                href="/account/signin"
                className="font-semibold text-rose-500 hover:underline"
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
