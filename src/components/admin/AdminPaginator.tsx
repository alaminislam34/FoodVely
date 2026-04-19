type AdminPaginatorProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function AdminPaginator({
  page,
  totalPages,
  onPageChange,
  className,
}: AdminPaginatorProps) {
  const safeTotal = Math.max(totalPages, 1);

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-xs text-gray-500">
        Page {page} of {safeTotal}
      </span>
      <button
        onClick={() => onPageChange(Math.min(safeTotal, page + 1))}
        disabled={page >= safeTotal}
        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
