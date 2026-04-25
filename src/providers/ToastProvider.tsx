"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#1c1917",
          borderRadius: "0.5rem",
          boxShadow: "0 20px 35px rgba(0, 0, 0, 0.25)",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "6px",
          paddingBottom: "6px",
        },
        success: {
          style: {
            background: "#f0fdf4",
            color: "#15803d",
            border: "1px solid #bbf7d0",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#f0fdf4",
          },
        },
        error: {
          style: {
            background: "#b91c1c",
            color: "#fef2f2",
            border: "1px solid #fecaca",
          },
          iconTheme: {
            primary: "#fef2f2",
            secondary: "#ef4444",
          },
        },
        loading: {
          style: {
            background: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
          },
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#eff6ff",
          },
        },
      }}
    />
  );
}
