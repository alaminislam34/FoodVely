"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 24,
      }}
      toastOptions={{
        duration: 3500,

        style: {
          background: "rgba(255,255,255,0.92)",
          color: "#0f172a",
          border: "1px solid rgba(226,232,240,0.9)",
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "14px",
          fontWeight: "500",
          backdropFilter: "blur(14px)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          maxWidth: "420px",
        },

        success: {
          style: {
            background: "rgba(240,253,244,0.95)",
            color: "#166534",
            border: "1px solid rgba(187,247,208,0.9)",
          },
          iconTheme: {
            primary: "#16a34a",
            secondary: "#f0fdf4",
          },
        },

        error: {
          style: {
            background: "rgba(254,242,242,0.96)",
            color: "#991b1b",
            border: "1px solid rgba(254,202,202,0.9)",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fef2f2",
          },
        },

        loading: {
          style: {
            background: "rgba(239,246,255,0.96)",
            color: "#1d4ed8",
            border: "1px solid rgba(191,219,254,0.9)",
          },
          iconTheme: {
            primary: "#2563eb",
            secondary: "#eff6ff",
          },
        },
      }}
    />
  );
}
