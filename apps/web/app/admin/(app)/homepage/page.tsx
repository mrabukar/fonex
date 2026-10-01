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
  rectSortingStrategy,
  useSortable,
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
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  SlideEditDialog,
  type SlideFormValues,
} from "./components/slide-edit-dialog";

function statusStyle(status: HomepageSlide["status"]): React.CSSProperties {
  if (status === "visible") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "scheduled")
    return { background: "#EEF1FB", color: "#1A1C74" };
  if (status === "ended") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#EEF0F4", color: "#5A6480" };
}

function statusLabel(status: HomepageSlide["status"]) {
  if (status === "visible") return "Visible";
  if (status === "scheduled") return "Scheduled";
  if (status === "ended") return "Ended";
  return "Hidden";
}

const PAGE_SIZE = 12;

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
  const [replaceTarget, setReplaceTarget] = useState<HomepageSlide | null>(
    null,
  );
  const [draft, setDraft] = useState<{ file: File; title: string } | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [draftPreviewUrl, setDraftPreviewUrl] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const load = useCallback(async (opts?: { revealNew?: boolean }) => {
    const [nextSlides, nextSettings] = await Promise.all([
      apiClient.get<HomepageSlide[]>("/api/homepage-slides/admin"),
      apiClient.get<HomepageSettings>("/api/homepage-settings"),
    ]);
    setSlides(nextSlides);
    setSettings(nextSettings);
    setSpeedSeconds(String(Math.round(nextSettings.autoplayMs / 1000)));
    setVisibleCount((count) => {
      if (opts?.revealNew) return Math.max(count, nextSlides.length);
      if (nextSlides.length <= PAGE_SIZE) return PAGE_SIZE;
      return Math.min(Math.max(count, PAGE_SIZE), nextSlides.length);
    });
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
          toast.error(
            err instanceof ApiError
              ? err.message
              : "Failed to load homepage images",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!draft) {
      setDraftPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(draft.file);
    setDraftPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [draft]);

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

  const currentFile = draft ? null : (queue[0] ?? null);
  const progressLabel =
    queue.length > 1
      ? `Image 1 of ${queue.length}`
      : queue.length === 1 && !replaceTarget
        ? "Image 1 of 1"
        : undefined;

  async function persistOrder(next: HomepageSlide[]) {
    const previous = slides;
    setSlides(next);
    try {
      const saved = await apiClient.patch<HomepageSlide[]>(
        "/api/homepage-slides/reorder",
        {
          ids: next.map((slide) => slide.id),
        },
      );
      setSlides(saved);
    } catch (err) {
      setSlides(previous);
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save order",
      );
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
      setSpeedSeconds(
        String(Math.round((settings?.autoplayMs ?? 3000) / 1000)),
      );
      return;
    }
    if (Math.round((settings?.autoplayMs ?? 3000) / 1000) === seconds) return;
    setSavingSpeed(true);
    try {
      const next = await apiClient.patch<HomepageSettings>(
        "/api/homepage-settings",
        {
          autoplayMs: Math.round(seconds * 1000),
        },
      );
      setSettings(next);
      setSpeedSeconds(String(Math.round(next.autoplayMs / 1000)));
      toast.success("Homepage speed updated");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save speed",
      );
    } finally {
      setSavingSpeed(false);
    }
  }

  async function uploadCropped(slideId: string, file: File) {
    const { uploadUrl, imageUrl } = await apiClient.post<{
      uploadUrl: string;
      imageUrl: string;
    }>(`/api/homepage-slides/${slideId}/image-upload-url`, {
      contentType: file.type,
    });

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error("Upload to storage failed");
    return imageUrl;
  }

  async function onCroppedNew(file: File) {
    setDraft({
      file,
      title: titleFromFilename(queue[0]?.name ?? file.name),
    });
  }

  function discardDraft() {
    setDraft(null);
    setQueue((prev) => prev.slice(1));
  }

  async function onCreateFromDraft(values: SlideFormValues) {
    if (!draft) return;
    const created = await apiClient.post<HomepageSlide>(
      "/api/homepage-slides",
      {
        title: values.title,
        imageDescription: values.imageDescription ?? undefined,
        caption: values.caption ?? undefined,
        isActive: values.isActive,
        startsAt: values.startsAt,
        endsAt: values.endsAt,
        productId: values.productId,
      },
    );
    try {
      await uploadCropped(created.id, draft.file);
    } catch (err) {
      try {
        await apiClient.delete(`/api/homepage-slides/${created.id}`);
      } catch {
        // Keep the failed row only if cleanup also fails; admin can delete it.
      }
      throw err;
    }
    setDraft(null);
    setQueue((prev) => prev.slice(1));
    await load({ revealNew: true });
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
      await apiClient.patch(`/api/homepage-slides/${slide.id}`, {
        isActive: !slide.isActive,
      });
      await load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update visibility",
      );
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
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete image",
      );
    } finally {
      setDeleting(false);
    }
  }

  const visibleSlides = useMemo(
    () => slides.slice(0, visibleCount),
    [slides, visibleCount],
  );
  const slideIds = useMemo(
    () => visibleSlides.map((slide) => slide.id),
    [visibleSlides],
  );
  const remaining = Math.max(0, slides.length - visibleSlides.length);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage images"
        count={loading ? undefined : slides.length}
        countTone="navy"
        description="Add and reorder the photos on the homepage slider. Cropping is optional. New images always go to the bottom — drag them into place."
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
            <Button
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={16} />
              Add image
            </Button>
          </div>
        }
        footer={
          <div className="flex max-w-sm flex-col gap-1.5">
            <Label htmlFor="homepage-speed">
              Seconds each image stays on screen
            </Label>
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
              {savingSpeed ? (
                <span className="text-xs text-muted-foreground">Saving…</span>
              ) : null}
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
          setDraft(null);
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
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 12 }, (_, i) => (
            <li
              key={i}
              className="flex gap-2.5 rounded-xl border border-[#E7EAF3] bg-white p-2.5"
            >
              <Skeleton className="mt-1 hidden h-4 w-4 shrink-0 rounded sm:block" />
              <Skeleton className="aspect-video w-28 shrink-0 rounded-lg sm:w-32" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-40" />
                <div className="flex flex-wrap gap-1 pt-1">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-14 rounded-md" />
                  <Skeleton className="h-7 w-16 rounded-md" />
                  <Skeleton className="h-7 w-12 rounded-md" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : slides.length === 0 ? (
        <div className="rounded-2xl border border-[#E7EAF3] bg-white">
          <EmptyState
            icon={Images}
            title="No homepage images yet"
            sub="Add your first image. You can crop it if you want, then fill in the details before it goes live."
          />
          <div className="pb-8 text-center">
            <Button
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={16} />
              Add image
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={slideIds} strategy={rectSortingStrategy}>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {visibleSlides.map((slide, index) => (
                  <SortableSlideCard
                    key={slide.id}
                    slide={slide}
                    index={index}
                    total={slides.length}
                    onEdit={() => {
                      if (draft) discardDraft();
                      setEditing(slide);
                    }}
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
          {remaining > 0 ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load more ({remaining} remaining)
              </Button>
            </div>
          ) : null}
        </div>
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
        onSkipRemaining={
          replaceTarget || queue.length <= 1 ? undefined : () => setQueue([])
        }
        onConfirm={replaceTarget ? onCroppedReplace : onCroppedNew}
      />

      <SlideEditDialog
        key={
          editing?.id ??
          (draft
            ? `draft-${draft.file.name}-${draft.file.lastModified}`
            : "closed")
        }
        slide={editing}
        previewUrl={draftPreviewUrl}
        defaultTitle={draft?.title}
        products={products}
        open={Boolean(editing) || Boolean(draft)}
        onCreate={draft ? onCreateFromDraft : undefined}
        onOpenChange={(open) => {
          if (open) return;
          if (draft) discardDraft();
          setEditing(null);
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
            <AlertDialogDescription>
              This will disappear from the homepage.
            </AlertDialogDescription>
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
      className="flex gap-2.5 rounded-xl border border-[#E7EAF3] bg-white p-2.5"
    >
      <button
        type="button"
        className="mt-1 hidden h-fit cursor-grab touch-none text-[#9AA3B8] hover:text-[#0B1226] sm:block"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-[#F4F6FB] sm:w-32">
        {slide.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
            No photo
          </div>
        )}
        <span
          className="absolute left-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[11px] font-bold text-white"
          style={{ background: "rgba(11,18,38,.82)" }}
          aria-label={`Position ${index + 1} of ${total}`}
        >
          {index + 1}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h2 className="truncate text-sm font-semibold text-[#0B1226]">
            {slide.title}
          </h2>
          <Badge
            className="px-1.5 py-0 text-[10px]"
            style={statusStyle(slide.status)}
          >
            {statusLabel(slide.status)}
          </Badge>
        </div>
        {slide.product?.name ? (
          <p className="mt-0.5 truncate text-xs text-[#1A1C74]">
            Opens {slide.product.name}
          </p>
        ) : null}
        {slide.caption ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {slide.caption}
          </p>
        ) : null}
        {slide.startsAt || slide.endsAt ? (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {slide.startsAt ? `From ${slide.startsAt}` : "From now"}
            {slide.endsAt ? ` · until ${slide.endsAt}` : ""}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move up"
          >
            <ArrowUp size={12} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={index === total - 1}
            onClick={onMoveDown}
            aria-label="Move down"
          >
            <ArrowDown size={12} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2"
            onClick={onEdit}
          >
            <Pencil size={12} />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={onReplace}
          >
            Replace
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={onToggle}
          >
            {slide.isActive ? "Hide" : "Show"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-7 px-2"
            onClick={onDelete}
            aria-label="Delete"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </li>
  );
}
