"use client";

import { useState } from "react";
import { TabbedLayout } from "@/components/customer/shared/TabbedLayout";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { AddressesTab } from "./components/AddressesTab";
import { PreferencesTab } from "./components/PreferencesTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      content: <PersonalInfoTab />,
    },
    {
      id: "addresses",
      label: "Addresses",
      content: <AddressesTab />,
    },
    {
      id: "preferences",
      label: "Preferences",
      content: <PreferencesTab />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <TabbedLayout tabs={tabs} defaultTab="personal" />
    </div>
  );
}
