"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AccountNav from "../components/AccountNav";
import AccountFallbackNotice from "../components/AccountFallbackNotice";
import toast from "react-hot-toast";
import { accountApi } from "@/api/accountApi";
import { useAuth } from "@/module/hooks/useAuth";

type PaymentMethod = {
  id: string;
  label: string;
  brand: string;
  last4: string;
  expiry: string;
};

const STORAGE_KEY = "foodvaly.account.payments";

export default function AccountPaymentMethodsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [label, setLabel] = useState("Personal");
  const [brand, setBrand] = useState("VISA");
  const [last4, setLast4] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `/account/signin?next=${encodeURIComponent("/account/payment-methods")}`,
      );
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        const list = await accountApi.listPaymentMethods();

        if (list.length > 0) {
          setFallbackNotice("");
          setMethods(
            list.map((item, index) => ({
              id: String(item.id ?? `method-${index + 1}`),
              label: item.label,
              brand: item.brand,
              last4: item.last4,
              expiry: item.expiry,
            })),
          );
          return;
        }
      } catch {
        // Fallback to local cache if API is unavailable.
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as PaymentMethod[];
        const localMethods = Array.isArray(parsed) ? parsed : [];
        setMethods(localMethods);
        if (localMethods.length > 0) {
          setFallbackNotice(
            "Showing saved payment methods while account sync is unavailable.",
          );
        }
      } catch {
        setMethods([]);
      }
    };

    loadMethods();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
  }, [methods]);

  const canAdd = useMemo(
    () => /^\d{4}$/.test(last4) && expiry.trim(),
    [last4, expiry],
  );

  const addMethod = async () => {
    if (!canAdd) return;

    const payload = {
      id: `${Date.now()}`,
      label: label.trim() || "Personal",
      brand: brand.trim() || "CARD",
      last4: last4.trim(),
      expiry: expiry.trim(),
    };

    setIsSaving(true);

    try {
      const created = await accountApi.createPaymentMethod(payload);
      setMethods((prev) => [
        {
          id: String(created.id ?? payload.id),
          label: created.label,
          brand: created.brand,
          last4: created.last4,
          expiry: created.expiry,
        },
        ...prev,
      ]);
      toast.success("Payment method added");
    } catch {
      setMethods((prev) => [payload, ...prev]);
      toast("Saved locally (API unavailable)", { icon: "⚠️" });
    }

    setLast4("");
    setExpiry("");
    setIsSaving(false);
  };

  const removeMethod = async (id: string) => {
    const previous = methods;
    setDeletingId(id);
    setMethods((prev) => prev.filter((item) => item.id !== id));

    try {
      await accountApi.deletePaymentMethod(id);
      toast.success("Payment method removed");
    } catch {
      setMethods(previous);
      toast.error("Could not remove payment method");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Payment Methods</h1>
        <p className="text-slate-500">Add or remove saved payment options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <AccountNav />
        </div>

        <div className="lg:col-span-9 space-y-4">
          {fallbackNotice ? (
            <AccountFallbackNotice message={fallbackNotice} />
          ) : null}

          <div className="bg-white border border-rose-100 rounded-3xl p-5 md:p-6 space-y-3">
            <h2 className="font-bold text-slate-800">Add Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Label"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
              <input
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="Brand"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
              <input
                value={last4}
                onChange={(event) =>
                  setLast4(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="Last 4 digits"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
              <input
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
                placeholder="MM/YY"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <button
              onClick={addMethod}
              disabled={!canAdd || isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              <Plus size={16} /> {isSaving ? "Adding..." : "Add Method"}
            </button>
          </div>

          <div className="bg-white border border-rose-100 rounded-3xl p-5 md:p-6 space-y-3">
            <h2 className="font-bold text-slate-800">Saved Methods</h2>
            {methods.length === 0 ? (
              <p className="text-sm text-slate-500">
                No payment method saved yet.
              </p>
            ) : (
              methods.map((method) => (
                <div
                  key={method.id}
                  className="rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{method.label}</p>
                      <p className="text-sm text-slate-600">
                        {method.brand} •••• {method.last4} • Exp {method.expiry}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMethod(method.id)}
                    disabled={deletingId === method.id}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
