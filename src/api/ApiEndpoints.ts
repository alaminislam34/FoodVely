const API_ENDPOINTS = {
  REGISTER_API: `/auth/signup`,
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
  GET_ME: `/auth/me`,
  CREATE_RESTAURANT: `/restaurants`,
  GET_RESTAURANT: (slug: string) => `/restaurants/${slug}`,

  FOOD: {
    CREATE: `/foods`,
    GET_ALL: `/foods`,
    GET_BY_ID: (id: string) => `/foods/${id}`,
    UPDATE: (id: string) => `/foods/${id}`,
    DELETE: (id: string) => `/foods/${id}`,
  },
  CATEGORY: {
    GET_ALL_FOR_PUBLIC: `/food-categories/public`,
    GET_ALL_FOR_ADMIN: `/food-categories`,
    CREATE: `/food-categories`,
    GET_BY_ID: (id: string) => `/food-categories/${id}`,
    UPDATE: (id: string) => `/food-categories/${id}`,
    DELETE: (id: string) => `/food-categories/${id}`,
    ACTIVATE: (id: string) => `/food-categories/${id}/activate`,
    DEACTIVATE: (id: string) => `/food-categories/${id}/deactivate`,
  },

  ADMIN: {
    SIGN_IN: `/auth/admin/login`,
    PLATFORM_STATS: `/admin/platform-stats`,
    GET_ACTIVITY_LOGS: `/admin/activity-logs`,
    GET_USERS: `/admin/users`,
  },
  PROVIDER: {
    DASHBOARD_STATS: `/provider/platform-stats`,
    RESTAURANT: `/restaurants/profile`,
  },
};

export default API_ENDPOINTS;
