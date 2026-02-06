"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id?: string;
            callback: (response: any) => void;
          }) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
        };
      };
    };
  }
}

export default function SignIn() {
  const router = useRouter();
  const { login, googleLogin, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [isGooglePrompting, setIsGooglePrompting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Sign in failed";
  };

  const storeTokens = (payload: unknown) => {
    const data = (payload as { data?: unknown } | undefined)?.data ?? payload;
    const tokens = (data as { tokens?: { access?: string; refresh?: string } })
      ?.tokens;
    if (!tokens?.access || !tokens?.refresh) return;
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
  };

  const redirectAfterLogin = (payload: unknown) => {
    const data = (payload as { data?: unknown } | undefined)?.data ?? payload;
    const user = (data as { user?: { role?: string; name?: string; email?: string } })
      ?.user;
    const role = user?.role?.toUpperCase();
    if (role === "PROVIDER") {
      router.push("/provider");
      return;
    }
    if (role === "CUSTOMER") {
      const identifier = (user?.name || user?.email || "me").trim();
      router.push(`/account/${encodeURIComponent(identifier)}`);
      return;
    }
    router.push("/");
  };

  const handleSignIn = handleSubmit(async (values) => {
    const loadingToast = toast.loading("Signing you in...");

    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });
      storeTokens(response);
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      setTimeout(() => redirectAfterLogin(response), 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(getErrorMessage(err));
      console.error(err);
    }
  });

  // Load script once (e.g., in useEffect)
  useEffect(() => {
    if (document.getElementById("google-gis")) return;
    const script = document.createElement("script");
    script.id = "google-gis";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleGoogleResponse = async (response: { credential?: string }) => {
    clearError();
    try {
      if (!response.credential) {
        toast.error("Google token missing");
        return;
      }
      const loginResponse = await googleLogin({ credential: response.credential });
      storeTokens(loginResponse);
      toast.success("Login successful!");
      setTimeout(() => redirectAfterLogin(loginResponse), 1000);
    } catch (err: any) {
      toast.error(err?.message || "Google login failed");
      console.error(err);
    }
  };

  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google Client ID is missing");
      return;
    }
    if (!isGoogleScriptLoaded || !window.google) {
      toast.error("Google login is not ready yet");
      return;
    }
    if (isGooglePrompting) return;

    setIsGooglePrompting(true);
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (
        notification?.isNotDisplayed?.() ||
        notification?.isSkippedMoment?.()
      ) {
        setIsGooglePrompting(false);
      }
    });
  };

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
            <p className="text-gray-600 ">Sign in to your Foodvely account</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm  font-semibold text-gray-800">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-rose-500 focus:border-transparent"
                  }`}
                />
              </div>
              {errors.email?.message && (
                <p className="text-red-500 text-sm ">
                  {errors.email.message as string}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm  font-semibold text-gray-800">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
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
              {errors.password?.message && (
                <p className="text-red-500 text-sm ">
                  {errors.password.message as string}
                </p>
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
                <span className="text-sm text-gray-600 ">Remember me</span>
              </label>
              <Link
                href="/account/forgot-password"
                className="text-sm text-rose-500 hover:text-rose-600  font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white  font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
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
                <span className="px-2 bg-white/40 text-gray-600 ">
                  Don't have an account?
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="">
            <Link
              href="/account/signup"
              className="w-full py-3 px-4 rounded-2xl border-2 border-rose-500 text-rose-500  font-bold hover:bg-rose-50 transition-all duration-300 text-center block"
            >
              Create New Account
            </Link>
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="mt-8 hidden space-y-3">
            <p className="text-center text-sm text-gray-600 ">
              Or continue with
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={
                  !isGoogleScriptLoaded || isLoading || isGooglePrompting
                }
                className="py-2 px-4 rounded-2xl bg-white/60 border border-gray-200 hover:bg-white transition-all flex items-center justify-center gap-2  shadow-sm disabled:opacity-60"
                aria-label="Continue with Google"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.73 1.23 9.24 3.25l6.9-6.9C36.03 2.2 30.38 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.03 6.23C12.35 13.45 17.7 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.14 24.55c0-1.66-.15-3.26-.43-4.8H24v9.1h12.43c-.54 2.9-2.18 5.36-4.63 7.02l7.1 5.5c4.16-3.84 6.24-9.5 6.24-16.82z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.59 28.55a14.5 14.5 0 0 1-.76-4.55c0-1.58.27-3.1.76-4.55l-8.03-6.23A23.96 23.96 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l8.03-6.23z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.1-5.5c-1.98 1.33-4.52 2.12-8.8 2.12-6.3 0-11.65-3.95-13.41-9.47l-8.03 6.23C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span className="text-sm font-semibold">Google</span>
              </button>
                {error && (
                  <p className="text-center text-xs text-red-500 ">{error}</p>
                )}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-600 mt-6 "
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
