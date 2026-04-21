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
    <form onSubmit={onSubmit} className="space-y-5">
      <div className=" text-sm text-[#808080]">Please check your email!</div>

      <FormField label="OTP Code" required error={errors.otp}>
        <div className="w-full py-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={onOtpChange}
            className="w-full"
          >
            <InputOTPGroup className="w-full">
              <InputOTPSlot index={0} className="w-full text-lg" />
              <InputOTPSlot index={1} className="w-full text-lg" />
              <InputOTPSlot index={2} className="w-full text-lg" />
              <InputOTPSlot index={3} className="w-full text-lg" />
              <InputOTPSlot index={4} className="w-full text-lg" />
              <InputOTPSlot index={5} className="w-full text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </FormField>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 flex-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-11 flex-1 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </form>
  );
}
