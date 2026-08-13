// src/components/OptimizedImage.tsx
"use client";

import { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  aspectRatio?: string;
  debug?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  fill = false,
  priority = false,
  className = "",
  aspectRatio = "4/3",
  debug = false,
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    if (debug) console.log("✅ Image loaded:", currentSrc);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    console.error("❌ Image failed:", currentSrc);
  };

  if (error) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-zinc-900/50 border border-white/5 ${className}`}
        style={fill ? { aspectRatio } : undefined}
      >
        <div className="text-center p-6">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-white/10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-white/30">Image unavailable</p>
          {debug && (
            <button
              onClick={() => window.open(currentSrc, "_blank")}
              className="mt-2 text-xs text-accent hover:underline"
            >
              Test URL
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${fill ? "w-full" : ""}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-zinc-900/30 animate-pulse rounded-lg"
          style={fill ? { aspectRatio } : undefined}
        />
      )}

      {/* ⚡ استخدام img عادي بدل Next/Image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={`
          ${className}
          transition-opacity duration-500
          ${isLoading ? "opacity-0" : "opacity-100"}
          ${fill ? "w-full h-full object-cover" : ""}
        `}
        style={fill ? { aspectRatio } : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}