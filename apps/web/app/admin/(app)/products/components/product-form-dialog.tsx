"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  deviceTypeValues,
  productStatusValues,
  type ProductInput,
} from "@fonex/shared";
import type { Category, Product } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient, ApiError } from "@/lib/api-client";
import { humanize } from "@/lib/utils";
import { ProductImageUpload } from "./product-image-upload";
import { Textarea } from "@/components/ui/textarea";

export interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Product | null;
  categories: Category[];
  onSaved: () => void | Promise<void>;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  initial,
  categories,
  onSaved,
}: ProductFormDialogProps) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? "",
  );
  const [status, setStatus] = useState<Product["status"]>(
    initial?.status ?? "in_stock",
  );
  const [type, setType] = useState<Product["type"]>(initial?.type ?? "phone");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [savedProduct, setSavedProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [hasPendingImage, setHasPendingImage] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  const activeProduct = savedProduct ?? initial;
  const isPhotoStep = !isEdit && Boolean(savedProduct);

  function requestClose(nextOpen: boolean) {
    if (!nextOpen && hasPendingImage) {
      setDiscardConfirmOpen(true);
      return;
    }
    onOpenChange(nextOpen);
  }

  function confirmDiscard() {
    setDiscardConfirmOpen(false);
    onOpenChange(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload: ProductInput = {
      name,
      categoryId,
      status,
      type,
      description: description.trim() || undefined,
    };

    try {
      if (isEdit && initial) {
        await apiClient.patch<Product>(`/api/products/${initial.id}`, payload);
        toast.success("Product updated");
        await onSaved();
        onOpenChange(false);
      } else {
        const product = await apiClient.post<Product>("/api/products", payload);
        setSavedProduct(product);
        setImageUrl(product.imageUrl);
        toast.success("Product created — add a photo or click Done");
        await onSaved();
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save product",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedCategoryName = categories.find(
    (c) => c.id === categoryId,
  )?.name;

  return (
    <>
      <Dialog open={open} onOpenChange={requestClose}>
      <DialogContent
        className={`overflow-hidden ${isPhotoStep || isEdit ? "sm:max-w-lg" : "sm:max-w-md"}`}
      >
        <form onSubmit={onSubmit} className="min-w-0">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? "Edit product"
                : isPhotoStep
                  ? "Add product photo"
                  : "New product"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this product's details and photo."
                : isPhotoStep
                  ? `"${savedProduct?.name}" was created. Add a photo now or click Done to skip.`
                  : "Fill in the details to create a new product."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex max-h-[60vh] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto pr-1">
            {!isPhotoStep && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="p-name">Name</Label>
                  <Input
                    id="p-name"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aurora Pro 5G"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Category</Label>
                  <Select
                    value={categoryId}
                    onValueChange={(v) => setCategoryId(v ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category">
                        {selectedCategoryName}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Status</Label>
                    <Select
                      value={status}
                      onValueChange={(v) =>
                        v && setStatus(v as Product["status"])
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>{humanize(status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {productStatusValues.map((s) => (
                          <SelectItem key={s} value={s}>
                            {humanize(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Type</Label>
                    <Select
                      value={type}
                      onValueChange={(v) => v && setType(v as Product["type"])}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>{humanize(type)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {deviceTypeValues.map((t) => (
                          <SelectItem key={t} value={t}>
                            {humanize(t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="p-description">Description</Label>
                  <Textarea
                    id="p-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional short description shown on the storefront"
                    rows={3}
                  />
                </div>
              </>
            )}

            {activeProduct && (isPhotoStep || isEdit) && (
              <div className="flex flex-col gap-1.5">
                <Label>Photo</Label>
                <ProductImageUpload
                  productId={activeProduct.id}
                  imageUrl={imageUrl}
                  onUploaded={(url) => {
                    setImageUrl(url);
                    onSaved();
                  }}
                  onPendingChange={setHasPendingImage}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            {isPhotoStep ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => requestClose(false)}
                >
                  Skip photo
                </Button>
                <Button type="button" onClick={() => requestClose(false)}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => requestClose(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving…"
                    : isEdit
                      ? "Save changes"
                      : "Create product"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>

      <AlertDialog open={discardConfirmOpen} onOpenChange={setDiscardConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved photo?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an unsaved photo preview. Discard it and close?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDiscard}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
