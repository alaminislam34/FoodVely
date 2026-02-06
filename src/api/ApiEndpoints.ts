const API_ENDPOINTS = {
  REGISTER_API: `/auth/register`,
  VERIFY_EMAIL: "/auth/verify-account",
  RESEND_VERIFICATION: "/auth/resend-verification",
  LOGIN_API: `/auth/login`,
  FORGET_API: `/auth/forget-password`,
  RESET_PASSWORD: `/auth/reset-password`,
  VERIFY_FORGET_OTP: `/auth/change-password`,
  VERIFY_OTP: `/auth/login-verify`,
  REFRESH_TOKEN: `/auth/refresh-token`,
  GET_PROFILE: `/users/me`,
  UPDATE_PROFILE: `/users`,
  GOOGLE_LOGIN: `/auth/google`,
  UPDATE_RESTAURANT: `/restaurants`,
};

export default API_ENDPOINTS;
