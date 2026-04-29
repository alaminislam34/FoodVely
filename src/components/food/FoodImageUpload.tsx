"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import React from "react";

interface FoodImageUploadProps {
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FoodImageUpload({
  imagePreview,
  fileInputRef,
  handleImageChange,
}: FoodImageUploadProps) {
  return (
    <section className="bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative h-64 md:h-96 w-full rounded-[2rem] border-2 border-dashed border-gray-100 hover:border-rose-300 hover:bg-rose-50/20 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} className="text-rose-500" />
            </div>
            <p className="text-xl font-bold text-gray-800 tracking-tight">
              Drop your food photo here
            </p>
            <p className="text-sm text-gray-400 mt-2 font-medium">
              Recommended: 1080x1080px (Max 5MB)
            </p>
          </div>
        )}
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
    </section>
  );
}
