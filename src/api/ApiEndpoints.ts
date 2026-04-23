const API_ENDPOINTS = {
  REGISTER_API: `/auth/signup/customer`,
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-otp",
  LOGIN_API: `/auth/login`,
  LOGOUT_API: `/auth/logout`,
  LOGOUT_ALL_SESSIONS: `/auth/logout-all`,
  VERIFY_OTP: `/auth/login-verify`,
  REFRESH_TOKEN: `/auth/refresh-token`,
  GET_CUSTOMER_PROFILE: `/users/profile/customer`,
  FORGOT_PASSWORD: `/auth/forgot-password`,
  VERIFY_PASSWORD_RESET_OTP: `/auth/verify-otp`,
  RESET_PASSWORD: `/auth/reset-password`,

};

export default API_ENDPOINTS;
