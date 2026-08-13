// src/components/SmartImage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface SmartImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  aspectRatio?: string;
  sizes?: string;
  className?: string;
}

export default function SmartImage({
  src,
  alt,
  priority = false,
  aspectRatio = "16/9",
  sizes = "100vw",
  className = "",
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const getAspectRatioPadding = () => {
    if (aspectRatio === "auto") return undefined;
    const [w, h] = aspectRatio.split("/").map(Number);
    return `${(h / w) * 100}%`;
  };

  const padding = getAspectRatioPadding();

  return (
    <div
      className="relative overflow-hidden bg-[#F2F2F0]"
      style={padding ? { paddingBottom: padding } : undefined}
    >
      <Image
        src={src || "/placeholder.jpg"}
        alt={alt}
        fill={!!padding}
        width={!padding ? 1920 : undefined}
        height={!padding ? 1080 : undefined}
        sizes={sizes}
        priority={priority}
        unoptimized={true} // ⚡ التحميل الفوري المباشر من الـ CDN
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 object-contain ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        style={!padding ? { width: "100%", height: "auto" } : undefined}
      />
    </div>
  );
}