import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import TanstackProvider from "@/providers/TanStackProvider";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <TanstackProvider>
          <ToastProvider />
          {children}
        </TanstackProvider>
      </body>
    </html>
  );
}
