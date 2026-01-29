'use client';

import { useFetch } from '@/hooks/useFetch';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { Customer, CustomerPreferences } from '@/types/customer-types';
import { Bell, Mail, Globe, Moon } from 'lucide-react';

interface ProfileResponse {
  profile: Customer;
}

export function PreferencesTab() {
  const { data: profileData, loading } = useFetch<ProfileResponse>(
    '/data/customer/my-profile.json'
  );

  if (loading) return <LoadingState />;
  if (!profileData?.profile) return null;

  const prefs = profileData.profile.preferences;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Notifications */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={prefs.emailNotifications}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-700">Email Notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={prefs.pushNotifications}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-700">Push Notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={prefs.promotionalEmails}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-700">Promotional Emails</span>
          </label>
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Moon size={20} />
          Display Settings
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Theme</label>
            <select
              defaultValue={prefs.theme}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={20} />
          Localization
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Language</label>
            <select
              defaultValue={prefs.language}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Timezone</label>
            <select
              defaultValue={prefs.timezone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Currency</label>
            <select
              defaultValue={prefs.currency}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t border-gray-200 pt-6">
        <button className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
