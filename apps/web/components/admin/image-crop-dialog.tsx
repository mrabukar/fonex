"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CROP_ASPECT_SQUARE,
  CROP_ASPECT_TALL,
  CROP_ASPECT_WIDE,
  aspectToHeightT,
  getCroppedImageFile,
  heightTToAspect,
} from "@/lib/crop-image";

export function ImageCropDialog({
  file,
  progressLabel,
  onCancel,
  onSkipRemaining,
  onConfirm,
}: {
  file: File | null;
  progressLabel?: string;
  onCancel: () => void;
  onSkipRemaining?: () => void;
  onConfirm: (cropped: File) => Promise<void>;
}) {
  if (!file) return null;

  return (
    <ImageCropDialogBody
      key={`${file.name}-${file.size}-${file.lastModified}`}
      file={file}
      progressLabel={progressLabel}
      onCancel={onCancel}
      onSkipRemaining={onSkipRemaining}
      onConfirm={onConfirm}
    />
  );
}

function ImageCropDialogBody({
  file,
  progressLabel,
  onCancel,
  onSkipRemaining,
  onConfirm,
}: {
  file: File;
  progressLabel?: string;
  onCancel: () => void;
  onSkipRemaining?: () => void;
  onConfirm: (cropped: File) => Promise<void>;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [heightT, setHeightT] = useState(0);
  const [photoAspect, setPhotoAspect] = useState<number | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [cropperReady, setCropperReady] = useState(false);
  const tallEnd = photoAspect == null ? CROP_ASPECT_TALL : Math.min(photoAspect, CROP_ASPECT_TALL);
  const wideEnd = photoAspect == null ? CROP_ASPECT_WIDE : Math.max(photoAspect, CROP_ASPECT_WIDE);
  const aspect = heightTToAspect(heightT, tallEnd, wideEnd);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const nextAspect = img.naturalWidth / Math.max(1, img.naturalHeight);
      const nextTall = Math.min(nextAspect, CROP_ASPECT_TALL);
      const nextWide = Math.max(nextAspect, CROP_ASPECT_WIDE);
      setPhotoAspect(nextAspect);
      setHeightT(aspectToHeightT(nextAspect, nextTall, nextWide));
      setImageSrc(url);
    };
    img.onerror = () => setImageSrc(url);
    img.src = url;
    return () => {
      URL.revokeObjectURL(url);
      setImageSrc(null);
    };
  }, [file]);

  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setCropperReady(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  async function confirmOriginal() {
    setSaving(true);
    try {
      await onConfirm(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to use that image");
    } finally {
      setSaving(false);
    }
  }

  async function confirm() {
    if (!area || !imageSrc) return;
    setSaving(true);
    try {
      const cropped = await getCroppedImageFile(imageSrc, area, file.name);
      await onConfirm(cropped);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to crop image");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !saving && onCancel()}>
      <DialogContent
        showCloseButton={!saving}
        className="top-0 left-0 flex h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center overflow-y-auto bg-transparent p-4 shadow-none ring-0 sm:max-w-none data-open:animate-none data-closed:animate-none"
      >
        <div className="relative grid w-full max-w-3xl gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10">
          <DialogHeader>
            <DialogTitle>Frame the image</DialogTitle>
            <DialogDescription>
              {progressLabel ? `${progressLabel}. ` : ""}
              Drag, zoom, or raise the frame height to keep more of a tall photo.
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-[min(58vh,560px)] min-h-60 overflow-hidden rounded-xl bg-[#0B1226]">
            {cropperReady && imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                objectFit="contain"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setArea(croppedAreaPixels)}
                style={{
                  containerStyle: { width: "100%", height: "100%" },
                  mediaStyle: { maxWidth: "none" },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/70">
                <Loader2 size={18} className="animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["wide", "Wide", CROP_ASPECT_WIDE],
                  ["square", "Square", CROP_ASPECT_SQUARE],
                  ["tall", "Tall", CROP_ASPECT_TALL],
                  ...(photoAspect != null
                    ? ([["full", "Full photo", photoAspect]] as const)
                    : []),
                ] as const
              ).map(([id, label, value]) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={Math.abs(aspect - value) < 0.02 ? "default" : "outline"}
                  disabled={saving || !cropperReady}
                  onClick={() => {
                    setHeightT(aspectToHeightT(value, tallEnd, wideEnd));
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="crop-height">
                  Frame height
                </label>
                <span className="text-xs text-muted-foreground">Wide → Tall</span>
              </div>
              <input
                id="crop-height"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={heightT}
                onChange={(e) => {
                  setHeightT(Number(e.target.value));
                  setCrop({ x: 0, y: 0 });
                }}
                className="w-full"
                disabled={!cropperReady}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="crop-zoom">
                Zoom
              </label>
              <input
                id="crop-zoom"
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
                disabled={!cropperReady}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:flex-wrap">
            {onSkipRemaining ? (
              <Button type="button" variant="ghost" disabled={saving} onClick={onSkipRemaining}>
                Cancel remaining
              </Button>
            ) : (
              <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="button" variant="outline" disabled={saving} onClick={confirmOriginal}>
              Use original
            </Button>
            <Button type="button" disabled={saving || !area} onClick={confirm} className="gap-1.5">
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Use cropped"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
