"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
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

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/module/hooks/useAuth";
import { set } from "zod";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const storageKeys = {
  email: "foodvely_password_reset_email",
  token: "foodvely_password_reset_token",
};

type EmailFormValues = {
  email: string;
};

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTryAgain, setIsTryAgain] = useState(0);
  const [limitTime, setLimitTime] = useState(0);

  const {
    forgotPassword: requestPasswordReset,
    verifyEmail: verifyPasswordResetOtp,
  } = useAuth();

  // React Hook Form Setup
  const {
    setError,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<EmailFormValues>({
    defaultValues: { email: "" },
  });

  const maskEmail = () => {
    const email = getValues("email");
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    const maskedLocal =
      localPart.length > 2
        ? localPart[0] + "*".repeat(localPart.length - 2) + localPart.slice(-1)
        : localPart[0] + "*";
    return `${maskedLocal}@${domain}`;
  };
  // Sync SearchParams or SessionStorage
  useEffect(() => {
    const queryEmail = searchParams.get("email") || "";
    const storedEmail = window.sessionStorage.getItem(storageKeys.email) || "";
    const initialEmail = queryEmail || storedEmail;

    if (initialEmail) {
      setValue("email", initialEmail);
      setStep("otp");
    }
  }, [searchParams, setValue]);

  // Step 1: Send OTP
  const onSendEmail = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      window.sessionStorage.setItem(storageKeys.email, data.email);
      window.sessionStorage.removeItem(storageKeys.token);
      setStep("otp");
      setOtp("");
      toast.success("OTP sent to your email.");
    } catch (error: any) {
      console.log(error);
      setError("email", {
        message: error?.message,
      });

      if (error?.timeUntilRetry) {
        setIsTryAgain(error.timeUntilRetry);
        setLimitTime(error.timeUntilRetry);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isTryAgain || isTryAgain <= 0) return;

    setLimitTime(isTryAgain);

    const interval = setInterval(() => {
      setLimitTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTryAgain(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTryAgain]);

  // Step 2: Verify OTP
  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter the 6-digit code");

    setIsLoading(true);
    const email = getValues("email");

    try {
      await verifyPasswordResetOtp({ email, otp });
      window.sessionStorage.setItem(storageKeys.token, otp);
      toast.success("OTP verified!");
      router.push(`/account/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="w-full max-w-md"
      >
        <div className="rounded-[2.5rem] border border-stone-200/60 bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <KeyRound size={26} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              {step === "email" ? "Forgot Password" : "Check your email"}
            </h1>
            <p className="mt-2 text-balance text-sm leading-relaxed text-stone-500">
              {step === "email"
                ? "No worries! Enter your email and we'll send you a reset code."
                : `We've sent a 6-digit code to ${maskEmail()}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit(onSendEmail)}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold uppercase tracking-wider text-stone-500 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                      size={18}
                    />
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      placeholder="name@example.com"
                      className={`h-12 w-full rounded-2xl border bg-stone-50/50 pl-11 pr-4 text-sm transition-all focus:bg-white focus:outline-none focus:ring-4 ${
                        errors.email
                          ? "border-red-200 focus:border-red-400 focus:ring-red-50"
                          : "border-stone-200 focus:border-rose-400 focus:ring-rose-50"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="ml-1 text-xs font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isTryAgain > 0}
                  className="group h-12 w-full rounded-2xl bg-rose-500 text-[15px] font-semibold text-white transition-all hover:bg-rose-600 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {isTryAgain > 0 ? (
                        `Try again in ${limitTime}s`
                      ) : (
                        <>
                          Send Code
                          <ArrowRight
                            className="ml-2 transition-transform group-hover:translate-x-1"
                            size={18}
                          />
                        </>
                      )}
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={onVerifyOtp}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    containerClassName="flex justify-center"
                  >
                    <InputOTPGroup className="gap-3">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-14 w-12 rounded-xl border-stone-200 bg-stone-50/50 text-xl font-bold text-stone-900 transition-all focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-50"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => onSendEmail({ email: getValues("email") })}
                      className="text-sm font-semibold text-rose-500 transition hover:text-rose-600 hover:underline"
                    >
                      Didn&apos;t receive code? Resend
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="h-12 w-full rounded-2xl bg-rose-500 text-[15px] font-semibold text-white transition-all hover:bg-rose-600 disabled:bg-stone-200"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <ShieldCheck className="mr-2" size={20} />
                        Verify & Continue
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-stone-400 transition hover:text-stone-700"
                  >
                    <ArrowLeft size={16} />
                    Use a different email
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 border-t border-stone-100 pt-6 text-center">
            <p className="text-sm text-stone-500">
              Remembered your password?{" "}
              <Link
                href="/account/signin"
                className="font-bold text-rose-500 transition hover:text-rose-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
