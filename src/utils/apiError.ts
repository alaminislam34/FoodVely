import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      (error.response?.data as { error?: { message?: string } } | undefined)?.error?.message;

    return responseMessage || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
