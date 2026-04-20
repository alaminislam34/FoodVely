import React from "react";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "rose" | "green" | "blue" | "orange" | "gray";
};

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  rose: "text-rose-600 bg-rose-50",
  green: "text-green-600 bg-green-50",
  blue: "text-blue-600 bg-blue-50",
  orange: "text-orange-600 bg-orange-50",
  gray: "text-gray-600 bg-gray-50",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "gray",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-bold font-Sofia text-gray-800 mt-1">
            {value}
          </p>
          {hint ? <p className="text-xs text-gray-400 mt-1">{hint}</p> : null}
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneMap[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
