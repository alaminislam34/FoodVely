"use client";

import {
  CreditCard,
  DollarSign,
  Download,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";

const stats = [
  {
    label: "Gross Revenue",
    value: "BDT 124,500",
    hint: "Last 30 days",
    icon: DollarSign,
    tone: "green" as const,
  },
  {
    label: "Net Revenue",
    value: "BDT 98,220",
    hint: "After platform fees",
    icon: Wallet,
    tone: "blue" as const,
  },
  {
    label: "Payment Success",
    value: "96.8%",
    hint: "All channels",
    icon: CreditCard,
    tone: "rose" as const,
  },
  {
    label: "Growth",
    value: "+12.4%",
    hint: "Compared to previous month",
    icon: TrendingUp,
    tone: "orange" as const,
  },
];

export default function ProviderFinancePage() {
  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen pb-10">
      <PageHeader
        title="Finance Overview"
        subtitle="Track revenue, payout health, and payment performance."
        actions={[
          {
            label: "Download Statement",
            href: "/provider/sales_reports",
            variant: "secondary",
            icon: Download,
          },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-2">
          Next Step
        </h2>
        <p className="text-sm text-gray-500 leading-6">
          Detailed settlement and transaction analytics are available in the
          sales report section. This page now exists so all dashboard links
          resolve correctly in Phase 1.
        </p>
      </div>
    </div>
  );
}
