import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "FoodVelly",
  description: "Food delivery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
