"use client"; // <--- এই লাইনটি যোগ করা বাধ্যতামূলক

import { EmptyState } from "@/components/shared/EmptyState";

type ProviderReportsEmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function ProviderOrdersEmptyState() {
  return (
    <EmptyState
      title="No orders found"
      description="Try changing filters or check again after a few minutes."
      actionLabel="View All Orders"
      actionHref="/dashboard/provider/orders"
    />
  );
}

export function ProviderProductsEmptyState() {
  return (
    <EmptyState
      title="No products found"
      description="Try changing your filters or add a new product to your menu."
      actionLabel="Add Product"
      actionHref="/dashboard/provider/addFood"
    />
  );
}

export function ProviderReportsEmptyState({
  title = "No report rows available",
  description = "Try changing status filter or refresh the report data.",
  actionLabel = "Open Reports",
  actionHref = "/dashboard/provider/order_reports",
}: ProviderReportsEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={actionLabel}
      actionHref={actionHref}
    />
  );
}
