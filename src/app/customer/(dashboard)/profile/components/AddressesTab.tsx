'use client';

import { useFetch } from '@/hooks/useFetch';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { Address } from '@/types/customer-types';
import { MapPin, Edit2, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface AddressResponse {
  addresses: Address[];
}

export function AddressesTab() {
  const { data: addressData, loading } = useFetch<AddressResponse>(
    '/data/customer/my-addresses.json'
  );
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) return <LoadingState />;
  if (!addressData?.addresses) return <EmptyState type="addresses" />;

  const addresses = addressData.addresses;

  return (
    <div className="space-y-4">
      {/* Add Address Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Street address"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="City"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="State"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Zip code"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
            <input
              type="text"
              placeholder="Label (optional)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Save Address
            </button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white rounded-lg border-2 p-4 transition-colors ${
              address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {address.label || address.type}
                  </h3>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      <CheckCircle2 size={12} />
                      Default
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                    <span>
                      {address.street}, {address.city}, {address.state} {address.zipCode}
                    </span>
                  </p>
                  {address.landmark && (
                    <p className="text-xs text-gray-500">Landmark: {address.landmark}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
