import axios from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      (error.response?.data as { error?: { message?: string } } | undefined)
        ?.error?.message;

    return responseMessage || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, any>;

    // Sometimes backend puts the real error message in error.stack or error.message
    if (
      errObj.error?.stack &&
      typeof errObj.error.stack === "string" &&
      !errObj.error.stack.includes("at ")
    ) {
      return errObj.error.stack;
    }
    if (errObj.error?.message && typeof errObj.error.message === "string") {
      return errObj.error.message;
    }
    if (errObj.message && typeof errObj.message === "string") {
      return errObj.message;
    }
  }

  return fallback;
};
