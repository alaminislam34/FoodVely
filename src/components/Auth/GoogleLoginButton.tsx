'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

export function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const { googleLogin, isLoading, error, clearError } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    clearError();
    try {
      if (response.credential) {
        await googleLogin(response.credential);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-error-100 border border-error-500 text-error-700 rounded">
          {error.message}
        </div>
      )}

      {isScriptLoaded && (
        <div
          id="google-signin-button"
          className="flex justify-center"
        />
      )}

      {!isScriptLoaded && (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed"
        >
          Loading Google Sign-In...
        </button>
      )}
    </div>
  );
}

// Extend window object type for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}
