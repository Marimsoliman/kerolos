// src/components/ImageWithFallback.tsx
"use client";

import { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  aspectRatio?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "/images/placeholder.jpg", // ⚡ حط صورة placeholder في public/images
  alt,
  fill = false,
  priority = false,
  className = "",
  sizes,
  quality = 75,
  aspectRatio = "4/3",
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasFailed(false);
  }, [src]);

  // ⚡ Test image accessibility
  useEffect(() => {
    const img = new window.Image();
    
    const timeout = setTimeout(() => {
      console.warn(`⏱️ Image loading timeout: ${src}`);
      if (!hasFailed) {
        setCurrentSrc(fallbackSrc);
        setHasFailed(true);
      }
    }, 10000); // 10 seconds timeout

    img.onload = () => {
      clearTimeout(timeout);
      console.log(`✅ Image accessible: ${src}`);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      console.error(`❌ Image not accessible: ${src}`);
      setCurrentSrc(fallbackSrc);
      setHasFailed(true);
    };

    img.src = src;

    return () => clearTimeout(timeout);
  }, [src, fallbackSrc, hasFailed]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      quality={quality}
      sizes={sizes}
      aspectRatio={aspectRatio}
      className={className}
      debug={true} // Always debug
    />
  );
}