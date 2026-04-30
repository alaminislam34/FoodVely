"use client";

import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"; // Controller add kora hoyeche
import { toast } from "react-hot-toast";
import { useAuth } from "@/module/hooks/useAuth";
import { useRouter } from "next/navigation";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export interface IEmailVerifyFormData {
  email: string;
  otp: string;
}

const EmailVerify = () => {
  const router = useRouter();
  const { verifyEmail, resendOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IEmailVerifyFormData>({
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("pendingEmailVerification");
    const savedRole = sessionStorage.getItem("pendingRole");

    if (savedEmail && savedRole) {
      setEmail(savedEmail);
      setValue("email", savedEmail);
      setRole(savedRole || "");
    } else {
      router.replace("/account/signup");
    }
  }, [router, setValue]);

  if (!email) return null;

  const maskEmail = (email: string | null) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    return `${user.substring(0, 2)}***@${domain}`;
  };

  const onSubmit = async (data: IEmailVerifyFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        email: data.email,
        otp: data.otp,
      };
      const res = await verifyEmail(payload);

      if (res?.success) {
        toast.success("Email verified successfully!");
        sessionStorage.removeItem("pendingEmailVerification");
        sessionStorage.removeItem("pendingRole");
        setTimeout(() => {
          if (role === "PROVIDER") {
            router.push("/account/signup/restaurant-details");
            return;
          }
          router.push("/");
        }, 1000);
      } else {
        toast.error(res?.message);
      }
    } catch (error: any) {
      const errorData = error?.response?.data?.error;

      if (errorData?.details && Array.isArray(errorData.details)) {
        errorData.details.forEach((err: { path: string; message: string }) => {
          setError(err.path as any, {
            type: "manual",
            message: err.message,
          });
        });
      } else {
        toast.error(errorData?.message || "Invalid OTP or session expired");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const OtpResend = async () => {
    try {
      const res = await resendOtp(email);
      if (!res.success) {
        toast.error(res.message);
      }
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className="w-full max-w-md"
      >
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-rose-100/40 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">Verify Email</h1>
          <p className="text-sm text-slate-500 mb-6 mt-2">
            Enter the code sent to{" "}
            <span className="font-semibold text-slate-900">
              {maskEmail(email)}
            </span>
            . <br />
            <span className="text-xs italic text-slate-400">
              Can't find it? Check your spam folder.
            </span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              {/* Controller fixes the registration prop error */}
              <Controller
                control={control}
                name="otp"
                rules={{
                  required: "OTP is required",
                  minLength: { value: 6, message: "Enter 6 digits" },
                }}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    containerClassName="flex justify-center"
                  >
                    <InputOTPGroup className="flex gap-4">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className={`h-14 w-12 rounded-2xl border border-slate-200 text-xl font-bold focus:border-rose-500 transition-all ${
                            errors.otp
                              ? "border-red-500 ring-1 ring-red-100"
                              : ""
                          }`}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              {errors.otp && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => OtpResend()}
                className="text-xs font-semibold text-slate-500 hover:text-rose-500 hover:underline transition-colors"
              >
                Resend Code
              </button>
            </div>

            <Button
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-slate-900 text-white hover:bg-black font-bold shadow-lg transition-transform active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </Button>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-bold text-rose-500 hover:underline block w-full"
            >
              Change Email Address
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerify;
