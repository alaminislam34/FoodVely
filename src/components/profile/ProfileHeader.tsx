"use client";

import React from "react";
import ProfileAvatar from "./ProfileAvatar";
import SectionHeader from "./SectionHeader";
import { motion } from "motion/react";

interface StatsItem {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  email?: string;
  location?: string;
  avatarSrc?: string;
  stats?: StatsItem[];
  onEdit?: () => void;
}

export default function ProfileHeader({
  name,
  email,
  location,
  avatarSrc,
  stats = [],
  onEdit,
}: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <ProfileAvatar src={avatarSrc} name={name} size={88} editable onEdit={onEdit} />
        <div className="flex-1 text-center md:text-left">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-slate-900">
            {name}
          </motion.h1>
          <p className="text-sm text-slate-500">{email}</p>
          {location && <p className="text-sm text-slate-500 mt-1">{location}</p>}
        </div>
        <div className="w-full md:w-auto">
          <SectionHeader title="Account" subtitle={undefined} />
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-50 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="text-base font-semibold text-slate-800">{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
