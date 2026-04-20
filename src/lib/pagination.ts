export type PaginationResult<T> = {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export function paginateItems<T>(
  items: T[],
  page: number,
  limit: number,
): PaginationResult<T> {
  const safeLimit = Math.max(1, limit);
  const safePage = Math.max(1, page);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const normalizedPage = Math.min(safePage, totalPages);
  const start = (normalizedPage - 1) * safeLimit;

  return {
    items: items.slice(start, start + safeLimit),
    total,
    totalPages,
    page: normalizedPage,
    limit: safeLimit,
  };
}
