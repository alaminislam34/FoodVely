"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import {
  registerProviderAccount,
  submitRestaurantInformation,
  uploadProviderImage,
  verifyProviderOtp,
} from "./api";
import { StepProgress } from "./StepProgress";
import type {
  AccountFormData,
  FieldErrors,
  RestaurantFormData,
  SignupStep,
} from "./types";
import {
  generateSlug,
  validateAccountStep,
  validateOtpStep,
  validateRestaurantStep,
} from "./validation";
import { AccountStep } from "./steps/AccountStep";
import { OtpStep } from "./steps/OtpStep";
import { RestaurantStep } from "./steps/RestaurantStep";

const initialAccountValues: AccountFormData = {
  fullName: "",
  email: "",
  password: "",
};

const initialRestaurantValues: RestaurantFormData = {
  restaurantName: "",
  slug: "",
  description: "",
  city: "",
  address: "",
  contactNumber: "",
  cuisine: "",
  openingHours: "",
  logoFile: null,
  coverImageFile: null,
};

export function ProviderSignupFlow() {
  const router = useRouter();

  const [step, setStep] = useState<SignupStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otp, setOtp] = useState("");

  const [accountValues, setAccountValues] =
    useState<AccountFormData>(initialAccountValues);
  const [restaurantValues, setRestaurantValues] = useState<RestaurantFormData>(
    initialRestaurantValues,
  );

  const [errors, setErrors] = useState<FieldErrors>({});

  const setStepErrors = (nextErrors: FieldErrors) => setErrors(nextErrors);

  const clearError = (field: string) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleAccountChange = (field: keyof AccountFormData, value: string) => {
    setAccountValues((current) => ({ ...current, [field]: value }));
    clearError(field);
  };

  const handleRestaurantChange = (
    field: keyof RestaurantFormData,
    value: string,
  ) => {
    setRestaurantValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "restaurantName") {
        next.slug = generateSlug(value);
      }
      return next;
    });
    clearError(field);
    if (field === "restaurantName") {
      clearError("slug");
    }
  };

  const handleRestaurantFileChange = (
    field: "logoFile" | "coverImageFile",
    file: File | null,
  ) => {
    setRestaurantValues((current) => ({ ...current, [field]: file }));
    clearError(field);
  };

  const handleSubmitAccountStep = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const nextErrors = validateAccountStep(accountValues, acceptedTerms);
    if (Object.keys(nextErrors).length > 0) {
      setStepErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast.success("Account created. Check your email for OTP.");
      setErrors({});
      setStep(2);
      setIsLoading(false);
    }, 1000);

    // try {
    //   await registerProviderAccount(accountValues);
    //   toast.dismiss(loadingToast);
    //   toast.success("Account created. Check your email for OTP.");
    //   setErrors({});
    //   setStep(2);
    // } catch (error) {
    //   toast.dismiss(loadingToast);
    //   toast.error(
    //     error instanceof Error ? error.message : "Registration failed.",
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleSubmitOtpStep = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const nextErrors = validateOtpStep(otp);
    // if (Object.keys(nextErrors).length > 0) {
    //   setStepErrors(nextErrors);
    //   return;
    // }
    toast.success("OTP verified successfully.");
    setErrors({});
    setStep(3);
  };

  const handleSubmitRestaurantStep = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const nextErrors = validateRestaurantStep(restaurantValues);
    if (Object.keys(nextErrors).length > 0) {
      setStepErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Submitting restaurant profile...");

    try {
      let logoUrl: string | undefined;
      let coverImageUrl: string | undefined;

      if (restaurantValues.logoFile) {
        logoUrl = await uploadProviderImage(restaurantValues.logoFile, "logo");
      }

      if (restaurantValues.coverImageFile) {
        coverImageUrl = await uploadProviderImage(
          restaurantValues.coverImageFile,
          "cover",
        );
      }

      await submitRestaurantInformation(accountValues.email, {
        restaurantName: restaurantValues.restaurantName.trim(),
        slug: restaurantValues.slug.trim(),
        description: restaurantValues.description.trim() || undefined,
        city: restaurantValues.city.trim(),
        address: restaurantValues.address.trim(),
        contactNumber: restaurantValues.contactNumber.trim() || undefined,
        cuisine: restaurantValues.cuisine.trim() || undefined,
        openingHours: restaurantValues.openingHours.trim() || undefined,
        logo: logoUrl,
        coverImage: coverImageUrl,
      });

      toast.dismiss(loadingToast);
      toast.success("Provider account setup complete.");
      router.push("/provider/overview");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit restaurant information.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
    }
  };

  return (
    <section className="flex min-h-180 items-center px-4 py-10 lg:py-14">
      <div className="mx-auto max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.22)] lg:p-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              {step === 1 ? (
                <AccountStep
                  values={accountValues}
                  errors={errors}
                  isLoading={isLoading}
                  acceptedTerms={acceptedTerms}
                  showPassword={showPassword}
                  onSubmit={handleSubmitAccountStep}
                  onChange={handleAccountChange}
                  onToggleTerms={setAcceptedTerms}
                  onTogglePassword={() =>
                    setShowPassword((current) => !current)
                  }
                />
              ) : null}

              {step === 2 ? (
                <OtpStep
                  email={accountValues.email}
                  otp={otp}
                  errors={errors}
                  isLoading={isLoading}
                  onOtpChange={(value) => {
                    setOtp(value);
                    clearError("otp");
                  }}
                  onBack={handleBack}
                  onSubmit={handleSubmitOtpStep}
                />
              ) : null}

              {step === 3 ? (
                <RestaurantStep
                  values={restaurantValues}
                  errors={errors}
                  isLoading={isLoading}
                  onBack={handleBack}
                  onSubmit={handleSubmitRestaurantStep}
                  onChange={handleRestaurantChange}
                  onFileChange={handleRestaurantFileChange}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
