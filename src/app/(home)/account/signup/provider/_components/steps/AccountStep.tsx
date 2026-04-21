import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "../FormField";
import type { AccountFormData, FieldErrors } from "../types";

type AccountStepProps = {
  values: AccountFormData;
  errors: FieldErrors;
  isLoading: boolean;
  acceptedTerms: boolean;
  showPassword: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof AccountFormData, value: string) => void;
  onToggleTerms: (value: boolean) => void;
  onTogglePassword: () => void;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400  focus:ring-2 focus:ring-slate-100";

export function AccountStep({
  values,
  errors,
  isLoading,
  acceptedTerms,
  showPassword,
  onSubmit,
  onChange,
  onToggleTerms,
  onTogglePassword,
}: AccountStepProps) {
  return (
    <>
      <div className="mb-8 lg:mb-12 space-y-4 text-center">
        <div>
          <h1 className="text-2xl max-w-3/5 mx-auto font-bold font-Sofia text-[#202020] md:text-3xl lg:text-4xl">
            Grow Your Restaurant with Us
          </h1>
          <p className="mt-3 max-w-lg mx-auto text-sm leading-6 text-[#808080]">
            Join our platform, create your profile, and start connecting with
            more hungry customers today.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Owner Name"
          htmlFor="fullName"
          required
          error={errors.fullName}
        >
          <div className="relative">
            <User
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              id="fullName"
              type="text"
              value={values.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="John Doe"
              className={`${inputClassName}  pl-11`}
            />
          </div>
        </FormField>

        <FormField
          label="Business Email"
          htmlFor="email"
          required
          error={errors.email}
        >
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="name@example.com"
              className={`${inputClassName} pl-11`}
            />
          </div>
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          required
          error={errors.password}
        >
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="••••••••"
              className={`${inputClassName} pl-11 pr-11`}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>

        <FormField label="Terms" error={errors.terms}>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => onToggleTerms(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-rose-600 hover:underline"
              >
                Terms & Conditions
              </Link>{" "}
              and privacy policy.
            </span>
          </label>
        </FormField>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-12 w-full text-lg rounded-xl bg-linear-to-r from-rose-500 hover:from-rose-600 to-orange-400 hover:to-orange-500 duration-300"
        >
          {isLoading ? "Creating account..." : "Continue"}
        </Button>
      </form>
      <div className="mt-8 flex items-center justify-end">
        <Link
          href="/account/signin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
        >
          Already registered? Sign in
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
