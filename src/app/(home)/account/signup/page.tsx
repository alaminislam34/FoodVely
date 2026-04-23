"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

// Hooks & Utils
import { useAuth } from "@/hooks/useAuth";
import { getRedirectPathByRole } from "@/utils/authRedirect";

// UI Components
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { httpClient } from "@/api/httpClient";
import API_ENDPOINTS from "@/api/ApiEndpoints";

const variants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

export const SignUpSchemaValidation = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .uppercase()
    .lowercase()
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[@$!%*?&]/, "Password must contain a special character"),
});
export interface ISignUpFormData {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
  [key: string]: unknown; // Index signature to allow extra fields if needed
}

export default function SignUp() {
  const router = useRouter();
  const { register, isAuthenticated, isProcessing, user, verifyEmail } =
    useAuth();

  // Local State
  const [isPending, setIsPending] = useState(false);

  // Local State
  const [step, setStep] = useState<"register" | "verify">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * 1. FIXED REDIRECT LOGIC
   * We only redirect if authenticated AND we are not currently in the verification step.
   */
  useEffect(() => {
    if (isAuthenticated && step !== "verify") {
      router.replace(getRedirectPathByRole(user?.role));
    }
  }, [isAuthenticated, step, user?.role, router]);

  // 2. Validation Logic
  const validate = () => {
    const errs: Record<string, string> = {};
    if (formData.name.length < 2) errs.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email";
    if (formData.password.length < 8)
      errs.password = "Min. 8 characters required";
    if (!acceptTerms) errs.terms = "Please accept terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 3. Handlers
  const onRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(formData);
      toast.success("Account created! Check your email for OTP.");
      setStep("verify");
    } catch (error: any) {
      toast.error(error?.message || "Registration failed");
    }
  };

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error("Enter full OTP");

    try {
      await verifyEmail({ email: formData.email, otp });
      toast.success("Verified successfully!");
      // Redirect to home/dashboard since user is already logged in
      router.push(getRedirectPathByRole(user?.role));
    } catch (error: any) {
      toast.error(error?.message || "Verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      await register(formData);
      toast.success("OTP resent to your email.");
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  // --- AUTH LOGIC (from useAuth) ---

  const {
    register: signup,
    handleSubmit,
    getValues,
    formState: { errors: formErrors },
  } = useForm<ISignUpFormData>({
    resolver: zodResolver(SignUpSchemaValidation as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleRegisterUser = async (payload: ISignUpFormData) => {
    setIsPending(true);

    try {
      const res = await httpClient.post(API_ENDPOINTS.REGISTER_API, payload);
      if (!res.success) {
        setIsPending(false);
        throw new Error(res.message);
      }
      toast.success("Registration successful! Please verify your email.");
      setStep("verify");
    } catch (error: any) {
      setIsPending(false);
      throw new Error(error.message);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12 lg:py-20 bg-slate-50/50">
      <AnimatePresence mode="wait">
        <motion.div key="register" {...variants} className="w-full max-w-lg">
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 lg:p-12 shadow-2xl shadow-rose-100/40">
            <Header
              title="Create Account"
              subtitle="Join Foodvely in seconds"
            />

            <form onSubmit={onRegisterSubmit} className="space-y-5">
              <InputGroup
                label="Full Name"
                name="name"
                icon={<User size={18} />}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
              />

              <InputGroup
                label="Email Address"
                name="email"
                type="email"
                icon={<Mail size={18} />}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="name@example.com"
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`h-12 w-full rounded-xl border pl-10 pr-10 outline-none transition focus:ring-4 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-50"
                        : "border-slate-100 focus:border-rose-400 focus:ring-rose-50"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-slate-500">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-bold text-rose-500 hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and Privacy Policy.
                  {errors.terms && (
                    <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
                  )}
                </span>
              </div>

              <Button
                disabled={isProcessing}
                className="h-12 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600 font-bold text-base shadow-lg shadow-rose-200"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>

            <SocialAuth />

            <p className="mt-8 text-center text-sm text-slate-500">
              Already a member?{" "}
              <Link
                href="/account/signin"
                className="font-bold text-rose-500 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// --- HELPER COMPONENTS ---

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-8 text-center">
    <h1 className="text-3xl font-black text-slate-800">{title}</h1>
    <p className="mt-2 text-slate-500 font-medium">{subtitle}</p>
  </div>
);

const InputGroup = ({ label, name, icon, error, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        name={name}
        className={`h-12 w-full rounded-xl border pl-10 outline-none transition focus:ring-4 ${
          error
            ? "border-red-500 focus:ring-red-50"
            : "border-slate-100 focus:border-rose-400 focus:ring-rose-50"
        }`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const SocialAuth = () => (
  <div className="mt-8 space-y-4">
    <div className="relative flex items-center justify-center">
      <span className="absolute inset-x-0 h-px bg-slate-100"></span>
      <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        Or continue with
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="h-12 rounded-xl border-slate-100 font-bold hover:bg-slate-50"
      >
        <FcGoogle className="mr-2" /> Google
      </Button>
      <Button
        variant="outline"
        className="h-12 rounded-xl border-slate-100 font-bold hover:bg-slate-50 text-blue-600"
      >
        <FaFacebook className="mr-2" /> Facebook
      </Button>
    </div>
  </div>
);
