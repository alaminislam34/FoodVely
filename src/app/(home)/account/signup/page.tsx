"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import RoleSelector from "../components/RoleSelector";
import BasicFields from "../components/BasicFields";
import ProviderFields from "../components/ProviderFields";
import PasswordStrength from "../components/PasswordStrength";
import { useAuth } from "../hooks/useAuth";
import API_ENDPOINTS from "@/api/ApiEndpoints";
import axios from "axios";
import type { SignupFormValues, UserRole } from "./types";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 1 },
  visible: { once: true, opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface RestaurantPayload {
  name: string;
  description?: string;
  address: string;
  city?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  cuisineTypes: string[];
  deliveryFee?: number;
  minOrderAmount?: number;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  restaurant?: RestaurantPayload;
}

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { verifyAccount, resendOtp, isLoading: authLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
      cuisineTypes: [],
    },
  });

  const role = watch("role");
  const passwordValue = watch("password");

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    calculatePasswordStrength(passwordValue || "");
  }, [passwordValue]);

  const getErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (!err.response) return "Network error. Please check your connection.";
      const apiMessage = (
        err.response?.data as { message?: string } | undefined
      )?.message;
      return apiMessage || err.message || "Request failed";
    }
    if (err instanceof Error) return err.message;
    return "Request failed";
  };

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.REGISTER_API}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      setVerifyEmail(variables.email);
      setStep("verify");
      toast.success("Account created! Check your email for OTP.");
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      const normalized = message.toLowerCase();
      if (normalized.includes("already") && normalized.includes("verified")) {
        toast.error("Already verified, please login");
      } else if (normalized.includes("already exists")) {
        const emailValue = getValues("email");
        setVerifyEmail(emailValue);
        setStep("verify");
        toast.success("Check your email for OTP.");
      } else {
        toast.error(message || "Registration failed. Try again.");
      }
      console.error(err);
    },
  });

  const handleSignUp = handleSubmit(async (values) => {
    const loadingToast = toast.loading("Creating your account...");

    try {
      const fullName = `${values.firstName} ${values.lastName}`.trim();
      const payload: RegisterPayload = {
        name: fullName,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      if (values.role === "PROVIDER") {
        const safeNumber = (value?: number) =>
          typeof value === "number" && !Number.isNaN(value) ? value : undefined;

        const cuisineTypes = (values.cuisineTypes || []).filter(Boolean);

        payload.restaurant = {
          name: values.restaurantName?.trim() || "",
          address: values.address?.trim() || "",
          city: values.city?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          cuisineTypes,
          deliveryFee: safeNumber(values.deliveryFee),
          minOrderAmount: safeNumber(values.minimumOrder),
        };
      }

      await registerMutation.mutateAsync(payload);
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.dismiss(loadingToast);
    }
  });

  const registerOptions = useMemo(
    () => ({
      firstName: { required: "First name is required" },
      lastName: { required: "Last name is required" },
      email: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
      password: {
        required: "Password is required",
        minLength: { value: 8, message: "Password must be at least 8 characters" },
      },
      confirmPassword: {
        required: "Please confirm your password",
        validate: (value: string) =>
          value === getValues("password") || "Passwords do not match",
      },
    }),
    [getValues],
  );

  const providerRegisterOptions = useMemo(
    () => ({
      phone: {
        validate: (value?: string) =>
          role === "PROVIDER"
            ? Boolean(value?.trim()) || "Phone number is required"
            : true,
      },
      restaurantName: {
        validate: (value?: string) =>
          role === "PROVIDER"
            ? Boolean(value?.trim()) || "Restaurant name is required"
            : true,
      },
      address: {
        validate: (value?: string) =>
          role === "PROVIDER"
            ? Boolean(value?.trim()) || "Address is required"
            : true,
      },
      city: {},
      deliveryFee: { valueAsNumber: true },
      minimumOrder: { valueAsNumber: true },
    }),
    [role],
  );

  const cuisineInputProps = register("cuisineTypes", {
    validate: (value) =>
      role === "PROVIDER"
        ? (value?.length ?? 0) > 0 || "Select at least one cuisine type"
        : true,
  });

  const handleRoleChange = (nextRole: UserRole) => {
    setValue("role", nextRole, { shouldValidate: true });
    if (nextRole === "CUSTOMER") {
      setActiveCategory(null);
      setValue("cuisineTypes", []);
      clearErrors([
        "phone",
        "restaurantName",
        "address",
        "city",
        "deliveryFee",
        "minimumOrder",
        "cuisineTypes",
      ]);
    }
  };

  const handleCategorySelect = (category: string | null) => {
    setActiveCategory(category);
    setValue("cuisineTypes", category ? [category] : [], {
      shouldValidate: true,
    });
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    const loadingToast = toast.loading("Verifying account...");

    try {
      await verifyAccount({ email: verifyEmail, otp });
      toast.dismiss(loadingToast);
      toast.success("Account verified! Redirecting...");
      setTimeout(() => router.push("/account/signin"), 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      const message = getErrorMessage(err);
      if (/otp expired/i.test(message)) {
        toast.error("OTP expired, please resend");
      } else {
        toast.error(message || "Verification failed. Try again.");
      }
      console.error(err);
    }
  };

  const handleResendOtp = async () => {
    if (!verifyEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const loadingToast = toast.loading("Resending OTP...");

    try {
      await resendOtp({ email: verifyEmail });
      toast.dismiss(loadingToast);
      toast.success("OTP resent");
    } catch (err) {
      toast.dismiss(loadingToast);
      const message = getErrorMessage(err);
      toast.error(message || "Failed to resend OTP");
      console.error(err);
    }
  };

  if (step === "verify") {
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
              <h1 className="text-3xl md:text-4xl  font-bold text-gray-900 mb-2">
                Verify Account
              </h1>
              <p className="text-gray-600 ">
                Enter the code sent to {verifyEmail}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <motion.div className="space-y-2">
                  <label className="block text-sm  font-semibold text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-600 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </motion.div>
                <motion.div className="space-y-2 mt-4">
                  <label className="block text-sm  font-semibold text-gray-800">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-600 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-center text-lg tracking-widest font-bold"
                  />
                </motion.div>
                <div className="flex items-center justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={authLoading}
                    className="w-full text-rose-500  font-semibold hover:underline disabled:opacity-75"
                  >
                    {authLoading ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={authLoading || !otp || !verifyEmail}
                className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white  font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Account
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep("register")}
                className="w-full text-rose-500  font-semibold hover:underline"
              >
                Back to Registration
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
        className="w-full max-w-2xl"
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

        {/* Sign Up Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-900 mb-2">
              Join Food<span className="text-rose-600">vally</span>
            </h1>
            <p className="text-gray-600 ">Create your account to get started</p>
          </div>

          {/* Role Selector Component */}
          <RoleSelector role={role} onChange={handleRoleChange} />

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Basic Fields Component */}
            <BasicFields
              register={register}
              registerOptions={registerOptions}
              errors={errors}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              passwordStrength={passwordStrength}
              passwordValue={passwordValue}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              PasswordStrengthComponent={PasswordStrength}
            />

            {/* Provider Fields Component */}
            <AnimatePresence mode="wait">
              {role === "PROVIDER" && (
                <motion.div
                  key="provider-fields"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-gray-200 pt-6 overflow-visible"
                >
                  <ProviderFields
                    register={register}
                    registerOptions={providerRegisterOptions}
                    errors={errors}
                    activeCategory={activeCategory}
                    onSelectCategory={handleCategorySelect}
                    cuisineInputProps={cuisineInputProps}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {registerMutation.error && (
              <p className="text-center text-sm text-red-500">
                {getErrorMessage(registerMutation.error)}
              </p>
            )}

            {/* Sign Up Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white  font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 mt-6"
            >
              {registerMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
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
                <span className="px-2 bg-white/40 text-gray-600 ">
                  Already have an account?
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sign In Link */}
          <motion.div variants={itemVariants}>
            <Link
              href="/account/signin"
              className="w-full py-3 px-4 rounded-2xl border-2 border-rose-500 text-rose-500  font-bold hover:bg-rose-50 transition-all duration-300 text-center block"
            >
              Sign In Instead
            </Link>
          </motion.div>

          {/* Terms */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-gray-600 mt-6 "
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
