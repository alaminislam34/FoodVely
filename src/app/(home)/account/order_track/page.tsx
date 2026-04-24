"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/hooks/useAuth";

export default function OrderTrackRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const orderId = searchParams.get("order");

    if (!isLoading && !isAuthenticated) {
      const next = orderId
        ? `/account/order_track?order=${encodeURIComponent(orderId)}`
        : "/account/orders";
      router.replace(`/account/signin?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!isLoading && isAuthenticated) {
      if (orderId) {
        router.replace(`/account/orders/${encodeURIComponent(orderId)}`);
      } else {
        router.replace("/account/orders");
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
    </div>
  );
}
