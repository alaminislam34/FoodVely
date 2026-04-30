"use client";

import React, { useState } from "react";
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
  Store,
  UserCircle,
} from "lucide-react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "@/module/hooks/useAuth";

// --- VALIDATION SCHEMA ---
export const SignUpSchemaValidation = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Use uppercase, lowercase, number, and symbol",
    ),
  role: z.enum(["CUSTOMER", "PROVIDER"]).default("CUSTOMER"),
  rememberMe: z.boolean().optional().default(false),
});

export type ISignUpFormData = z.input<typeof SignUpSchemaValidation>;

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Local state for role toggle (default is CUSTOMER)
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "PROVIDER">(
    "CUSTOMER",
  );

  const {
    register: signup,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<ISignUpFormData>({
    resolver: zodResolver(SignUpSchemaValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      rememberMe: false,
    },
  });

  // Handle Role Change
  const toggleRole = (role: "CUSTOMER" | "PROVIDER") => {
    setActiveRole(role);
    setValue("role", role);
  };

  const onRegisterSubmit = async (data: ISignUpFormData) => {
    setIsProcessing(true);
    try {
      const res = await register(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Store context for verification
      sessionStorage.setItem("pendingEmailVerification", data.email);
      sessionStorage.setItem("pendingRole", data.role as string);

      toast.success("Registration successful!");
      router.push("/account/signup/verify");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12 lg:py-20 bg-slate-50/50">
      <AnimatePresence mode="wait">
        <motion.div
          key="register"
          initial="initial"
          animate="animate"
          variants={variants}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 lg:p-12 shadow-2xl shadow-rose-100/40">
            <Header
              title={
                activeRole === "CUSTOMER" ? "Create Account" : "Partner with Us"
              }
              subtitle={
                activeRole === "CUSTOMER"
                  ? "Join Foodvely and explore delicious meals"
                  : "Register your restaurant and grow your business"
              }
            />

            {/* --- ROLE SELECTION TABS --- */}
            <div className="mb-8 flex p-1.5 bg-slate-100 rounded-2xl relative">
              <button
                type="button"
                onClick={() => toggleRole("CUSTOMER")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all z-10 ${
                  activeRole === "CUSTOMER"
                    ? "text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <UserCircle size={18} />
                Customer
              </button>
              <button
                type="button"
                onClick={() => toggleRole("PROVIDER")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all z-10 ${
                  activeRole === "PROVIDER"
                    ? "text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Store size={18} />
                Restaurant
              </button>

              {/* Animated Background Slider */}
              <motion.div
                layoutId="activeRole"
                className="absolute inset-y-1.5 left-1.5 bg-white rounded-xl shadow-sm w-[calc(50%-6px)]"
                initial={false}
                animate={{ x: activeRole === "CUSTOMER" ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>

            <form
              onSubmit={handleSubmit(onRegisterSubmit)}
              className="space-y-5"
            >
              <InputGroup
                label={
                  activeRole === "CUSTOMER" ? "Full Name" : "Owner Full Name"
                }
                icon={<User size={18} />}
                placeholder="Enter your full name"
                error={formErrors.name?.message}
                registration={signup("name")}
              />

              <InputGroup
                label="Email Address"
                type="email"
                icon={<Mail size={18} />}
                placeholder="Enter your email address"
                error={formErrors.email?.message}
                registration={signup("email")}
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...signup("password")}
                    className={`h-12 w-full rounded-xl border pl-10 pr-10 outline-none transition focus:ring-4 ${
                      formErrors.password
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
                {formErrors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {formErrors.password.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isProcessing}
                type="submit"
                className="h-13 w-full rounded-2xl bg-rose-500 text-white hover:bg-rose-600 font-bold text-base shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {activeRole === "CUSTOMER"
                      ? "Create Account"
                      : "Register as Partner"}
                    <ArrowRight size={18} className="ml-2" />
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

// --- REUSABLE COMPONENTS ---

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  registration: UseFormRegisterReturn;
}

const InputGroup = ({
  label,
  icon,
  error,
  registration,
  ...props
}: InputGroupProps) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        {...registration}
        {...props}
        className={`h-12 w-full rounded-xl border pl-10 outline-none transition focus:ring-4 ${
          error
            ? "border-red-500 focus:ring-red-50"
            : "border-slate-100 focus:border-rose-400 focus:ring-rose-50"
        }`}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6 text-center">
    <h1 className="text-3xl font-black text-slate-800">{title}</h1>
    <p className="mt-2 text-slate-500 font-medium text-sm">{subtitle}</p>
  </div>
);

const SocialAuth = () => (
  <div className="mt-8 space-y-4">
    <div className="relative flex items-center justify-center">
      <span className="absolute inset-x-0 h-px bg-slate-100"></span>
      <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        Or continue with
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        type="button"
        className="h-12 rounded-xl border-slate-100 font-bold hover:bg-slate-50 text-slate-600"
      >
        <FcGoogle className="mr-2 text-lg" /> Google
      </Button>
      <Button
        variant="outline"
        type="button"
        className="h-12 rounded-xl border-slate-100 font-bold hover:bg-slate-50 text-blue-600"
      >
        <FaFacebook className="mr-2 text-lg" /> Facebook
      </Button>
    </div>
  </div>
);
