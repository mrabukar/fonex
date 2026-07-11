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
import type { Partner } from "@/lib/types";
import { PartnerFormDialog } from "./components/partner-form-dialog";

function typeBadgeStyle(type: Partner["type"]): React.CSSProperties {
  if (type === "manufacturer") return { background: "#EEF1FB", color: "#1A1C74" };
  if (type === "retailer") return { background: "#E6F8FA", color: "#0E7C8C" };
  if (type === "tech_provider") return { background: "#EFEDFC", color: "#4C3FA6" };
  return { background: "#FFF4E0", color: "#9A6400" };
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
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

  const fetchPartners = useCallback(async () => {
    try {
      const result = await apiClient.get<PaginatedResult<Partner>>(
        `/api/partners${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      );
      setPartners(result.data);
      setTotal(result.total);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiClient
      .get<PaginatedResult<Partner>>(
        `/api/partners${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      )
      .then((result) => {
        if (!cancelled) {
          setPartners(result.data);
          setTotal(result.total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load partners");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  async function refetchPartners() {
    setLoading(true);
    await fetchPartners();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/partners/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.name}" deleted`);
      await refetchPartners();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete partner");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleExportAll() {
    return fetchAllPages<Partner>("/api/partners", {
      search: debouncedSearch.trim() || undefined,
    });
  }

  const columns = useMemo<ColumnDef<Partner>[]>(
    () => [
      {
        id: "logo",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ImageThumbnail src={row.original.logoUrl} size="sm" />,
        meta: { export: false, align: "center" },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
        meta: { label: "Name", align: "left" },
      },
      {
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => (
          <Badge style={typeBadgeStyle(row.original.type)} className="gap-1.5 border-0 font-semibold">
            <span className="size-1.5 rounded-full" style={{ background: typeBadgeStyle(row.original.type).color }} />
            {humanize(row.original.type)}
          </Badge>
        ),
        meta: { label: "Type", align: "left" },
      },
      {
        accessorKey: "websiteUrl",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
        cell: ({ row }) =>
          row.original.websiteUrl ? (
            <a
              href={row.original.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1C74] underline underline-offset-2"
            >
              {row.original.websiteUrl.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        meta: { label: "Website", align: "left" },
      },
      {
        accessorKey: "order",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.order}</span>,
        meta: { label: "Order", align: "left" },
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
                onClick: (partner) => {
                  setEditing(partner);
                  setFormOpen(true);
                },
              },
              {
                label: "Delete",
                icon: Trash2,
                variant: "destructive",
                onClick: (partner) => setDeleteTarget(partner),
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
        title="Partners"
        count={loading ? undefined : total}
        countTone="navy"
        description="Manage the partner logos shown on the Partnerships page."
        action={
          <Button className="gap-1.5" onClick={openCreate}>
            <Plus size={16} />
            New Partner
          </Button>
        }
      />

      <DataTable
        className="dt--comfortable"
        columns={columns}
        data={partners}
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
        searchPlaceholder="Search partners…"
        isLoading={loading}
        getRowId={(row) => row.id}
        exportFileName="partners"
        onExportAll={handleExportAll}
        emptyTitle={search ? "No partners match your search" : "No partners yet"}
        emptyDescription={
          search ? "Try a different search term." : "Add your first partner to populate the Partnerships page."
        }
      />

      <PartnerFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSaved={async () => {
          await refetchPartners();
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
            <AlertDialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
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
