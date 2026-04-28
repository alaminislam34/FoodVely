import { Settings } from "lucide-react";

export function FoodSEOForm({ register }: any) {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
        <div className="p-2 bg-blue-50 rounded-xl">
          <Settings size={20} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">SEO & Discovery</h3>
      </div>
      <div className="grid gap-4">
        <input
          {...register("metaTitle")}
          className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700"
          placeholder="Meta Title (e.g. Best Biryani in Dhaka)"
        />
        <textarea
          {...register("metaDescription")}
          rows={2}
          className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700"
          placeholder="Short SEO Meta Description"
        />
      </div>
    </section>
  );
}
