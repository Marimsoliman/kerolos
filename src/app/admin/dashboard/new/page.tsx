// src/app/admin/dashboard/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { uploadFiles } from "@/utils/uploadthing";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    category: "",
    year: new Date().getFullYear().toString(),
    tags: "",
    image: "",
    images: [] as string[],
    projectSummary: "",
    client: "",
    service: "",
    published: false,
  });

  const updateField = (
    field: keyof typeof formData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ⚡ دالة ذكية للضغط - GIF يُستثنى نهائياً (canvas يحوّل GIF لصورة ثابتة)
  const compressIfNeeded = async (file: File): Promise<File> => {
    // 🎬 لو GIF (حسب نوع MIME أو الامتداد)، ارجعه بدون أي تعديل للحفاظ على الحركة
    const isGif =
      file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
    if (isGif) {
      console.log(`🎬 GIF detected (${file.name}) - skipping compression`);
      return file;
    }

    // لو الصورة أصغر من 500KB، ما تضغطهاش
    if (file.size < 500 * 1024) {
      console.log(`✅ Small file (${(file.size / 1024).toFixed(2)}KB) - skipping compression`);
      return file;
    }

    console.log(`📦 Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)...`);

    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
      // احتفظ بنوع الملف الأصلي (لا تحوّل لـ WebP)
      fileType: file.type,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type, // نفس النوع الأصلي
      });

      console.log(
        `✅ Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );

      return compressedFile;
    } catch (err) {
      console.error("Compression failed:", err);
      return file; // لو الضغط فشل، ارجع الملف الأصلي
    }
  };

  // ⚡ 1. ضغط ورفع الصورة الرئيسية تلقائياً
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMain(true);
      setError("");

      const fileToUpload = await compressIfNeeded(file);

      const res = await uploadFiles("imageUploader", {
        files: [fileToUpload],
      });

      if (res?.[0]?.url) {
        updateField("image", res[0].url);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload main image: " + err.message);
    } finally {
      setUploadingMain(false);
    }
  };

  // ⚡ 2. ضغط ورفع صور المعرض بالتوازي تلقائياً
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingGallery(true);
      setError("");

      // ضغط الصور بالتوازي (لكن GIF يُستثنى نهائياً)
      const processedFiles = await Promise.all(files.map((file) => compressIfNeeded(file)));

      const res = await uploadFiles("imageUploader", {
        files: processedFiles,
      });

      if (res && res.length > 0) {
        const newUrls = res.map((f) => f.url);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newUrls],
        }));
      }
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      setError("Failed to upload gallery images: " + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      [newImages[index], newImages[targetIndex]] = [
        newImages[targetIndex],
        newImages[index],
      ];
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.projectId) {
      setError("Project ID is required");
      return;
    }
    if (!formData.name) {
      setError("Project Name is required");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (!formData.image) {
      setError("Main Image is required");
      return;
    }

    try {
      setLoading(true);

      let maxOrder = 0;
      try {
        const res = await fetch("/api/projects/all");
        if (res.ok) {
          const existingProjects = await res.json();
          if (Array.isArray(existingProjects) && existingProjects.length > 0) {
            maxOrder = Math.max(...existingProjects.map((p: any) => p.order || 0));
          }
        }
      } catch (err) {
        console.warn("Could not fetch existing projects for order calculation");
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.projectId,
          name: formData.name,
          category: formData.category,
          year: formData.year,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          image: formData.image,
          images: formData.images,
          projectSummary: formData.projectSummary,
          client: formData.client,
          service: formData.service,
          published: formData.published,
          order: maxOrder + 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      alert("✅ Project created successfully!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 pt-28 md:pt-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-sm text-accent hover:underline font-medium font-sans inline-flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-3xl font-bold text-black font-display">
            Create New Project
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-accent-dark font-sans">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          {/* Project ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Project ID <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={formData.projectId}
              onChange={(e) => {
                const slug = e.target.value
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                updateField("projectId", slug);
              }}
              placeholder="elsalam-group"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
              required
            />
            <p className="mt-1 text-xs text-gray-500 font-sans">
              This will be used in the URL (e.g., /work/elsalam-group)
            </p>
          </div>

          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Project Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Elsalam Group"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
              required
            />
          </div>

          {/* Category + Year */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
                Category <span className="text-accent">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
                required
              >
                <option value="">Select category</option>
                <option value="Brand Identity">Brand Identity</option>
                <option value="Visual Identity">Visual Identity</option>
                <option value="Logo Design">Logo Design</option>
                <option value="Art Direction">Art Direction</option>
                <option value="Creative Direction">Creative Direction</option>
                <option value="Packaging">Packaging</option>
                <option value="Editorial">Editorial</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
                Year <span className="text-accent">*</span>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => updateField("year", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="Branding, Logo Design, Visual Identity"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
            />
            <p className="mt-1 text-xs text-gray-500 font-sans">
              Separate tags with commas
            </p>
          </div>

          {/* Main Image (مع الضغط التلقائي) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Main Image <span className="text-accent">*</span>
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 bg-gray-50 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                disabled={uploadingMain}
                className="hidden"
                id="new-main-image-upload"
              />
              <label
                htmlFor="new-main-image-upload"
                className={`cursor-pointer inline-block px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition ${
                  uploadingMain ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingMain ? "Compressing & Uploading..." : "Choose & Compress Main Image"}
              </label>
              <p className="text-xs text-gray-500 mt-2 font-sans">
                🎬 <strong>GIF files keep animation</strong> • Other images auto-compressed (~80% smaller)
              </p>

              {formData.image && (
                <div className="mt-6 group relative overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={formData.image}
                    alt="Main"
                    className="h-48 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("image", "")}
                    className="absolute right-2 top-2 rounded-full bg-accent px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images (مع الضغط التلقائي) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Gallery Images
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 bg-gray-50 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="hidden"
                id="new-gallery-image-upload"
              />
              <label
                htmlFor="new-gallery-image-upload"
                className={`cursor-pointer inline-block px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition ${
                  uploadingGallery ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingGallery ? "Compressing & Uploading..." : "Add Gallery Images (Multiple)"}
              </label>
              <p className="text-xs text-gray-500 mt-2 font-sans">
                Select multiple images • 🎬 GIF animations preserved
              </p>

              {formData.images.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <div className="absolute top-1 left-1 flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, "up")}
                          disabled={index === 0}
                          className="bg-black/70 text-white px-1.5 py-0.5 rounded text-xs disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, "down")}
                          disabled={index === formData.images.length - 1}
                          className="bg-black/70 text-white px-1.5 py-0.5 rounded text-xs disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-accent text-white px-2 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-bold text-black mb-4 font-display">
              Project Information
            </h3>
          </div>

          {/* Project Summary */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Project Summary
            </label>
            <textarea
              value={formData.projectSummary}
              onChange={(e) => updateField("projectSummary", e.target.value)}
              placeholder="Describe the project in detail..."
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans leading-relaxed"
            />
          </div>

          {/* Client */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Client
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => updateField("client", e.target.value)}
              placeholder="Elsalam Group"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
            />
          </div>

          {/* Service */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Service
            </label>
            <input
              type="text"
              value={formData.service}
              onChange={(e) => updateField("service", e.target.value)}
              placeholder="Visual Identity"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none font-sans"
            />
          </div>

          {/* Publish */}
          <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => updateField("published", e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            <label className="text-sm text-gray-700 font-sans font-medium">
              Publish immediately
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-sans font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50 font-sans font-medium"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}