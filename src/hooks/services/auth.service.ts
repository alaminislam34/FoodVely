import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface IEmailVerifyPayload {
  email: string;
  otp: string;
  [key: string]: unknown;
}

export interface ILoginPayload {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface IResetPasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
  [key: string]: unknown;
}

export interface IUserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isDeleted: boolean;
  emailVerified: boolean;
  deletedAt: string | null;
  image: string | null;
  needPasswordReset: boolean;
  createdAt: string;
  updatedAt: string;
  restaurant: unknown | null;
  reviews: unknown[];
  orders: unknown[];
}

export interface APIResponse<T, M> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  meta?: M;
}

const Register = async (
  payload: IRegisterPayload,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.REGISTER_API, payload);
  return res;
};

const VerifyEmail = async (
  payload: IEmailVerifyPayload,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.VERIFY_EMAIL, payload);
  return res;
};

const loginUser = async (
  payload: ILoginPayload,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.LOGIN_API, payload);
  return res;
};

const ForgotPassword = async (
  email: string,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  return res;
};

const ResendOtp = async (
  email: string,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.RESEND_VERIFICATION, {
    email,
  });
  return res;
};

const ResetPassword = async (
  payload: IResetPasswordPayload,
): Promise<APIResponse<unknown, unknown>> => {
  const res = await httpClient.post(API_ENDPOINTS.RESET_PASSWORD, payload);

  return res;
};

const logoutUser = async (): Promise<void> => {
  await httpClient.post(API_ENDPOINTS.LOGOUT_API);
};

const getMe = async (): Promise<IUserProfileData> => {
  const res = await httpClient.get<IUserProfileData>(API_ENDPOINTS.GET_ME);
  return res.data;
};

export const AuthServices = {
  register: Register,
  verifyEmail: VerifyEmail,
  loginUser: loginUser,
  forgotPassword: ForgotPassword,
  resetPassword: ResetPassword,
  logoutUser: logoutUser,
  getMe: getMe,
  resendOtp: ResendOtp,
};
