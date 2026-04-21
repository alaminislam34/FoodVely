import type { AccountFormData, FieldErrors, RestaurantFormData } from "./types";

export const generateSlug = (restaurantName: string): string => {
  return restaurantName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const validateAccountStep = (
  values: AccountFormData,
  acceptedTerms: boolean,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!acceptedTerms) {
    errors.terms = "You must accept the terms to continue.";
  }

  return errors;
};

export const validateOtpStep = (otp: string): FieldErrors => {
  const errors: FieldErrors = {};
  const normalizedOtp = otp.trim();

  if (!/^\d{6}$/.test(normalizedOtp)) {
    errors.otp = "OTP must be exactly 6 digits.";
  }

  return errors;
};

export const validateRestaurantStep = (
  values: RestaurantFormData,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (values.restaurantName.trim().length < 2) {
    errors.restaurantName = "Restaurant name is required.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug is required.";
  }

  if (values.city.trim().length < 2) {
    errors.city = "City is required.";
  }

  if (values.address.trim().length < 5) {
    errors.address = "Address is required.";
  }

  return errors;
};
