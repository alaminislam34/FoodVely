import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "../FormField";
import type { FieldErrors } from "../types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type OtpStepProps = {
  email: string;
  otp: string;
  errors: FieldErrors;
  isLoading: boolean;
  onOtpChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function OtpStep({
  email,
  otp,
  errors,
  isLoading,
  onOtpChange,
  onBack,
  onSubmit,
}: OtpStepProps) {
  return (
    <>
      <div className="mb-8 lg:mb-12 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020] md:text-3xl lg:text-4xl">
            Verify Email
          </h1>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField label="OTP Code" required error={errors.otp}>
          <div className="w-full py-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={onOtpChange}
              containerClassName="w-full"
              className="w-full"
              placeholder="-"
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
        </FormField>

        <div className="flex gap-3 flex-row items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-11 flex-1 rounded-xl bg-linear-to-r from-rose-500 hover:from-rose-600 to-orange-400 hover:to-orange-500 duration-300"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </form>
    </>
  );
}
