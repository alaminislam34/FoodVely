'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

export function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const { googleLogin, clearError } = useAuthContext();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleGoogleResponse = useCallback(
    async (response: { credential?: string }) => {
      clearError();

      if (!response.credential) {
        return;
      }

      await googleLogin(response.credential);
      onSuccess?.();
    },
    [clearError, googleLogin, onSuccess],
  );

  useEffect(() => {
    let cancelled = false;

    const renderButton = () => {
      if (cancelled || !window.google || !buttonRef.current) {
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'left',
        width: '100%',
      });

      setIsScriptLoaded(true);
    };

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google) {
        renderButton();
      } else {
        existingScript.addEventListener('load', renderButton, { once: true });
      }
      return () => {
        cancelled = true;
        existingScript.removeEventListener('load', renderButton);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.remove();
    };
  }, [handleGoogleResponse]);


  return (
    <div className="space-y-3">
      <div
        ref={buttonRef}
        className="flex justify-center min-h-11"
      />

      {!isScriptLoaded && (
        <button
          type="button"
          disabled
          className="w-full py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-500 font-semibold cursor-not-allowed"
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
