"use client";

import React from "react";

interface Props {
  brand?: string;
  last4?: string;
  onManage?: () => void;
}

export default function PaymentMethodCard({ brand = "Visa", last4 = "4421", onManage }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center text-slate-700 font-semibold">{brand[0]}</div>
          <div>
            <div className="text-sm font-semibold">{brand}</div>
            <div className="text-xs text-slate-500">•••• •••• •••• {last4}</div>
          </div>
        </div>
        <button onClick={onManage} className="text-xs text-rose-600 font-semibold">Manage</button>
      </div>
    </div>
  );
}
