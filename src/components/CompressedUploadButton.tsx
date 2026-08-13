// src/components/CompressedUploadButton.tsx
"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { uploadFiles } from "@/utils/uploadthing";

interface Props {
  multiple?: boolean;
  onComplete: (urls: string[]) => void;
  onError?: (message: string) => void;
  label?: string;
}

export default function CompressedUploadButton({
  multiple = false,
  onComplete,
  onError,
  label = "Choose Image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);

      // ✅ إعدادات الضغط — 400KB كحد أقصى، عرض 1600px
      const options = {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: "image/webp" as const, // WebP أخف 30% من JPEG
      };

      // ضغط كل الصور بالتوازي
      setProgress(`Compressing ${files.length} image(s)...`);
      const compressed = await Promise.all(
        files.map(async (file) => {
          const result = await imageCompression(file, options);
          // نحافظ على اسم الملف بامتداد webp
          return new File(
            [result],
            file.name.replace(/\.[^.]+$/, ".webp"),
            { type: "image/webp" }
          );
        })
      );

      // لوج بسيط يوريكي الفرق
      const originalMB = files.reduce((s, f) => s + f.size, 0) / 1024 / 1024;
      const compressedMB = compressed.reduce((s, f) => s + f.size, 0) / 1024 / 1024;
      console.log(
        `📦 ${originalMB.toFixed(1)}MB → ${compressedMB.toFixed(1)}MB`
      );

      // رفع الصور المضغوطة
      setProgress(`Uploading ${compressed.length} image(s)...`);
      const res = await uploadFiles("imageUploader", { files: compressed });

      const urls = res.map((f) => f.url).filter(Boolean);
      if (urls.length > 0) onComplete(urls);
    } catch (err) {
      console.error("Upload error:", err);
      onError?.(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = ""; // نفضي الـ input عشان ينفع يرفع نفس الملف تاني
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
        id={`compressed-upload-${multiple ? "multi" : "single"}`}
      />
      <label
        htmlFor={`compressed-upload-${multiple ? "multi" : "single"}`}
        className={`inline-block cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm text-white font-sans transition hover:opacity-90 ${
          uploading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {uploading ? progress || "Working..." : label}
      </label>
      <p className="mt-2 text-xs text-gray-500 font-sans">
        Images are compressed automatically before upload
      </p>
    </div>
  );
}