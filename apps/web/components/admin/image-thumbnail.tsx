"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export function ImageThumbnail({
  src,
  size = "sm",
}: {
  src: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const boxClass =
    size === "sm" ? "rounded-xl" : size === "md" ? "rounded-lg" : "rounded-xl";
  const iconSize = size === "sm" ? 16 : size === "md" ? 18 : 24;
  const pixelSize = size === "sm" ? 48 : size === "md" ? 64 : 160;

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${boxClass}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        <ImageOff size={iconSize} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      key={src}
      src={src}
      alt=""
      width={pixelSize}
      height={pixelSize}
      sizes={`${pixelSize}px`}
      className={`bg-muted object-cover ${boxClass}`}
      style={{ width: pixelSize, height: pixelSize }}
      onError={() => setFailed(true)}
    />
  );
}
