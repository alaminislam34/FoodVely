import { registerUser, verifyAccount } from "@/services/authService";
import type { AccountFormData, RestaurantSubmitPayload } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const readErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as
      | { message?: string; error?: { message?: string } }
      | undefined;

    return payload?.message || payload?.error?.message || fallback;
  } catch {
    return fallback;
  }
};

export const registerProviderAccount = async (values: AccountFormData) => {
  return registerUser(values.fullName, values.email, values.password);
};

export const verifyProviderOtp = async (email: string, otp: string) => {
  return verifyAccount(email, otp);
};

export const uploadProviderImage = async (
  file: File,
  kind: "logo" | "cover",
): Promise<string> => {
  // TODO: Replace this endpoint with your real upload API endpoint.
  const endpoint = `${API_BASE_URL}/api/v1/uploads/${kind}`;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to upload ${kind} image.`),
    );
  }

  const payload = (await response.json()) as {
    data?: { url?: string };
    url?: string;
  };

  const imageUrl = payload.data?.url || payload.url;
  if (!imageUrl) {
    throw new Error(`Upload response for ${kind} image did not return a URL.`);
  }

  return imageUrl;
};

export const submitRestaurantInformation = async (
  ownerEmail: string,
  payload: RestaurantSubmitPayload,
) => {
  // TODO: Replace this endpoint with your real provider restaurant creation endpoint.
  const endpoint = `${API_BASE_URL}/api/v1/provider/restaurants`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerEmail,
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Failed to submit restaurant information.",
      ),
    );
  }

  return response.json();
};
