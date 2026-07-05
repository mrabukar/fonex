import type { ColumnDef } from "@tanstack/react-table";

function toCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function exportRowsToCsv<TData>(
  rows: TData[],
  columns: ColumnDef<TData, unknown>[],
  fileName: string,
) {
  const exportable = columns.filter((col) => {
    const meta = col.meta as { export?: boolean } | undefined;
    return meta?.export !== false && "accessorKey" in col;
  }) as (ColumnDef<TData, unknown> & { accessorKey: string })[];

  const headers = exportable.map((col) => {
    const meta = col.meta as { label?: string } | undefined;
    return meta?.label ?? col.accessorKey;
  });

  const lines = rows.map((row) =>
    exportable
      .map((col) => toCsvCell((row as Record<string, unknown>)[col.accessorKey]))
      .join(","),
  );

  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
