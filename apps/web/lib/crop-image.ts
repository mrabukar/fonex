import type { Area } from "react-easy-crop";

export const CROP_ASPECT_WIDE = 16 / 9;
export const CROP_ASPECT_SQUARE = 1;
export const CROP_ASPECT_TALL = 9 / 16;
export const CROP_ASPECT = CROP_ASPECT_WIDE;
export const CROP_MAX_EDGE = 1920;
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

export function aspectToHeightT(
  aspect: number,
  tall = CROP_ASPECT_TALL,
  wide = CROP_ASPECT_WIDE,
): number {
  if (wide <= tall) return 0;
  const clamped = Math.min(wide, Math.max(tall, aspect));
  return (wide - clamped) / (wide - tall);
}

export function heightTToAspect(
  t: number,
  tall = CROP_ASPECT_TALL,
  wide = CROP_ASPECT_WIDE,
): number {
  const clamped = Math.min(1, Math.max(0, t));
  return wide + (tall - wide) * clamped;
}

function outputSizeForCrop(crop: Area): { width: number; height: number } {
  const srcW = Math.max(1, crop.width);
  const srcH = Math.max(1, crop.height);
  const scale = Math.min(1, CROP_MAX_EDGE / Math.max(srcW, srcH));
  return {
    width: Math.max(1, Math.round(srcW * scale)),
    height: Math.max(1, Math.round(srcH * scale)),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that image"));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not save the cropped image"));
      },
      type,
      quality,
    );
  });
}

export async function getCroppedImageFile(
  imageSrc: string,
  crop: Area,
  originalName: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const { width, height } = outputSizeForCrop(crop);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop this image");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height,
  );

  let blob: Blob;
  try {
    blob = await canvasToBlob(canvas, "image/webp", 0.85);
  } catch {
    blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
  }

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const base = originalName.replace(/\.[^.]+$/g, "").replace(/\s+/g, "-").slice(0, 60);
  return new File([blob], `${base || "homepage-image"}.${ext}`, { type: blob.type });
}

export function titleFromFilename(name: string): string {
  let base = name.trim();
  for (let i = 0; i < 3; i++) {
    base = base.replace(/\.(jpe?g|png|webp|gif)$/i, "");
  }
  const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 80) || "Homepage image";
}

export function isLegacyHomepageImage(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("/"));
}

export async function validateHomepageSource(file: File): Promise<string | null> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return "Only JPEG, PNG, or WebP images are allowed";
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return "Image must be under 15MB";
  }
  if (file.size < 100) {
    return "Image file looks invalid — please choose a real photo";
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read that image"));
      img.src = url;
    });
    if (image.naturalWidth < 1 || image.naturalHeight < 1) {
      return "Image file looks invalid — please choose a real photo";
    }
    return null;
  } catch {
    return "Could not read that image";
  } finally {
    URL.revokeObjectURL(url);
  }
}
