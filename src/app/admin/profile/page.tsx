"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Camera, Save, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@foodvely.com",
    phone: "+1-555-0123",
    role: "Super Admin",
    department: "Management",
    joinDate: "2023-01-15",
    bio: "Platform administrator managing all operations and users.",
  });

  const [formData, setFormData] = useState(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(formData);
    setSaveSuccess(true);
    setIsSaving(false);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">Manage your admin account information</p>
      </motion.div>

      {/* Profile Picture Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
      >
        <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-6">
          Profile Picture
        </h2>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-linear-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white">
              <span className="text-5xl font-Sofia font-bold">A</span>
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md">
              <Camera size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Upload Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Upload new profile picture
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              JPG or PNG, max 5MB. Recommended size: 400x400px
            </p>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Choose File
            </button>
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
      >
        <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-6">
          Personal Information
        </h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg font-semibold"
              >
                <CheckCircle size={18} />
                Changes saved successfully!
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
      >
        <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-6">
          Account Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-semibold text-gray-800">{profile.role}</p>
            </div>
            <span className="text-2xl">👑</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold text-gray-800">{profile.department}</p>
            </div>
            <span className="text-2xl">🏢</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(profile.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
      >
        <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lock size={20} />
          Security Settings
        </h2>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Change Password
              </h3>
              <p className="text-sm text-gray-600">
                Update your password regularly for security
              </p>
            </div>
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Change
            </button>
          </div>

          {/* Two Factor Auth */}
          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                Two-Factor Authentication
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  Enabled
                </span>
              </h3>
              <p className="text-sm text-gray-600">
                Extra security layer for your account
              </p>
            </div>
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Manage
            </button>
          </div>

          {/* Active Sessions */}
          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Active Sessions
              </h3>
              <p className="text-sm text-gray-600">
                See all devices currently logged in
              </p>
            </div>
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              View
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-red-50 rounded-2xl border border-red-200 p-6 md:p-8"
      >
        <h2 className="text-xl font-Sofia font-bold text-red-700 mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          Danger Zone
        </h2>

        <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
          Delete Account
        </button>
        <p className="text-sm text-red-600 mt-3">
          This action cannot be undone. Your account and all associated data
          will be permanently deleted.
        </p>
      </motion.div>
    </div>
  );
}
