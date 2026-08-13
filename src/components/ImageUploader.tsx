// src/components/ImageUploader.tsx
"use client";

import { useState } from "react";
import { uploadFiles } from "@/utils/uploadthing";
import imageCompression from "browser-image-compression";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (status: boolean) => void;
}

export default function ImageUploader({ value, onChange, onUploading }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      onUploading?.(true);
      setProgress(30);

      // ضغط الصورة
      const options = {
        maxSizeMB: 1, // الحد الأقصى 1MB
        maxWidthOrHeight: 1920, // الحد الأقصى للعرض أو الارتفاع
        useWebWorker: true,
        fileType: "image/jpeg",
      };

      setProgress(50);
      const compressedFile = await imageCompression(file, options);
      setProgress(70);

      console.log("Original size:", (file.size / 1024 / 1024).toFixed(2), "MB");
      console.log("Compressed size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");

      // رفع الصورة المضغوطة عن طريق الـ helper المولّد (generateReactHelpers)
      const res = await uploadFiles("imageUploader", {
        files: [compressedFile as File],
      });

      if (res?.[0]?.url) {
        onChange(res[0].url);
        setProgress(100);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      onUploading?.(false);
      setProgress(0);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="h-64 w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="main-image-upload"
          />

          <label
            htmlFor="main-image-upload"
            className={`cursor-pointer inline-block px-6 py-3 bg-[#6D28D9] text-white rounded-lg hover:opacity-90 transition ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? `Uploading... ${progress}%` : "Choose Image"}
          </label>

          {uploading && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#6D28D9] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <p className="text-xs text-gray-500 mt-3">
            Images will be automatically compressed
          </p>
        </div>
      )}
    </div>
  );
}