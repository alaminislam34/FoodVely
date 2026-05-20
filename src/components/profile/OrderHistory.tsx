"use client";

import React from "react";
import OrderHistoryCard from "./OrderHistoryCard";

interface Order {
  id: string | number;
  date?: string;
  total?: number;
  items?: number;
  status?: string;
}

interface Props {
  orders: Order[];
}

export default function OrderHistory({ orders }: Props) {
  if (!orders || orders.length === 0) {
    return <div className="text-center text-slate-500">No past orders yet.</div>;
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <OrderHistoryCard key={o.id} {...o} />
      ))}
    </ul>
  );
}
