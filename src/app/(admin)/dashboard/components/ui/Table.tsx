
import React from "react";

export type TableColumn<T> = {
  key: keyof T | string; // string for custom columns like 'actions'
  label: string | React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyText?: string;
  className?: string;
}

function Table<T extends { [key: string]: any }>({
  columns,
  data,
  emptyText = "No data found.",
  className = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-2xl shadow-lg bg-white/80 ${className}`}>
      <table className="min-w-full divide-y divide-indigo-200">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={String(col.key) + idx}
                className={`px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row._id || row.id || rowIdx}
                className="hover:bg-indigo-50 transition-colors"
              >
                {columns.map((col, colIdx) => {
                  const value = typeof col.key === "string" ? row[col.key] : row[col.key as keyof T];
                  return (
                    <td
                      key={String(col.key) + colIdx}
                      className={`px-4 py-3 align-middle ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {col.render ? col.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
