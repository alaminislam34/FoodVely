"use client";

import React from "react";
import CartSummaryCard from "./CartSummaryCard";
import PaymentMethodCard from "./PaymentMethodCard";
import ProfileQuickActions from "./ProfileQuickActions";

interface Props {
  cartItems?: any[];
  payment?: { brand?: string; last4?: string };
  actions?: { id: string; label: string; onClick?: () => void }[];
}

export default function ProfileSidebar({ cartItems = [], payment, actions = [] }: Props) {
  return (
    <aside className="space-y-4">
      <CartSummaryCard items={cartItems} />
      <PaymentMethodCard brand={payment?.brand} last4={payment?.last4} />
      <ProfileQuickActions actions={actions} />
    </aside>
  );
}
