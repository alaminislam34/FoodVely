import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site";
import TanstackProvider from "@/providers/TanStackProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FoodVelly",
  description: "Food delivery platform",
  metadataBase: new URL(getSiteUrl()),
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
