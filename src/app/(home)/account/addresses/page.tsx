"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AccountNav from "../components/AccountNav";
import AccountFallbackNotice from "../components/AccountFallbackNotice";
import toast from "react-hot-toast";
import { accountApi } from "@/api/accountApi";
import { useAuth } from "@/module/hooks/useAuth";

type AddressItem = {
  id: string;
  label: string;
  line: string;
  city: string;
  phone: string;
};

const STORAGE_KEY = "foodvaly.account.addresses";

export default function AccountAddressesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [label, setLabel] = useState("Home");
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `/account/signin?next=${encodeURIComponent("/account/addresses")}`,
      );
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const list = await accountApi.listAddresses();

        if (list.length > 0) {
          setFallbackNotice("");
          setAddresses(
            list.map((item, index) => ({
              id: String(item.id ?? `address-${index + 1}`),
              label: item.label,
              line: item.line,
              city: item.city,
              phone: item.phone,
            })),
          );
          return;
        }
      } catch {
        // Fallback to local storage when API is unavailable.
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as AddressItem[];
        const localAddresses = Array.isArray(parsed) ? parsed : [];
        setAddresses(localAddresses);
        if (localAddresses.length > 0) {
          setFallbackNotice(
            "Showing saved addresses while account sync is unavailable.",
          );
        }
      } catch {
        setAddresses([]);
      }
    };

    loadAddresses();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const canAdd = useMemo(
    () => line.trim() && city.trim() && phone.trim(),
    [line, city, phone],
  );

  const addAddress = async () => {
    if (!canAdd) return;

    const payload = {
      id: `${Date.now()}`,
      label: label.trim() || "Home",
      line: line.trim(),
      city: city.trim(),
      phone: phone.trim(),
    };

    setIsSaving(true);

    try {
      const created = await accountApi.createAddress(payload);
      setAddresses((prev) => [
        {
          id: String(created.id ?? payload.id),
          label: created.label,
          line: created.line,
          city: created.city,
          phone: created.phone,
        },
        ...prev,
      ]);
      toast.success("Address added");
    } catch {
      setAddresses((prev) => [payload, ...prev]);
      toast("Saved locally (API unavailable)", { icon: "⚠️" });
    }

    setLabel("Home");
    setLine("");
    setCity("");
    setPhone("");
    setIsSaving(false);
  };

  const removeAddress = async (id: string) => {
    const previous = addresses;
    setDeletingId(id);
    setAddresses((prev) => prev.filter((item) => item.id !== id));

    try {
      await accountApi.deleteAddress(id);
      toast.success("Address removed");
    } catch {
      setAddresses(previous);
      toast.error("Could not remove address");
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
        <h1 className="text-3xl font-black text-slate-900">Saved Addresses</h1>
        <p className="text-slate-500">Manage your delivery addresses.</p>
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
            <h2 className="font-bold text-slate-800">Add New Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Label (Home/Office)"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
              <input
                value={line}
                onChange={(event) => setLine(event.target.value)}
                placeholder="Address line"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100 md:col-span-2"
              />
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <button
              onClick={addAddress}
              disabled={!canAdd || isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              <Plus size={16} /> {isSaving ? "Adding..." : "Add Address"}
            </button>
          </div>

          <div className="bg-white border border-rose-100 rounded-3xl p-5 md:p-6 space-y-3">
            <h2 className="font-bold text-slate-800">Your Addresses</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-slate-500">No address saved yet.</p>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-slate-100 p-4 flex justify-between gap-3"
                >
                  <div>
                    <p className="font-bold text-slate-800">{address.label}</p>
                    <p className="text-sm text-slate-600">{address.line}</p>
                    <p className="text-xs text-slate-500">
                      {address.city} • {address.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAddress(address.id)}
                    disabled={deletingId === address.id}
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
