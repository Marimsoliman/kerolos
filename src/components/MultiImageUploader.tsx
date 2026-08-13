// src/components/MultiImageUploader.tsx
"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadFiles } from "@/utils/uploadthing";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUploader({ value, onChange }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);

      // ضغط كل الصور بالتوازي
      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressionPromises = files.map(async (file) => {
        setUploadProgress(prev => ({ ...prev, [file.name]: 30 }));

        const compressed = await imageCompression(file, compressionOptions);

        setUploadProgress(prev => ({ ...prev, [file.name]: 60 }));

        return compressed as File;
      });

      const compressedFiles = await Promise.all(compressionPromises);

      // رفع الصور المضغوطة عن طريق الـ helper المولّد (generateReactHelpers)
      const uploadedFiles = await uploadFiles("imageUploader", {
        files: compressedFiles,
      });

      const newUrls = uploadedFiles.map(f => f.url);
      onChange([...value, ...newUrls]);

      setUploadProgress({});

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...value];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];

    onChange(newImages);
  };

  return (
    <div>
      <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          disabled={uploading}
          className="hidden"
          id="gallery-upload"
        />

        <label
          htmlFor="gallery-upload"
          className={`cursor-pointer inline-block px-6 py-3 bg-[#6D28D9] text-white rounded-lg hover:opacity-90 transition ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Choose Images"}
        </label>

        <p className="text-xs text-gray-500 mt-3">
          {value.length} image(s) • Select multiple files
        </p>

        {/* Progress bars */}
        {uploading && Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.entries(uploadProgress).map(([name, progress]) => (
              <div key={name} className="text-left">
                <p className="text-xs text-gray-600 mb-1">{name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#6D28D9] h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Preview */}
      {value.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-xl">
              <img
                src={url}
                alt={`Gallery image ${index + 1}`}
                className="h-40 w-full object-cover"
              />

              {/* Controls */}
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, "up")}
                  disabled={index === 0}
                  className="rounded-full bg-black/70 px-2 py-1 text-xs text-white transition disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, "down")}
                  disabled={index === value.length - 1}
                  className="rounded-full bg-black/70 px-2 py-1 text-xs text-white transition disabled:opacity-30"
                >
                  ↓
                </button>
              </div>

              <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                {index + 1}
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-accent/90 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}