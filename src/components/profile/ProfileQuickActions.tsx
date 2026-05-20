"use client";

import React from "react";

interface Action {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  actions: Action[];
}

export default function ProfileQuickActions({ actions }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-3">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button key={a.id} onClick={a.onClick} className="py-2 px-3 rounded-md bg-slate-50 text-sm font-medium hover:bg-slate-100">
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
