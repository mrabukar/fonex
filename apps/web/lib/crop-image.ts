import type { Area } from "react-easy-crop";

export const CROP_ASPECT = 16 / 9;
export const CROP_OUTPUT_WIDTH = 1920;
export const CROP_OUTPUT_HEIGHT = 1080;
export const MIN_SOURCE_EDGE = 800;
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

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
  const canvas = document.createElement("canvas");
  canvas.width = CROP_OUTPUT_WIDTH;
  canvas.height = CROP_OUTPUT_HEIGHT;
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
    CROP_OUTPUT_WIDTH,
    CROP_OUTPUT_HEIGHT,
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
    if (Math.min(image.naturalWidth, image.naturalHeight) < MIN_SOURCE_EDGE) {
      return `Image is too small — use one at least ${MIN_SOURCE_EDGE}px on the short side`;
    }
    return null;
  } catch {
    return "Could not read that image";
  } finally {
    URL.revokeObjectURL(url);
  }
}
