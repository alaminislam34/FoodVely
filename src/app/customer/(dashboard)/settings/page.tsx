'use client';

import { useState } from 'react';
import { TabbedLayout } from '@/components/customer/shared/TabbedLayout';
import { Lock, Bell, Eye, Trash2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    {
      id: 'security',
      label: 'Security',
      content: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </h3>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add an extra layer of security to your account
            </p>
            <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell size={20} />
            Notification Preferences
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Order Updates</p>
                <p className="text-sm text-gray-600">
                  Get notified about your order status
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Promotional Offers</p>
                <p className="text-sm text-gray-600">
                  Receive exclusive deals and coupons
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Restaurant Messages</p>
                <p className="text-sm text-gray-600">
                  Messages from your favorite restaurants
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">New Features</p>
                <p className="text-sm text-gray-600">Learn about new app features</p>
              </div>
            </label>
          </div>

          <button className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
            Save Preferences
          </button>
        </div>
      ),
    },
    {
      id: 'privacy',
      label: 'Privacy',
      content: (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Eye size={20} />
            Privacy Settings
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Show Order History</p>
                <p className="text-sm text-gray-600">Allow restaurants to see your past orders</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Share Analytics</p>
                <p className="text-sm text-gray-600">Help us improve with usage analytics</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Personalized Recommendations</p>
                <p className="text-sm text-gray-600">Receive tailored restaurant suggestions</p>
              </div>
            </label>
          </div>

          <button className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
            Save Settings
          </button>
        </div>
      ),
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      content: (
        <div className="bg-white rounded-lg border border-red-200 p-6 space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Careful!</p>
              <p className="text-sm text-red-800">
                These actions cannot be undone. Please proceed with caution.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Trash2 size={18} />
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be
              reversed.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete My Account
              </button>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-semibold text-red-900 mb-3">
                  Are you absolutely sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Yes, Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Deactivate Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              Temporarily deactivate your account. You can reactivate it anytime.
            </p>
            <button className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors">
              Deactivate Account
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <TabbedLayout tabs={tabs} defaultTab="security" />
    </div>
  );
}
