'use client';

import { useFetch } from '@/hooks/useFetch';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { Customer } from '@/types/customer-types';
import { Mail, Phone, Edit2 } from 'lucide-react';
import Image from 'next/image';

export function PersonalInfoTab() {
  const { data: profileData, loading } = useFetch<{ profile: Customer }>(
    '/data/customer/my-profile.json'
  );

  if (loading) return <LoadingState />;
  if (!profileData?.profile) return <EmptyState type="generic" />;

  const profile = profileData.profile;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Avatar & Name */}
      <div className="flex items-end gap-6">
        <div className="relative w-24 h-24">
          <Image
            src={profile.avatar || '/images/placeholder.jpg'}
            alt={profile.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-gray-600">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          <button className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Email Address</p>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-gray-400" />
            <p className="font-medium text-gray-900">{profile.email}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Phone Number</p>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-gray-400" />
            <p className="font-medium text-gray-900">{profile.phone}</p>
          </div>
        </div>
      </div>

      {/* Edit Form (Placeholder) */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
        <form className="space-y-4 max-w-md">
          <input
            type="password"
            placeholder="Current password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
