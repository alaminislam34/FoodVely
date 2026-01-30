'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserCheck, Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [otp, setOtp] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');

  const roles = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'PROVIDER', label: 'Restaurant Provider' },
  ];

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    const loadingToast = toast.loading('Creating your account...');

    try {
      await register(formData.name, formData.email, formData.password);
      setVerifyEmail(formData.email);
      setStep('verify');
      toast.dismiss(loadingToast);
      toast.success('Account created! Check your email for OTP');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(error?.message || 'Registration failed. Please try again.');
      console.error('Registration failed:', err);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    const loadingToast = toast.loading('Verifying your account...');

    try {
      const { verifyAccount } = await import('@/services/authService');
      await verifyAccount(verifyEmail, otp);
      toast.dismiss(loadingToast);
      toast.success('Account verified successfully!');
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(error?.message || 'Verification failed. Please try again.');
      console.error('Verification failed:', err);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-primary p-6 text-white">
              <div className="flex items-center justify-center mb-2">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-center">Verify Account</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-text-secondary text-center mb-6">
                We sent a 6-digit code to <strong>{verifyEmail}</strong>
              </p>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-center text-lg tracking-widest font-semibold transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !otp}
                  className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-brand disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
                >
                  {isLoading ? 'Verifying...' : 'Verify Account'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="w-full text-primary-500 font-semibold py-2 hover:underline"
                >
                  Back to Registration
                </button>
              </form>

              <p className="text-text-tertiary text-sm text-center mt-4">
                Didn't receive the code? Check your spam folder.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-6 text-white">
            <div className="flex items-center justify-center mb-2">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
            <p className="text-center text-white/80 text-sm mt-2">Join FoodVely today</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-error-100 border border-error-500 text-error-700 rounded-lg text-sm">
                {error.message}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleRegisterChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                    required
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleRegisterChange}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition bg-white text-text-primary"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-border-primary rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-text-tertiary hover:text-primary-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-text-tertiary mt-1">
                  Minimum 8 characters required
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-brand disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-text-secondary mt-4 text-sm">
              Already have an account?{' '}
              <a href="/account/signin" className="text-primary-500 font-semibold hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="text-xs">
            <div className="text-primary-500 font-bold">✓</div>
            <p className="text-text-tertiary">Secure</p>
          </div>
          <div className="text-xs">
            <div className="text-primary-500 font-bold">✓</div>
            <p className="text-text-tertiary">Fast</p>
          </div>
          <div className="text-xs">
            <div className="text-primary-500 font-bold">✓</div>
            <p className="text-text-tertiary">Easy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
