"use client";

import { useMemo, useState } from "react";
import {
  useAdminOrders,
  useMyOrders,
  useRestaurantOrders,
} from "@/hooks/order.hooks";
import OrderStatusBadge from "./OrderStatusBadge";

type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";

type OrderRow = {
  id: string;
  orderNumber?: string;
  customerName?: string;
  restaurantName?: string;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
};

interface OrderTableProps {
  role: Role;
  pageSize?: number;
}

function normalizeOrders(payload: unknown): { items: OrderRow[]; totalPages?: number } {
  const data = (payload as { data?: unknown } | undefined)?.data ?? payload;
  if (Array.isArray(data)) {
    return { items: data as OrderRow[] };
  }
  const items =
    (data as { data?: OrderRow[] } | undefined)?.data ??
    (data as { items?: OrderRow[] } | undefined)?.items ??
    [];
  const totalPages = (data as { totalPages?: number } | undefined)?.totalPages;
  return { items, totalPages };
}

export default function OrderTable({ role, pageSize = 10 }: OrderTableProps) {
  const [page, setPage] = useState(1);

  const customerQuery = useMyOrders(role === "CUSTOMER" ? { page, limit: pageSize } : undefined);
  const providerQuery = useRestaurantOrders(
    role === "PROVIDER" ? { page, limit: pageSize } : undefined,
  );
  const adminQuery = useAdminOrders(role === "ADMIN" ? { page, limit: pageSize } : undefined);

  const query = role === "ADMIN" ? adminQuery : role === "PROVIDER" ? providerQuery : customerQuery;
  const { items, totalPages } = useMemo(() => normalizeOrders(query.data), [query.data]);

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : items.length === pageSize;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-Sofia font-bold text-gray-800">Orders</h3>
        <div className="text-sm text-gray-500">Page {page}</div>
      </div>

      {query.isLoading ? (
        <div className="p-6 text-center text-gray-500">Loading orders...</div>
      ) : query.isError ? (
        <div className="p-6 text-center text-red-500">Failed to load orders</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No orders found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Order</th>
                {role !== "CUSTOMER" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Customer
                  </th>
                )}
                {role === "ADMIN" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Restaurant
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {order.orderNumber || order.id}
                  </td>
                  {role !== "CUSTOMER" && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customerName || "-"}
                    </td>
                  )}
                  {role === "ADMIN" && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.restaurantName || "-"}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.totalAmount !== undefined ? `৳${order.totalAmount}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.status ? (
                      <OrderStatusBadge status={order.status as any} />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!canPrev}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!canNext}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
