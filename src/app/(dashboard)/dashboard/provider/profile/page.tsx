"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useRestaurant } from "@/module/hooks/useRestaurant";
import RestaurantSkeleton from "@/components/provider/Skeletons/RestaurantSkeleton";

import ProfileHeader from "./_components/ProfileHeader";
import HeroSection from "./_components/HeroSection";
import BusinessDetails from "./_components/BusinessDetails";
import SidebarCards from "./_components/SidebarCards";
import { CreateRestaurantSchema } from "@/module/validations/restaurant.validation";
import { Loader2, Save, Settings, Store } from "lucide-react";

export default function RestaurantProfile() {
  const {
    restaurantProfile,
    isFetchingRestaurant,
    updateRestaurant,
    isUpdatingRestaurant,
  } = useRestaurant();

  const [isEditing, setIsEditing] = useState(false);

  // শর্টকাট রেফারেন্স তৈরি করুন যাতে বারবার .restaurant লিখতে না হয়
  const restaurant = restaurantProfile?.restaurant;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateRestaurantSchema),
    defaultValues: {
      restaurantName: "",
      description: "",
      city: "",
      address: "",
      contactNumber: "",
      cuisine: "",
      openingHours: "",
    },
  });

  console.log(errors);

  const watchedValues = watch();

  useEffect(() => {
    if (restaurant) {
      reset({
        restaurantName: restaurant.restaurantName || "",
        description: restaurant.description || "",
        city: restaurant.city || "",
        address: restaurant.address || "",
        contactNumber: restaurant.contactNumber || "",
        cuisine: restaurant.cuisine || "",
        openingHours: restaurant.openingHours || "",
      });
    }
  }, [restaurant, reset]);

  const profileCompletion = useMemo(() => {
    if (!restaurant) return 0;
    const fields = [
      watchedValues.restaurantName,
      watchedValues.description,
      watchedValues.address,
      watchedValues.contactNumber,
      watchedValues.cuisine,
      watchedValues.openingHours,
      restaurant.logo,
      restaurant.coverImage,
    ];
    const completedCount = fields.filter((field) => !!field).length;
    return Math.round((completedCount / fields.length) * 100);
  }, [watchedValues, restaurant]);

  if (isFetchingRestaurant) return <RestaurantSkeleton />;

  const onSave = (data: any) => {
    updateRestaurant(data, {
      onSuccess: (res: any) => {
        toast.success("Restaurant updated successfully!");
        setIsEditing(false);
      },
      onError: (error: any) => {
        const errorSources = error?.response?.data?.errorSources;
        if (Array.isArray(errorSources)) {
          errorSources.forEach((err: any) => {
            setError(err.path, { type: "manual", message: err.message });
          });
        }

        const errorMessage = error?.message;
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit(onSave)}>
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-200">
                  <Store size={24} />
                </div>
                Manage Profile
              </h2>
              <p className="text-slate-500 font-medium ml-12">
                Optimize your restaurant's digital presence
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Status Toggle */}
              <button
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all border`}
              >
                <div className={`w-2 h-2 rounded-full `} />
                Store Closed
              </button>

              {/* Action Button (Edit/Save) */}

              {isEditing && (
                <button
                  type="submit"
                  disabled={isUpdatingRestaurant}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg ${
                    isEditing
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {isUpdatingRestaurant ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={18} /> Save Changes
                    </>
                  )}
                </button>
              )}
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg ${
                    isEditing
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <>
                    <Settings size={18} /> Edit Profile
                  </>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* এখানে restaurant অবজেক্টটি পাঠাতে হবে */}
        {restaurant && (
          <HeroSection
            providerData={restaurant}
            completion={profileCompletion}
            setValue={setValue}
            errors={errors}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2">
            <BusinessDetails
              isEditing={isEditing}
              register={register}
              errors={errors}
              formData={watchedValues}
            />
          </div>
          <div>
            {restaurant && (
              <SidebarCards
                slug={restaurant.slug}
                completion={profileCompletion}
                openingHours={
                  watchedValues.openingHours || restaurant.openingHours
                }
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
