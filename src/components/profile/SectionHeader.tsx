"use client";

import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  className = "",
}: Props) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        {icon && <div className="p-2 bg-slate-50 rounded-lg text-slate-700">{icon}</div>}
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
