import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2.5 rounded-xl bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-lg group-hover:shadow-xl transition-shadow">
        <ChefHat size={24} />
      </div>
      <h3 className="text-xl lg:text-2xl font-Sofia font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
        Food<span className="text-rose-500">Vally</span>
      </h3>
    </Link>
  );
}
