"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { PaginationState } from "@tanstack/react-table";
import type { CategoryInput, PaginatedResult } from "@fonex/shared";
import { slugify } from "@fonex/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { apiClient, ApiError, buildQueryString, fetchAllPages } from "@/lib/api-client";
import {
  CategoriesList,
  type CategoryListItem,
} from "./components/categories-list";

type Category = CategoryListItem;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
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

  const fetchCategories = useCallback(async () => {
    try {
      const result = await apiClient.get<PaginatedResult<Category>>(
        `/api/categories${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      );
      setCategories(result.data);
      setTotal(result.total);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get<PaginatedResult<Category>>(
        `/api/categories${buildQueryString({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: debouncedSearch.trim() || undefined,
        })}`,
      )
      .then((result) => {
        if (!cancelled) {
          setCategories(result.data);
          setTotal(result.total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load categories");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  async function refetchCategories() {
    setLoading(true);
    await fetchCategories();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/categories/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.name}" deleted`);
      await refetchCategories();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete category");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleExportAll() {
    return fetchAllPages<Category>("/api/categories", {
      search: debouncedSearch.trim() || undefined,
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        count={loading ? undefined : total}
        countTone="navy"
        description="Manage the product categories shown on the storefront."
        action={
          <Button className="gap-1.5" onClick={openCreate}>
            <Plus size={16} />
            New Category
          </Button>
        }
      />

      <CategoriesList
        categories={categories}
        total={total}
        loading={loading}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        search={search}
        onSearchChange={(value) => {
          setLoading(true);
          setSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        onPaginationChange={(next) => {
          setLoading(true);
          setPagination(next);
        }}
        onEdit={(category) => {
          setEditing(category);
          setFormOpen(true);
        }}
        onDelete={setDeleteTarget}
        onExportAll={handleExportAll}
        emptyTitle={search ? "No categories match your search" : "No categories yet"}
        emptyDescription={
          search ? "Try a different search term." : "Create your first category to start building the catalog."
        }
      />

      <CategoryFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSaved={async () => {
          await refetchCategories();
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
            <AlertDialogDescription>
              This can&apos;t be undone. If any products still use this category, the deletion will be blocked.
            </AlertDialogDescription>
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

function CategoryFormDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Category | null;
  onSaved: () => void | Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [submitting, setSubmitting] = useState(false);

  const slug = slugify(name);
  const slugInvalid = name.trim().length > 0 && !slug;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const generatedSlug = slugify(name);
    if (!generatedSlug) return;

    setSubmitting(true);
    const payload: CategoryInput = { name, slug: generatedSlug };
    try {
      if (initial) {
        await apiClient.patch<Category>(`/api/categories/${initial.id}`, payload);
      } else {
        await apiClient.post<Category>("/api/categories", payload);
      }
      toast.success(initial ? "Category updated" : "Category created");
      await onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{initial ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>
              {initial
                ? "Update this category's name."
                : "Categories group products on the storefront."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Flagship"
              />
              {slugInvalid && (
                <p className="text-xs text-destructive">
                  Name must contain at least one letter or number.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting || !slug}>
              {submitting ? "Saving…" : initial ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
