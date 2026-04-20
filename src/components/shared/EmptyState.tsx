import React from "react";
import Link from "next/link";

type EmptyStateProps = {
  title?: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title = "No data found",
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-8 text-center">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
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
