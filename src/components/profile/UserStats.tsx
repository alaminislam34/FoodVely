"use client";

import React from "react";

interface Stat {
  label: string;
  value: string | number;
}

interface Props {
  stats: Stat[];
}

export default function UserStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-slate-100 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">{s.label}</div>
          <div className="text-lg font-semibold text-slate-800">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
