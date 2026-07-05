"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Pencil,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { exportRowsToCsv } from "@/components/data-table/export-csv";
import { EmptyState } from "@/components/ui/empty-state";

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

const PAGE_SIZES = [10, 20, 30, 50, 100];

const EXPORT_COLUMNS = [{ accessorKey: "name", meta: { label: "Name" } }] as const;

export interface CategoriesListProps {
  categories: CategoryListItem[];
  total: number;
  loading: boolean;
  pageIndex: number;
  pageSize: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPaginationChange: (state: { pageIndex: number; pageSize: number }) => void;
  onEdit: (category: CategoryListItem) => void;
  onDelete: (category: CategoryListItem) => void;
  onExportAll: () => Promise<CategoryListItem[]>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function CategoriesList({
  categories,
  total,
  loading,
  pageIndex,
  pageSize,
  search,
  onSearchChange,
  onPaginationChange,
  onEdit,
  onDelete,
  onExportAll,
  emptyTitle = "No categories yet",
  emptyDescription = "Create your first category to start building the catalog.",
}: CategoriesListProps) {
  const [exporting, setExporting] = useState(false);
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
  const showEmpty = !loading && categories.length === 0;

  async function handleExportAll() {
    setExporting(true);
    try {
      const rows = await onExportAll();
      exportRowsToCsv(rows, [...EXPORT_COLUMNS], "categories");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="dt w-full">
      <div className="dt-toolbar">
        <div className="dt-toolbar-left">
          <div className="dt-search">
            <Search size={16} color="var(--fg3)" />
            <input
              placeholder="Search categories…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="dt-search-clear"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="dt-toolbar-right">
          <button
            type="button"
            className="dt-btn"
            disabled={exporting}
            onClick={() => void handleExportAll()}
          >
            <Download size={15} />
            {exporting ? "Exporting…" : "Export all"}
          </button>
        </div>
      </div>

      <div className="admin-list">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`category-skeleton-${index}`}
              className="admin-list-row admin-list-row--skeleton"
            >
              <span className="dt-skeleton size-8 shrink-0 rounded-lg" aria-hidden="true" />
              <span className="dt-skeleton h-4 w-36 max-w-[60%]" aria-hidden="true" />
            </div>
          ))}

        {!loading &&
          categories.map((category) => (
            <div key={category.id} className="admin-list-row">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FB] text-[#1A1C74]">
                  <Tags size={15} />
                </span>
                <span className="truncate font-semibold text-foreground">{category.name}</span>
              </div>
              <DataTableRowActions
                row={category}
                actions={[
                  {
                    label: "Edit",
                    icon: Pencil,
                    onClick: onEdit,
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    variant: "destructive",
                    onClick: onDelete,
                  },
                ]}
              />
            </div>
          ))}

        {showEmpty && (
          <div className="admin-list-empty">
            <EmptyState title={emptyTitle} sub={emptyDescription} icon={Tags} />
          </div>
        )}
      </div>

      <div className="dt-footer">
        <div className="dt-footer-meta">{total} row(s) total</div>
        <div className="dt-footer-controls">
          <label className="dt-page-size">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) =>
                onPaginationChange({ pageIndex: 0, pageSize: Number(e.target.value) })
              }
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <span className="dt-page-label">
            Page {total === 0 ? 0 : pageIndex + 1} of {total === 0 ? 0 : pageCount}
          </span>
          <div className="dt-page-nav">
            <button
              type="button"
              className="dt-btn dt-btn-icon"
              onClick={() => onPaginationChange({ pageIndex: 0, pageSize })}
              disabled={pageIndex === 0 || loading}
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              type="button"
              className="dt-btn dt-btn-icon"
              onClick={() => onPaginationChange({ pageIndex: pageIndex - 1, pageSize })}
              disabled={pageIndex === 0 || loading}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="dt-btn dt-btn-icon"
              onClick={() => onPaginationChange({ pageIndex: pageIndex + 1, pageSize })}
              disabled={pageIndex >= pageCount - 1 || loading || total === 0}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className="dt-btn dt-btn-icon"
              onClick={() => onPaginationChange({ pageIndex: pageCount - 1, pageSize })}
              disabled={pageIndex >= pageCount - 1 || loading || total === 0}
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
