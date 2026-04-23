"use client";

import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const EmailVerify = () => {
  return (
    <div>
      <motion.div key="verify" className="w-full max-w-md">
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-rose-100/40 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Verify Email</h1>

          <form className="space-y-6">
            <InputOTP maxLength={6}>
              <InputOTPGroup className="flex gap-2 justify-center w-full">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-14 w-12 rounded-xl border-slate-200 text-xl font-bold focus:border-rose-500"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-xs px-2 font-medium text-[#808080] hover:underline"
              >
                Resend Code
              </button>
            </div>
            <Button className="h-12 w-full rounded-xl bg-slate-900 text-white hover:bg-black font-bold">
              Verify OTP
            </Button>

            <button
              type="button"
              className="text-sm font-bold text-rose-500 hover:underline"
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
