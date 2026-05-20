"use client";

import React from "react";
import { motion } from "motion/react";

interface Props {
  src?: string;
  name?: string;
  size?: number;
  editable?: boolean;
  onEdit?: () => void;
}

export default function ProfileAvatar({
  src,
  name,
  size = 88,
  editable = false,
  onEdit,
}: Props) {
  const initials = (name || "").split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="relative inline-block">
      <motion.div
        initial={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        className="rounded-xl overflow-hidden bg-white"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-700 font-bold">
            {initials || "U"}
          </div>
        )}
      </motion.div>

      {editable && (
        <button
          aria-label="Edit profile"
          onClick={onEdit}
          className="absolute -right-2 -bottom-2 bg-rose-600 text-white p-2 rounded-md shadow-sm focus:outline-none"
        >
          ✎
        </button>
      )}
    </div>
  );
}
