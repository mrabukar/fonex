"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { HomepageSlide, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient, ApiError } from "@/lib/api-client";
import { ImageThumbnail } from "@/components/admin/image-thumbnail";

export function SlideEditDialog({
  slide,
  products,
  open,
  onOpenChange,
  onSaved,
}: {
  slide: HomepageSlide | null;
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState(slide?.title ?? "");
  const [imageDescription, setImageDescription] = useState(slide?.imageDescription ?? "");
  const [caption, setCaption] = useState(slide?.caption ?? "");
  const [isActive, setIsActive] = useState(slide?.isActive ?? true);
  const [startsAt, setStartsAt] = useState(slide?.startsAt ?? "");
  const [endsAt, setEndsAt] = useState(slide?.endsAt ?? "");
  const [linkMode, setLinkMode] = useState<"none" | "product">(slide?.productId ? "product" : "none");
  const [productId, setProductId] = useState(slide?.productId ?? "");
  const [productQuery, setProductQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => product.name.toLowerCase().includes(q));
  }, [products, productQuery]);

  if (!slide) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slide) return;
    if (startsAt && endsAt && startsAt > endsAt) {
      toast.error("Start date must be on or before the end date");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.patch(`/api/homepage-slides/${slide.id}`, {
        title: title.trim(),
        imageDescription: imageDescription.trim() || null,
        caption: caption.trim() || null,
        isActive,
        startsAt: startsAt || null,
        endsAt: endsAt || null,
        productId: linkMode === "product" && productId ? productId : null,
      });
      toast.success("Homepage image updated");
      await onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} className="min-w-0">
          <DialogHeader>
            <DialogTitle>Edit homepage image</DialogTitle>
            <DialogDescription>
              Visitors never see the internal name. Caption and product link are optional.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex max-h-[60vh] min-w-0 flex-col gap-4 overflow-y-auto pr-1">
            <div className="flex items-center gap-3">
              <ImageThumbnail src={slide.imageUrl} size="md" />
              <p className="text-sm text-muted-foreground">Replace the photo from the list, not here — that keeps its place.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slide-title">Internal name</Label>
              <Input
                id="slide-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Huawei earbuds promo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slide-desc">Image description</Label>
              <Input
                id="slide-desc"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="e.g. Black wireless earbuds in a charging case"
              />
              <p className="text-xs text-muted-foreground">
                For screen readers. Leave blank if you are unsure.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slide-caption">Caption (optional)</Label>
              <Textarea
                id="slide-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short text on top of the image"
                rows={2}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>When someone clicks this image</Label>
              <Select
                value={linkMode}
                onValueChange={(value) => {
                  if (value === "product" || value === "none") setLinkMode(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {linkMode === "product" ? "Open a product" : "Do nothing"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Do nothing</SelectItem>
                  <SelectItem value="product">Open a product</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {linkMode === "product" && (
              <div className="flex flex-col gap-2 rounded-xl border border-[#E7EAF3] p-3">
                <Input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Search products…"
                />
                <div className="max-h-40 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="px-1 py-2 text-sm text-muted-foreground">No products match.</p>
                  ) : (
                    filteredProducts.map((product) => {
                      const selected = productId === product.id;
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => setProductId(product.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-[#F4F6FB]"
                          style={selected ? { background: "#EEF1FB", color: "#1A1C74" } : undefined}
                        >
                          <ImageThumbnail src={product.imageUrl} size="sm" />
                          <span className="min-w-0 truncate font-medium">{product.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <label className="flex items-center gap-2.5 text-sm font-medium">
              <Checkbox
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
              />
              Visible on homepage
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slide-start">Start date</Label>
                <Input
                  id="slide-start"
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slide-end">End date</Label>
                <Input
                  id="slide-end"
                  type="date"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave dates empty to show whenever it is visible. Dates use Somalia time.
            </p>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
