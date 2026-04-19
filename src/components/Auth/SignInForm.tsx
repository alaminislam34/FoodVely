"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { loginRequest, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateCredentials = () => {
    if (!credentials.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!credentials.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateCredentials()) return;

    const loadingToast = toast.loading("Signing you in...");

    try {
      await loginRequest(credentials.email, credentials.password);
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        error?.message || "Login failed. Please check your credentials.",
      );
      console.error("Login request failed:", err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-6 text-white">
            <div className="flex items-center justify-center mb-2">
              <LogIn className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-white/80 text-sm mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-error-100 border border-error-500 text-error-700 rounded-lg text-sm">
                {error.message}
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleCredentialsChange}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleCredentialsChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-text-tertiary hover:text-primary-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-brand disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 mt-6"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-text-secondary mt-4 text-sm">
              Don't have an account?{" "}
              <a
                href="/account/signup"
                className="text-primary-500 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="text-xs">
            <div className="text-primary-500 font-bold">✓</div>
            <p className="text-text-tertiary">Secure Login</p>
          </div>
          <div className="text-xs">
            <div className="text-primary-500 font-bold">✓</div>
            <p className="text-text-tertiary">2FA Protected</p>
          </div>
          <div className="text-xs">
            <div className="text-primary-500 font-bold">✓</div>
            <p className="text-text-tertiary">Fast Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
