import React from "react";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function TableSkeleton({ rows = 6, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-4">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-100 last:border-0"
            >
              {Array.from({ length: columns }).map((__, columnIndex) => (
                <td key={columnIndex} className="px-6 py-4">
                  <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-gray-100" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
