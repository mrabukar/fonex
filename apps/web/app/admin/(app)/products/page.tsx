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
import { apiClient, ApiError, buildQueryString, fetchAllPages } from "@/lib/api-client";
import { ProductFormDialog, type Product } from "./components/product-form-dialog";
import { ProductThumbnail } from "./components/product-thumbnail";
import { humanize } from "./components/product-form-utils";

type Category = { id: string; name: string; slug: string };

function statusBadgeStyle(status: Product["status"]): React.CSSProperties {
  if (status === "in_stock") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "limited") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#E7E8F5", color: "#12144F" };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setLoading(true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    try {
      const result = await apiClient.get<PaginatedResult<Product>>(
        `/api/products${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      );
      setProducts(result.data);
      setTotal(result.total);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get<PaginatedResult<Category>>("/api/categories?pageSize=100")
      .then((result) => {
        if (!cancelled) setCategories(result.data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load categories");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get<PaginatedResult<Product>>(
        `/api/products${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      )
      .then((result) => {
        if (!cancelled) {
          setProducts(result.data);
          setTotal(result.total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load products");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  async function refetchProducts() {
    setLoading(true);
    await fetchProducts();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/products/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.name}" deleted`);
      await refetchProducts();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleExportAll() {
    return fetchAllPages<Product>("/api/products", {
      search: debouncedSearch.trim() || undefined,
    });
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "image",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <ProductThumbnail src={row.original.imageUrl} size="sm" />
        ),
        meta: { export: false, align: "center" },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
        meta: { label: "Name", align: "left" },
      },
      {
        id: "category",
        accessorFn: (row) => row.category.name,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.category.name}</span>,
        meta: { label: "Category", align: "left" },
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
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => <span className="text-muted-foreground">{humanize(row.original.type)}</span>,
        meta: { label: "Type", align: "left" },
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
                onClick: (product) => {
                  setEditing(product);
                  setFormOpen(true);
                },
              },
              {
                label: "Delete",
                icon: Trash2,
                variant: "destructive",
                onClick: (product) => setDeleteTarget(product),
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
        title="Products"
        count={loading ? undefined : total}
        countTone="amber"
        description="Manage the catalog shown on the storefront."
        action={
          <Button
            className="gap-1.5"
            disabled={categories.length === 0}
            title={categories.length === 0 ? "Create a category first" : undefined}
            onClick={openCreate}
          >
            <Plus size={16} />
            New Product
          </Button>
        }
        footer={
          categories.length === 0 && !loading ? (
            <p className="text-[13.5px] text-muted-foreground">
              You need at least one category before you can add products.
            </p>
          ) : undefined
        }
      />

      <DataTable
        className="dt--comfortable"
        columns={columns}
        data={products}
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
        searchPlaceholder="Search products…"
        isLoading={loading}
        getRowId={(row) => row.id}
        exportFileName="products"
        onExportAll={handleExportAll}
        emptyTitle={search ? "No products match your search" : "No products yet"}
        emptyDescription={
          search ? "Try a different search term." : "Create your first product to populate the storefront."
        }
      />

      <ProductFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        categories={categories}
        onSaved={async () => {
          await refetchProducts();
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
