"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  requestPasswordReset,
  verifyPasswordResetOtp,
} from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const storageKeys = {
  email: "foodvely_password_reset_email",
  token: "foodvely_password_reset_token",
};

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "otp">("otp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams.get("email") || "";
    const storedEmail = window.sessionStorage.getItem(storageKeys.email) || "";
    const initialEmail = queryEmail || storedEmail;

    if (initialEmail) {
      setEmail(initialEmail);
      setStep("otp");
    }
  }, [searchParams]);

  const validateEmail = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Sending reset code...");

    try {
      await requestPasswordReset(email);
      window.sessionStorage.setItem(storageKeys.email, email);
      window.sessionStorage.removeItem(storageKeys.token);
      setStep("otp");
      setOtp("");
      toast.dismiss(loadingToast);
      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error ? error.message : "Unable to send OTP.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Verifying code...");

    try {
      const response = await verifyPasswordResetOtp(email, otp);
      const resetToken = response.data?.resetToken;

      if (resetToken) {
        window.sessionStorage.setItem(storageKeys.token, resetToken);
      }

      window.sessionStorage.setItem(storageKeys.email, email);
      toast.dismiss(loadingToast);
      toast.success("Code verified. Continue to reset your password.");
      router.push(
        `/account/reset-password?email=${encodeURIComponent(email)}` +
          (resetToken ? `&token=${encodeURIComponent(resetToken)}` : ""),
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error ? error.message : "OTP verification failed.",
      );
    } finally {
      setIsSubmitting(false);
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
          className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] backdrop-blur"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <KeyRound size={22} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Forgot Password
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              {step === "email"
                ? "Enter your email to receive a reset code."
                : "Enter the 6-digit code sent to your email."}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-xl border border-rose-100 bg-white pl-10 pr-3 text-sm text-stone-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
                Send Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Verification code
                </label>
                <div className=" w-full">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    className="w-full"
                  >
                    <InputOTPGroup className=" *:py-2 w-full bg-white">
                      <InputOTPSlot
                        index={0}
                        className="size-12 w-full outline-none"
                      />
                      <InputOTPSlot index={1} className="size-12 w-full outline-none" />
                      <InputOTPSlot index={2} className="size-12 w-full outline-none" />
                      <InputOTPSlot index={3} className="size-12 w-full outline-none" />
                      <InputOTPSlot index={4} className="size-12 w-full outline-none" />
                      <InputOTPSlot index={5} className="size-12 w-full outline-none" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || otp.length !== 6}
                className="h-11 w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}
                Verify Code
              </Button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex w-full items-center justify-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
              >
                <ArrowLeft size={16} />
                Back to email
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-stone-500">
            Remember your password?{" "}
            <Link
              href="/account/signin"
              className="font-medium text-rose-500 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
