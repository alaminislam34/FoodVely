"use client";

import React from "react";

interface Props {
  title: string;
  description?: string;
  cta?: { label: string; href?: string; onClick?: () => void };
}

export default function EmptyState({ title, description, cta }: Props) {
  return (
    <div className="bg-white border border-dashed border-slate-100 rounded-lg p-8 text-center">
      <div className="text-3xl mb-3">✨</div>
      <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
      {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
      {cta && (
        <div className="mt-4">
          <button onClick={cta.onClick} className="px-4 py-2 bg-rose-600 text-white rounded-md">{cta.label}</button>
        </div>
      )}
    </div>
  );
}
