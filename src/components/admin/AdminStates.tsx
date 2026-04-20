import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import Link from "next/link";

type EmptyProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

type ErrorProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AdminLoadingState({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 flex items-center justify-center gap-3 text-gray-600">
      <Loader2 size={20} className="animate-spin text-rose-500" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

export function AdminEmptyState({
  title = "No records found",
  description = "There is no data to display right now.",
  actionLabel,
  actionHref,
}: EmptyProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <Inbox size={36} className="mx-auto text-gray-300 mb-3" />
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex mt-5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function AdminProductsEmptyState() {
  return (
    <AdminEmptyState
      title="No products found"
      description="Try adjusting search and filters."
      actionLabel="Open Product List"
      actionHref="/admin/products"
    />
  );
}

export function AdminReportsEmptyState() {
  return (
    <AdminEmptyState
      title="No reports found"
      description="No report matches the current search or status filter."
      actionLabel="Open Reports"
      actionHref="/admin/reports"
    />
  );
}

export function AdminErrorState({
  title = "Failed to load data",
  description = "Please try again.",
  actionLabel = "Retry",
  onAction,
}: ErrorProps) {
  return (
    <div className="bg-red-50 rounded-2xl border border-red-200 p-10 text-center">
      <AlertCircle size={36} className="mx-auto text-red-400 mb-3" />
      <p className="font-semibold text-red-700">{title}</p>
      <p className="text-sm text-red-600 mt-1">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
