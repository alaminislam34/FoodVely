"use client";

import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import { Component } from "react";

export class Products extends Component {
  render() {
    return (
      <div className="flex flex-wrap gap-4 items-center py-8">
        {[1, 2, 3, 4].map((key) => (
          <div
            key={key}
            className="group flex flex-col bg-linear-to-br from-transparent via-white/40 to-white backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),inset_0_-4px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_-15px_rgba(244,63,94,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)] transition-all duration-500 border border-gray-50 hover:-translate-y-2 max-h-80 max-w-50"
          >
            {/* Image Container with Inset Shadow effect */}
            <div className="rounded-2xl overflow-hidden mb-4">
              <Image
                src={"/images/Spaghetti.jpg"}
                height={500}
                width={600}
                alt="Spaghetti"
                className="max-h-48 w-auto transition-transform bg-cover bg-bottom object-cover duration-500 group-hover:scale-110 rounded-2xl"
              />
            </div>

            {/* Content Section */}
            <div className="px-1 space-y-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg lg:text-xl font-Sofia font-bold text-gray-800 tracking-tight">
                    Spaghetti
                  </h3>
                  <p className="text-gray-500 text-sm font-medium">
                    Mix Vegetable
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between items-center pt-3">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-rose-500 font-bold text-sm">$</span>
                  <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tighter">
                    1,800
                  </span>
                </div>
                <button className="p-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300 shadow-sm">
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Products;
