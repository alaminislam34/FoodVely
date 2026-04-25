"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Store, ArrowLeft } from "lucide-react";

import { RestaurantStep } from "./steps/RestaurantStep";
import { useRestaurant } from "@/hooks/hooks/useRestaurant";
import { z } from "zod";
import { CreateRestaurantSchema } from "./validation";

export type RestaurantFormValues = z.infer<typeof CreateRestaurantSchema>;

const buildFormData = (data: RestaurantFormValues) => {
  const formData = new FormData();

  const { logoFile, coverImageFile, foodCategories, ...fields } = data;

  // text fields
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  // files
  if (logoFile instanceof File) {
    formData.append("logo", logoFile);
  }

  if (coverImageFile instanceof File) {
    formData.append("coverImage", coverImageFile);
  }

  // categories
  formData.append("foodCategories", JSON.stringify(foodCategories ?? []));

  return formData;
};

export function ProviderSignupFlow() {
  const router = useRouter();
  const { createRestaurant, isCreatingRestaurant } = useRestaurant();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(CreateRestaurantSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      address: "",
      contactNumber: "",
      foodCategories: [], // 👈 MUST be always array
      description: "",
      cuisine: "",
      openingHours: "",
      logoFile: null,
      coverImageFile: null,
    },
  });

  // Ensure values always has required fields
  const watchedValues = useWatch({ control }) as RestaurantFormValues;

  const handleFileChange = (
    field: "logoFile" | "coverImageFile",
    file: File | null,
  ) => {
    setValue(field, file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* ------------------------------
      SUBMIT HANDLER (CLEAN)
  --------------------------------*/
  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    try {
      createRestaurant(data, {
        onSuccess: (res: any) => {
          if (res?.success) {
            toast.success("Restaurant created successfully!");
            router.push("/dashboard/provider");
          } else {
            toast.error(res?.message || "Failed to create restaurant");
          }
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Something went wrong!";
          toast.error(message);
        },
      });
    } catch {
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rose-500"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-rose-100/30"
        >
          {/* Header */}
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

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key="step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <RestaurantStep
                register={register}
                errors={errors}
                values={{
                  restaurantName: watchedValues.restaurantName ?? "",
                  city: watchedValues.city ?? "",
                  address: watchedValues.address ?? "",
                  contactNumber: watchedValues.contactNumber ?? "",
                  foodCategories: watchedValues.foodCategories ?? [],
                  description: watchedValues.description ?? "",
                  cuisine: watchedValues.cuisine ?? "",
                  openingHours: watchedValues.openingHours ?? "",
                  logoFile: watchedValues.logoFile ?? null,
                  coverImageFile: watchedValues.coverImageFile ?? null,
                }}
                isLoading={isCreatingRestaurant}
                onBack={() => router.back()}
                onSubmit={handleSubmit(onSubmit) as any}
                onFileChange={handleFileChange}
                setValue={setValue}
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="mt-10 flex justify-center gap-2">
            <div className="h-1.5 w-10 rounded-full bg-rose-500" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
