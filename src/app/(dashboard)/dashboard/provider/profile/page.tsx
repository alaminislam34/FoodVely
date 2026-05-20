"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useRestaurant } from "@/module/hooks/useRestaurant";
import RestaurantSkeleton from "@/components/provider/Skeletons/RestaurantSkeleton";

import HeroSection from "./_components/HeroSection";
import BusinessDetails from "./_components/BusinessDetails";
import SidebarCards from "./_components/SidebarCards";
import { CreateRestaurantSchema } from "@/module/validations/restaurant.validation";
import { Loader2, Save, Settings, Store } from "lucide-react";
import ProfileHeader from "./_components/ProfileHeader";

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
    <div className="pb-20 px-4">
      <Toaster position="top-right" />
      <ProfileHeader
        isActive={true}
        isEditing={isEditing}
        isLoading={isUpdatingRestaurant}
        setIsEditing={setIsEditing}
      />
      <HeroSection />

      <form onSubmit={handleSubmit(onSave)}>
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
