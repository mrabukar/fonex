"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export function ProductThumbnail({
  src,
  size = "sm",
}: {
  src: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const boxClass =
    size === "sm" ? "size-12 rounded-xl" : size === "md" ? "size-16 rounded-lg" : "size-40 rounded-xl";
  const iconSize = size === "sm" ? 16 : size === "md" ? 18 : 24;
  const pixelSize = size === "sm" ? 48 : size === "md" ? 64 : 160;
  const failed = Boolean(src && failedSrc === src);

  if (!src || failed) {
    return (
      <div className={`flex ${boxClass} items-center justify-center bg-muted`}>
        <ImageOff size={iconSize} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative ${boxClass} overflow-hidden bg-muted`}>
      <Image
        key={src}
        src={src}
        alt=""
        fill
        sizes={`${pixelSize}px`}
        className="object-cover"
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
}
