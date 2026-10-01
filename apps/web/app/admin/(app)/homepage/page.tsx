"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  GripVertical,
  ImagePlus,
  Images,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
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
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";
import { apiClient, ApiError, fetchAllPages } from "@/lib/api-client";
import { titleFromFilename, validateHomepageSource } from "@/lib/crop-image";
import type { HomepageSettings, HomepageSlide, Product } from "@/lib/types";
import { SlideEditDialog } from "./components/slide-edit-dialog";

function statusStyle(status: HomepageSlide["status"]): React.CSSProperties {
  if (status === "visible") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "scheduled") return { background: "#EEF1FB", color: "#1A1C74" };
  if (status === "ended") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#EEF0F4", color: "#5A6480" };
}

function statusLabel(status: HomepageSlide["status"]) {
  if (status === "visible") return "Visible";
  if (status === "scheduled") return "Scheduled";
  if (status === "ended") return "Ended";
  return "Hidden";
}

export default function AdminHomepagePage() {
  const [slides, setSlides] = useState<HomepageSlide[]>([]);
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [speedSeconds, setSpeedSeconds] = useState("3");
  const [savingSpeed, setSavingSpeed] = useState(false);
  const [editing, setEditing] = useState<HomepageSlide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HomepageSlide | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [queue, setQueue] = useState<File[]>([]);
  const [replaceTarget, setReplaceTarget] = useState<HomepageSlide | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(async () => {
    const [nextSlides, nextSettings] = await Promise.all([
      apiClient.get<HomepageSlide[]>("/api/homepage-slides/admin"),
      apiClient.get<HomepageSettings>("/api/homepage-settings"),
    ]);
    setSlides(nextSlides);
    setSettings(nextSettings);
    setSpeedSeconds(String(Math.round(nextSettings.autoplayMs / 1000)));
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiClient.get<HomepageSlide[]>("/api/homepage-slides/admin"),
      apiClient.get<HomepageSettings>("/api/homepage-settings"),
      fetchAllPages<Product>("/api/products", {}),
    ])
      .then(([nextSlides, nextSettings, nextProducts]) => {
        if (cancelled) return;
        setSlides(nextSlides);
        setSettings(nextSettings);
        setSpeedSeconds(String(Math.round(nextSettings.autoplayMs / 1000)));
        setProducts(nextProducts);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load homepage images");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function enqueueFiles(files: File[]) {
    const accepted: File[] = [];
    for (const file of files) {
      const error = await validateHomepageSource(file);
      if (error) toast.error(`${file.name}: ${error}`);
      else accepted.push(file);
    }
    if (accepted.length === 0) {
      if (replaceTarget) setReplaceTarget(null);
      return;
    }
    setQueue(accepted);
  }

  const currentFile = queue[0] ?? null;
  const progressLabel =
    queue.length > 1 ? `Image 1 of ${queue.length}` : queue.length === 1 && !replaceTarget ? "Image 1 of 1" : undefined;

  async function persistOrder(next: HomepageSlide[]) {
    const previous = slides;
    setSlides(next);
    try {
      const saved = await apiClient.patch<HomepageSlide[]>("/api/homepage-slides/reorder", {
        ids: next.map((slide) => slide.id),
      });
      setSlides(saved);
    } catch (err) {
      setSlides(previous);
      toast.error(err instanceof ApiError ? err.message : "Failed to save order");
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((slide) => slide.id === active.id);
    const newIndex = slides.findIndex((slide) => slide.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void persistOrder(arrayMove(slides, oldIndex, newIndex));
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= slides.length) return;
    void persistOrder(arrayMove(slides, index, nextIndex));
  }

  async function saveSpeed() {
    const seconds = Number(speedSeconds);
    if (!Number.isFinite(seconds) || seconds < 1 || seconds > 15) {
      toast.error("Use a time between 1 and 15 seconds");
      setSpeedSeconds(String(Math.round((settings?.autoplayMs ?? 3000) / 1000)));
      return;
    }
    if (Math.round((settings?.autoplayMs ?? 3000) / 1000) === seconds) return;
    setSavingSpeed(true);
    try {
      const next = await apiClient.patch<HomepageSettings>("/api/homepage-settings", {
        autoplayMs: Math.round(seconds * 1000),
      });
      setSettings(next);
      setSpeedSeconds(String(Math.round(next.autoplayMs / 1000)));
      toast.success("Homepage speed updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save speed");
    } finally {
      setSavingSpeed(false);
    }
  }

  async function uploadCropped(slideId: string, file: File) {
    const { uploadUrl, imageUrl } = await apiClient.post<{
      uploadUrl: string;
      imageUrl: string;
    }>(`/api/homepage-slides/${slideId}/image-upload-url`, { contentType: file.type });

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error("Upload to storage failed");
    return imageUrl;
  }

  async function onCroppedNew(file: File) {
    const created = await apiClient.post<HomepageSlide>("/api/homepage-slides", {
      title: titleFromFilename(queue[0]?.name ?? file.name),
    });
    try {
      await uploadCropped(created.id, file);
    } catch (err) {
      try {
        await apiClient.delete(`/api/homepage-slides/${created.id}`);
      } catch {
        // Keep the failed row only if cleanup also fails; admin can delete it.
      }
      throw err;
    }
    toast.success("Image added");
    setQueue((prev) => prev.slice(1));
    await load();
  }

  async function onCroppedReplace(file: File) {
    if (!replaceTarget) return;
    await uploadCropped(replaceTarget.id, file);
    toast.success("Image replaced");
    setReplaceTarget(null);
    setQueue([]);
    await load();
  }

  async function toggleVisible(slide: HomepageSlide) {
    try {
      await apiClient.patch(`/api/homepage-slides/${slide.id}`, { isActive: !slide.isActive });
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update visibility");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/homepage-slides/${deleteTarget.id}`);
      toast.success("Homepage image removed");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  }

  const slideIds = useMemo(() => slides.map((slide) => slide.id), [slides]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage images"
        count={loading ? undefined : slides.length}
        countTone="navy"
        description="Add, crop, and reorder the photos on the homepage slider. New images always go to the bottom — drag them into place."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
            >
              <ExternalLink size={16} />
              View homepage
            </Button>
            <Button className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={16} />
              Add image
            </Button>
          </div>
        }
        footer={
          <div className="flex max-w-sm flex-col gap-1.5">
            <Label htmlFor="homepage-speed">Seconds each image stays on screen</Label>
            <div className="flex items-center gap-2">
              <Input
                id="homepage-speed"
                type="number"
                min={1}
                max={15}
                step={1}
                className="w-24"
                value={speedSeconds}
                onChange={(e) => setSpeedSeconds(e.target.value)}
                onBlur={() => void saveSpeed()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
              {savingSpeed ? <span className="text-xs text-muted-foreground">Saving…</span> : null}
            </div>
          </div>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length === 0) return;
          setReplaceTarget(null);
          void enqueueFiles(files);
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          void enqueueFiles([file]);
        }}
      />

      {loading ? (
        <div className="rounded-2xl border border-[#E7EAF3] bg-white px-4 py-16 text-center text-sm text-muted-foreground">
          Loading homepage images…
        </div>
      ) : slides.length === 0 ? (
        <div className="rounded-2xl border border-[#E7EAF3] bg-white">
          <EmptyState
            icon={Images}
            title="No homepage images yet"
            sub="Add your first image. You will crop it to the homepage size before it goes live."
          />
          <div className="pb-8 text-center">
            <Button className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={16} />
              Add image
            </Button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={slideIds} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {slides.map((slide, index) => (
                <SortableSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                  total={slides.length}
                  onEdit={() => setEditing(slide)}
                  onReplace={() => {
                    setReplaceTarget(slide);
                    replaceInputRef.current?.click();
                  }}
                  onToggle={() => void toggleVisible(slide)}
                  onDelete={() => setDeleteTarget(slide)}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <ImageCropDialog
        file={currentFile}
        progressLabel={replaceTarget ? undefined : progressLabel}
        onCancel={() => {
          if (replaceTarget) {
            setReplaceTarget(null);
            setQueue([]);
            return;
          }
          setQueue((prev) => prev.slice(1));
        }}
        onSkipRemaining={replaceTarget || queue.length <= 1 ? undefined : () => setQueue([])}
        onConfirm={replaceTarget ? onCroppedReplace : onCroppedNew}
      />

      <SlideEditDialog
        key={editing?.id ?? "closed"}
        slide={editing}
        products={products}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        onSaved={load}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{deleteTarget?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>This will disappear from the homepage.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SortableSlideCard({
  slide,
  index,
  total,
  onEdit,
  onReplace,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  slide: HomepageSlide;
  index: number;
  total: number;
  onEdit: () => void;
  onReplace: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
      className="flex flex-col gap-4 rounded-2xl border border-[#E7EAF3] bg-white p-4 sm:flex-row sm:items-center"
    >
      <button
        type="button"
        className="hidden cursor-grab touch-none text-[#9AA3B8] hover:text-[#0B1226] sm:block"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </button>

      <div
        className="relative w-full shrink-0 overflow-hidden rounded-xl bg-[#F4F6FB] sm:w-48"
        style={{ aspectRatio: "16 / 9" }}
      >
        {slide.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No photo yet
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-[#0B1226]">{slide.title}</h2>
          <Badge style={statusStyle(slide.status)}>{statusLabel(slide.status)}</Badge>
          <span className="text-xs text-muted-foreground">
            {index + 1} of {total}
          </span>
        </div>
        {slide.product?.name ? (
          <p className="mt-1 text-sm text-[#1A1C74]">Opens {slide.product.name}</p>
        ) : null}
        {slide.caption ? (
          <p className="mt-1 truncate text-sm text-muted-foreground">Caption: {slide.caption}</p>
        ) : null}
        {slide.startsAt || slide.endsAt ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {slide.startsAt ? `From ${slide.startsAt}` : "From now"}
            {slide.endsAt ? ` · until ${slide.endsAt}` : ""}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:flex-col sm:items-stretch">
        <div className="flex gap-1.5">
          <Button type="button" variant="outline" size="sm" disabled={index === 0} onClick={onMoveUp}>
            <ArrowUp size={14} />
            <span className="sm:hidden">Up</span>
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={index === total - 1} onClick={onMoveDown}>
            <ArrowDown size={14} />
            <span className="sm:hidden">Down</span>
          </Button>
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
          <Pencil size={14} />
          Edit
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onReplace}>
          Replace
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onToggle}>
          {slide.isActive ? "Hide" : "Show"}
        </Button>
        <Button type="button" variant="destructive" size="sm" className="gap-1.5" onClick={onDelete}>
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </li>
  );
}
