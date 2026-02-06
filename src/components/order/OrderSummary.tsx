"use client";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export default function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-Sofia font-bold text-gray-800 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="text-gray-700">
              <span className="font-semibold">{item.quantity}x</span> {item.name}
            </div>
            <span className="font-semibold text-gray-800">৳{item.price}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 mt-5 pt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>৳{deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between text-gray-900 font-bold text-base">
          <span>Total</span>
          <span>৳{total}</span>
        </div>
      </div>
    </div>
  );
}
