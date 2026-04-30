"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Store, ArrowLeft, ArrowRight } from "lucide-react";

import { RestaurantStep } from "./steps/RestaurantStep";
import { CreateRestaurantSchema } from "./validation";
import { z } from "zod";
import { useRestaurant } from "@/module/hooks/useRestaurant";

export type RestaurantFormValues = z.infer<typeof CreateRestaurantSchema>;

export function ProviderSignupFlow() {
  const router = useRouter();
  const { createRestaurant, isCreatingRestaurant } = useRestaurant();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(CreateRestaurantSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      address: "",
      contactNumber: "",
      foodCategories: [],
      description: "",
      cuisine: "",
      openingHours: "",
      logoFile: null,
      coverImageFile: null,
    },
  });

  // optimized watch for real-time preview in RestaurantStep
  const watchedValues = useWatch({ control });

  const handleFileChange = (
    field: "logoFile" | "coverImageFile",
    file: File | null,
  ) => {
    setValue(field, file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    createRestaurant(data, {
      onSuccess: (res: any) => {
        if (res?.success) {
          toast.success("Restaurant created successfully!");
          router.push("/dashboard/provider/profile");
        } else {
          toast.error(res?.message);
        }
      },
      onError: (error: any) => {
        if (error?.response?.data?.errorSources) {
          error.response.data.errorSources.forEach((err: any) => {
            setError(err.path as keyof RestaurantFormValues, {
              message: err.message,
            });
          });
        }
        const message =
          error?.response?.data?.message || "Something went wrong!";
        toast.error(message);
      },
    });
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard/provider/profile")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors"
          >
            Skip
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-rose-100/30"
        >
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Store size={38} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Create Restaurant
            </h1>
            <p className="text-slate-500 mt-2">
              Setup your restaurant profile to start receiving orders
            </p>
          </div>

          {/* Step Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key="restaurant-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RestaurantStep
                register={register}
                errors={errors}
                values={watchedValues as RestaurantFormValues}
                isLoading={isCreatingRestaurant}
                onBack={() => router.back()}
                onSubmit={handleSubmit(onSubmit)}
                onFileChange={handleFileChange}
                setValue={setValue}
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-10 flex justify-center gap-2">
            <div className="h-1.5 w-10 rounded-full bg-rose-500" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
