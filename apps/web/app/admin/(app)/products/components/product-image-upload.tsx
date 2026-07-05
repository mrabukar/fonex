"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { ProductThumbnail } from "./product-thumbnail";
import {
  formatFileSize,
  validateImageFile,
  verifyPublicImage,
} from "./product-form-utils";

export interface ProductImageUploadProps {
  productId: string;
  imageUrl: string | null;
  onUploaded: (imageUrl: string) => void;
  disabled?: boolean;
  onPendingChange?: (hasPending: boolean) => void;
}

export function ProductImageUpload({
  productId,
  imageUrl,
  onUploaded,
  disabled = false,
  onPendingChange,
}: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onPendingChange?.(Boolean(pendingFile));
  }, [pendingFile, onPendingChange]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function clearPending() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function savePhoto() {
    if (!pendingFile) return;

    setUploading(true);
    try {
      const { uploadUrl, imageUrl: newImageUrl } = await apiClient.post<{
        uploadUrl: string;
        imageUrl: string;
      }>(`/api/products/${productId}/image-upload-url`, {
        contentType: pendingFile.type,
      });

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": pendingFile.type },
        body: pendingFile,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      const loads = await verifyPublicImage(newImageUrl);
      if (!loads) {
        throw new Error("Uploaded image could not be loaded from storage");
      }

      clearPending();
      onUploaded(newImageUrl);
      toast.success("Photo saved");
    } catch {
      toast.error("Failed to save photo");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 ">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Choose product photo"
        onChange={onFileSelected}
      />

      {pendingFile && previewUrl ? (
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#E7EAF3] bg-[#FAFBFD] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            New photo preview
          </p>
          <div className="flex w-full min-w-0 flex-col gap-4">
            <div className="relative mx-auto size-36 shrink-0 overflow-hidden rounded-xl bg-muted sm:mx-0 sm:size-40">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex w-full min-w-0 flex-col gap-3">
              <div className="min-w-0">
                <p className="break-all text-sm font-medium text-foreground">
                  {pendingFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(pendingFile.size)}
                </p>
              </div>
              {imageUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Current photo:
                  </span>
                  <ProductThumbnail src={imageUrl} size="sm" />
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  size="sm"
                  disabled={uploading || disabled}
                  onClick={savePhoto}
                  className="gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Save photo
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading || disabled}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose different
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={uploading || disabled}
                  onClick={clearPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {imageUrl ? (
            <div className="flex items-center gap-3">
              <ProductThumbnail src={imageUrl} size="lg" />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Current product photo
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-fit gap-1.5"
                >
                  <Upload size={14} />
                  Replace photo
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D5DBEA] bg-[#FAFBFD] px-6 py-8 text-center transition-colors hover:border-[#1A1C74]/30 hover:bg-[#EEF1FB]/50 disabled:pointer-events-none disabled:opacity-50"
            >
              <ImagePlus size={28} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Choose a photo
              </span>
              <span className="text-xs text-muted-foreground">
                JPEG, PNG, or WebP · max 5MB
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
