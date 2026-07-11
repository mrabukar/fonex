"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { type PaginatedResult } from "@fonex/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ImageThumbnail } from "@/components/admin/image-thumbnail";
import { apiClient, ApiError, buildQueryString, fetchAllPages } from "@/lib/api-client";
import { humanize } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";
import { NewsFormDialog } from "./components/news-form-dialog";

function statusBadgeStyle(status: NewsArticle["status"]): React.CSSProperties {
  if (status === "published") return { background: "#E2F6EF", color: "#067A55" };
  return { background: "#EEF0F4", color: "#5A6480" };
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    if (search === debouncedSearch) return;

    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, debouncedSearch]);

  const fetchArticles = useCallback(async () => {
    try {
      const result = await apiClient.get<PaginatedResult<NewsArticle>>(
        `/api/news/admin${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      );
      setArticles(result.data);
      setTotal(result.total);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiClient
      .get<PaginatedResult<NewsArticle>>(
        `/api/news/admin${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      )
      .then((result) => {
        if (!cancelled) {
          setArticles(result.data);
          setTotal(result.total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load articles");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  async function refetchArticles() {
    setLoading(true);
    await fetchArticles();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/news/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.title}" deleted`);
      await refetchArticles();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete article");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleExportAll() {
    return fetchAllPages<NewsArticle>("/api/news/admin", {
      search: debouncedSearch.trim() || undefined,
    });
  }

  const columns = useMemo<ColumnDef<NewsArticle>[]>(
    () => [
      {
        id: "image",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ImageThumbnail src={row.original.imageUrl} size="sm" />,
        meta: { export: false, align: "center" },
      },
      {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.title}</span>,
        meta: { label: "Title", align: "left" },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge style={statusBadgeStyle(row.original.status)} className="gap-1.5 border-0 font-semibold">
            <span className="size-1.5 rounded-full" style={{ background: statusBadgeStyle(row.original.status).color }} />
            {humanize(row.original.status)}
          </Badge>
        ),
        meta: { label: "Status", align: "left" },
      },
      {
        accessorKey: "publishedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.publishedAt
              ? new Date(row.original.publishedAt).toLocaleDateString()
              : "—"}
          </span>
        ),
        meta: { label: "Published", align: "left" },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <DataTableRowActions
            row={row.original}
            actions={[
              {
                label: "Edit",
                icon: Pencil,
                onClick: (article) => {
                  setEditing(article);
                  setFormOpen(true);
                },
              },
              {
                label: "Delete",
                icon: Trash2,
                variant: "destructive",
                onClick: (article) => setDeleteTarget(article),
              },
            ]}
          />
        ),
        meta: {
          export: false,
          align: "center",
          headerClass: "dt-col-actions",
          cellClass: "dt-col-actions",
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="News"
        count={loading ? undefined : total}
        countTone="amber"
        description="Manage news and updates shown on the homepage and the News page."
        action={
          <Button className="gap-1.5" onClick={openCreate}>
            <Plus size={16} />
            New Article
          </Button>
        }
      />

      <DataTable
        className="dt--comfortable"
        columns={columns}
        data={articles}
        rowCount={total}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={(next) => {
          setLoading(true);
          setPagination(next);
        }}
        searchValue={search}
        onSearchChange={(value) => {
          setLoading(true);
          setSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        searchPlaceholder="Search articles…"
        isLoading={loading}
        getRowId={(row) => row.id}
        exportFileName="news"
        onExportAll={handleExportAll}
        emptyTitle={search ? "No articles match your search" : "No articles yet"}
        emptyDescription={
          search ? "Try a different search term." : "Create your first article to populate the News page."
        }
      />

      <NewsFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSaved={async () => {
          await refetchArticles();
        }}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
