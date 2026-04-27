"use client";

import {
  Clock,
  Gauge,
  PackageCheck,
  TimerReset,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";

const metrics = [
  {
    label: "Avg Prep Time",
    value: "18 min",
    hint: "Target under 20 min",
    icon: Clock,
    tone: "blue" as const,
  },
  {
    label: "On-time Delivery",
    value: "93.6%",
    hint: "Last 7 days",
    icon: PackageCheck,
    tone: "green" as const,
  },
  {
    label: "Delay Incidents",
    value: "9",
    hint: "Needs operational review",
    icon: TimerReset,
    tone: "orange" as const,
  },
  {
    label: "Service Score",
    value: "4.7 / 5",
    hint: "Based on order completion speed",
    icon: Gauge,
    tone: "rose" as const,
  },
];

export default function ProviderPerformancePage() {
  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen pb-10">
      <PageHeader
        title="Performance"
        subtitle="Monitor prep speed, fulfillment reliability, and service quality."
        actions={[
          {
            label: "Open Order Reports",
            href: "/provider/order_reports",
            icon: TrendingUp,
            variant: "secondary",
          },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Operational Insight
        </h2>
        <p className="text-sm text-gray-500 leading-6">
          Use the order reports section to identify peak-hour delays and
          optimize kitchen staffing. This page now acts as the dedicated
          performance route referenced by the dashboard.
        </p>
      </div>
    </div>
  );
}
