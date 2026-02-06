"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Edit3 } from "lucide-react";
import CustomerProfileSkeleton from "./components/Skeleton";
import { useAuthContext } from "@/context/AuthContext";

// --- TYPES ---

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const displayName =
    (user?.name as string | undefined) ||
    (user?.username as string | undefined) ||
    (user?.email as string | undefined) ||
    "";
  const avatarUrl =
    (user?.avatar as string | undefined) ||
    (user?.image as string | undefined) ||
    (user?.photo as string | undefined) ||
    "";
  const location = (user?.location as string | undefined) || "";
  const username = (user?.username as string | undefined) || "";
  const email = (user?.email as string | undefined) || "";
  const role = (user?.role as string | undefined) || "";
  const phone = (user?.phone as string | undefined) || "";
  const status = (user?.status as string | undefined) || "";
  const createdAt = (user?.createdAt as string | undefined) || "";
  const updatedAt = (user?.updatedAt as string | undefined) || "";
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <CustomerProfileSkeleton />;
  }
  return (
    <div className="min-h-screen">
      {/* --- TOP COVER & PROFILE HEADER --- */}
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-10">
          <div className="flex flex-col md:flex-row items-center gap-6 z-10 translate-y-16">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-40 h-40 rounded-[3rem] border-8 border-white bg-white shadow-xl object-cover"
                  alt={displayName || "User"}
                />
              ) : (
                <div className="w-40 h-40 rounded-[3rem] border-8 border-white bg-white shadow-xl flex items-center justify-center text-2xl font-bold text-rose-500">
                  {displayName ? displayName[0]?.toUpperCase() : ""}
                </div>
              )}
              <button className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                <Edit3 size={18} />
              </button>
            </div>
            <div className="text-center md:text-left md:pb-4">
              {displayName && (
                <h1 className="text-4xl font-black text-slate-800">
                  {displayName}
                </h1>
              )}
              {location && (
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={16} className="text-rose-500" /> {location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto px-6 mt-24">
        <div className="bg-white border border-rose-50 rounded-4xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-black text-rose-600 mb-6">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Name
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {displayName || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Username
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {username || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Email
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {email || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Role
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {role || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Phone
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {phone || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Status
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {status || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Created At
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {createdAt || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Updated At
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {updatedAt || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
