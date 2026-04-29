import { Search } from "lucide-react";

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  uniqueCategories: string[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  stockFilter: string;
  setStockFilter: React.Dispatch<React.SetStateAction<string>>;
  ratingFilter: string;
  setRatingFilter: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}
export default function Toolbar({
  searchQuery,
  setSearchQuery,
  uniqueCategories,
  selectedCategory,
  setSelectedCategory,
  stockFilter,
  setStockFilter,
  ratingFilter,
  setRatingFilter,
  sortBy,
  setSortBy,
}: ToolbarProps) {
  return (
    <div className="p-6 border-b border-gray-100 space-y-4">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by product name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
        >
          {uniqueCategories.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
        >
          <option value="all">Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
        >
          <option value="all">All Ratings</option>
          <option value="4.5+">4.5+ Stars</option>
          <option value="4.0+">4.0+ Stars</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
