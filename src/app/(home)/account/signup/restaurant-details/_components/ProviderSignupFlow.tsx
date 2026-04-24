"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";
import { Store, ArrowLeft } from "lucide-react";

import { RestaurantStep } from "./steps/RestaurantStep";
import { useRestaurant } from "@/hooks/hooks/useRestaurant";

// --- VALIDATION SCHEMA ---
// Schema-তে .default([]) এর সাথে .nonempty() বা explicit array টাইপ নিশ্চিত করা হয়েছে
const RestaurantSchema = z.object({
  restaurantName: z.string().min(2, "Restaurant name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().default(""), // optional() সরিয়ে default value দেয়া হয়েছে
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is too short"),
  contactNumber: z.string().min(10, "Valid contact number is required"),
  cuisine: z.string().default(""),
  openingHours: z.string().default(""),
  logoFile: z.any().nullable().optional(),
  coverImageFile: z.any().nullable().optional(),
  foodCategories: z.array(z.string()).default([]),
});

// Zod থেকে টাইপ ইনফার করা
type RestaurantFormValues = z.infer<typeof RestaurantSchema>;

export function ProviderSignupFlow() {
  const router = useRouter();
  const { createRestaurant, isCreatingRestaurant } = useRestaurant();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    // resolver-কে explicit টাইপ কাস্টিং করে দেওয়া হয়েছে যাতে internal mismatch না হয়
    resolver: zodResolver(RestaurantSchema) as any,
    defaultValues: {
      restaurantName: "",
      slug: "",
      description: "",
      city: "",
      address: "",
      contactNumber: "",
      cuisine: "",
      openingHours: "",
      foodCategories: [],
    },
  });

  // Slug Generation Logic
  const restaurantName = watch("restaurantName");
  useEffect(() => {
    if (restaurantName) {
      const generatedSlug = restaurantName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [restaurantName, setValue]);

  const handleFileChange = (
    name: "logoFile" | "coverImageFile",
    file: File | null,
  ) => {
    setValue(name, file, { shouldValidate: true });
  };

  // --- SUBMIT LOGIC ---
  // SubmitHandler টাইপটি ব্যবহার করে data mismatch ফিক্স করা হয়েছে
  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    try {
      const formData = new FormData();

      // Mapping text fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          !["logoFile", "coverImageFile", "foodCategories"].includes(key) &&
          value !== undefined &&
          value !== null
        ) {
          formData.append(key, value as string);
        }
      });

      // Append files
      if (data.logoFile instanceof File) {
        formData.append("logo", data.logoFile);
      }
      if (data.coverImageFile instanceof File) {
        formData.append("coverImage", data.coverImageFile);
      }

      // Append categories
      formData.append("foodCategories", JSON.stringify(data.foodCategories));

      createRestaurant(formData as any, {
        onSuccess: (res: any) => {
          if (res?.success) {
            toast.success("Restaurant profile created successfully!");
            router.push("/dashboard/provider");
          } else {
            toast.error(res?.message || "Failed to create profile");
          }
        },
        onError: (error: any) => {
          const apiError = error?.response?.data?.error;
          toast.error(apiError?.message || "Something went wrong!");
        },
      });
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-10 lg:py-14">
      <div className="mx-auto max-w-2xl w-full">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to previous
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-gray-100 bg-white p-8 lg:p-12 shadow-2xl shadow-rose-100/30"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-500 shadow-inner">
              <Store size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Restaurant Details
            </h1>
            <p className="mt-2 text-slate-500 font-medium italic">
              Complete your profile to start receiving orders
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="restaurant-form-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RestaurantStep
                register={register}
                errors={errors}
                values={watch()}
                isLoading={isCreatingRestaurant}
                onBack={() => router.back()}
                onSubmit={handleSubmit(onSubmit)}
                onFileChange={handleFileChange}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-2">
            <div className="h-1.5 w-10 rounded-full bg-rose-500"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
