import React from "react";
import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">Something went wrong</p>
          <p className="text-sm mt-1">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
