"use client";

import { useEffect, useMemo, useState } from "react";
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
import { CROP_ASPECT, getCroppedImageFile } from "@/lib/crop-image";

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
  const imageSrc = useMemo(() => URL.createObjectURL(file), [file]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  async function confirm() {
    if (!area) return;
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
      <DialogContent showCloseButton={!saving} className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Frame the image</DialogTitle>
          <DialogDescription>
            {progressLabel ? `${progressLabel}. ` : ""}
            Drag and zoom until the important part is inside the box. This is how the image will look on the homepage.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[min(50vh,420px)] min-h-[240px] overflow-hidden rounded-xl bg-[#0B1226]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={CROP_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) => setArea(croppedAreaPixels)}
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
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {onSkipRemaining ? (
            <Button type="button" variant="ghost" disabled={saving} onClick={onSkipRemaining}>
              Cancel remaining
            </Button>
          ) : (
            <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" disabled={saving || !area} onClick={confirm} className="gap-1.5">
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Use this image"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
