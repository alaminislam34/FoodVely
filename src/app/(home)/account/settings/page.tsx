"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AccountNav from "../components/AccountNav";
import AccountFallbackNotice from "../components/AccountFallbackNotice";
import { accountApi } from "@/api/accountApi";
import { useAuth } from "@/hooks/hooks/useAuth";

const STORAGE_KEY = "foodvaly.account.settings";

type AccountSettings = {
  name: string;
  phone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
};

export default function AccountSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [settings, setSettings] = useState<AccountSettings>({
    name: "",
    phone: "",
    emailNotifications: true,
    smsNotifications: false,
  });
  const [saving, setSaving] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `/account/signin?next=${encodeURIComponent("/account/settings")}`,
      );
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await accountApi.getSettings();
        setFallbackNotice("");
        setSettings({
          name: result.name || user?.name || "",
          phone: result.phone || "",
          emailNotifications: Boolean(result.emailNotifications),
          smsNotifications: Boolean(result.smsNotifications),
        });
        return;
      } catch {
        // Fallback to local settings cache.
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setSettings((prev) => ({ ...prev, name: user?.name || "" }));
        return;
      }

      try {
        const parsed = JSON.parse(raw) as AccountSettings;
        setFallbackNotice(
          "Showing saved account settings while sync is unavailable.",
        );
        setSettings({
          name: parsed.name || user?.name || "",
          phone: parsed.phone || "",
          emailNotifications: Boolean(parsed.emailNotifications),
          smsNotifications: Boolean(parsed.smsNotifications),
        });
      } catch {
        setSettings((prev) => ({ ...prev, name: user?.name || "" }));
      }
    };

    loadSettings();
  }, [user?.name]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await accountApi.updateSettings(settings);
      toast.success("Settings saved");
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast("Saved locally (API unavailable)", { icon: "⚠️" });
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
        <p className="text-slate-500">
          Control your profile and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <AccountNav />
        </div>

        <div className="lg:col-span-9 bg-white border border-rose-100 rounded-3xl p-5 md:p-6 space-y-4">
          {fallbackNotice ? (
            <AccountFallbackNotice message={fallbackNotice} />
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Name
              </label>
              <input
                value={settings.name}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, name: event.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Phone
              </label>
              <input
                value={settings.phone}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotifications: event.target.checked,
                  }))
                }
              />
              Email notifications
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    smsNotifications: event.target.checked,
                  }))
                }
              />
              SMS notifications
            </label>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
