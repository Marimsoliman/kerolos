// src/app/admin/dashboard/edit/[id]/EditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { uploadFiles } from "@/utils/uploadthing";

export default function EditProjectForm({ project }: { project: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    projectId: project.id || "",
    name: project.name || "",
    category: project.category || "",
    year: project.year || new Date().getFullYear().toString(),
    tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
    image: project.image || "",
    images: Array.isArray(project.images) ? project.images : [],
    projectSummary: project.projectSummary || project.shortDescription || project.description || "",
    client: project.client || project.name || "",
    service: project.service || project.category || "",
    published: !!project.published,
    order: typeof project.order === "number" ? project.order : 0,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ⚡ دالة ذكية للضغط - بتتجاهل GIF تماماً
  const compressIfNeeded = async (file: File): Promise<File> => {
    // ⚡ لو GIF (حسب نوع MIME أو الامتداد)، ارجعه زي ما هو بدون أي تعديل
    const isGif =
      file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
    if (isGif) {
      console.log(`🎬 GIF detected (${file.name}) - skipping compression`);
      return file;
    }

    // ⚡ لو الصورة أصغر من 500KB، ما تضغطهاش
    if (file.size < 500 * 1024) {
      console.log(`✅ Small file (${(file.size / 1024).toFixed(2)}KB) - skipping compression`);
      return file;
    }

    console.log(`📦 Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)...`);

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
      // ⚡ احتفظ بنوع الملف الأصلي (لا تحوّل لـ WebP)
      fileType: file.type,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type, // ⚡ نفس النوع الأصلي
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

  // ⚡ 1. رفع الصورة الرئيسية
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
        console.log(`✅ Main image uploaded: ${res[0].url}`);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload main image: " + err.message);
    } finally {
      setUploadingMain(false);
    }
  };

  // ⚡ 2. رفع صور المعرض
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingGallery(true);
      setError("");

      // ⚡ ضغط الصور بالتوازي (لكن GIF يُستثنى)
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
        console.log(`✅ Uploaded ${newUrls.length} images to gallery`);
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
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.category || !formData.image) {
      setError("Please fill all required fields (*)");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${encodeURIComponent(formData.projectId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          year: String(formData.year),
          tags: formData.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean),
          image: formData.image,
          images: formData.images,
          projectSummary: formData.projectSummary,
          client: formData.client,
          service: formData.service,
          published: formData.published,
          order: Number(formData.order),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update project");

      alert("✅ Project updated successfully!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 pt-28 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 text-sm text-accent hover:underline font-medium font-sans inline-flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-4xl font-bold text-black font-display">Edit Project</h1>
          <p className="mt-2 text-gray-600 font-sans">
            Update details for &ldquo;{formData.name}&rdquo;
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 font-sans text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">Project ID</label>
            <input
              type="text"
              value={formData.projectId}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Project Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
                Category <span className="text-accent">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-accent font-sans"
                required
              >
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">Order Position</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => updateField("order", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="e.g. branding, logo, minimal"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans"
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700 font-sans">
              Main Image <span className="text-accent">*</span>
            </label>
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 bg-gray-50 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                disabled={uploadingMain}
                className="hidden"
                id="edit-main-image-upload"
              />
              <label
                htmlFor="edit-main-image-upload"
                className={`cursor-pointer inline-block px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition ${
                  uploadingMain ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingMain ? "⏳ Uploading..." : "📤 Upload Main Image"}
              </label>
              <p className="text-xs text-gray-500 mt-2 font-sans">
                🎬 <strong>GIF files keep animation</strong> • Other images auto-compressed
              </p>

              {formData.image && (
                <div className="mt-6 group relative overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={formData.image}
                    alt="Main"
                    className="h-64 w-full rounded-xl object-cover"
                  />
                  {formData.image.toLowerCase().endsWith(".gif") && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      GIF
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => updateField("image", "")}
                    className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 font-bold"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700 font-sans">
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
                id="edit-gallery-image-upload"
              />
              <label
                htmlFor="edit-gallery-image-upload"
                className={`cursor-pointer inline-block px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition ${
                  uploadingGallery ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingGallery ? "⏳ Uploading..." : "📤 Add Gallery Images"}
              </label>
              <p className="text-xs text-gray-500 mt-2 font-sans">
                Select multiple images • GIF animations preserved
              </p>

              {formData.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {formData.images.map((url: string, index: number) => (
                    <div
                      key={`${url}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-gray-200"
                    >
                      <img src={url} alt={`Gallery ${index + 1}`} className="h-40 w-full object-cover" />

                      {url.toLowerCase().endsWith(".gif") && (
                        <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          GIF
                        </div>
                      )}

                      <div className="absolute left-2 bottom-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, "up")}
                          disabled={index === 0}
                          className="rounded-full bg-black/70 px-2 py-1 text-xs text-white disabled:opacity-30 hover:bg-black transition"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, "down")}
                          disabled={index === formData.images.length - 1}
                          className="rounded-full bg-black/70 px-2 py-1 text-xs text-white disabled:opacity-30 hover:bg-black transition"
                        >
                          ↓
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">
              Project Summary
            </label>
            <textarea
              value={formData.projectSummary}
              onChange={(e) => updateField("projectSummary", e.target.value)}
              rows={6}
              placeholder="Brief description of the project..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans leading-relaxed"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">Client</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => updateField("client", e.target.value)}
                placeholder="Client name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 font-sans">Service</label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) => updateField("service", e.target.value)}
                placeholder="Service provided"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-accent font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => updateField("published", e.target.checked)}
              className="h-4 w-4 accent-accent"
              id="publish-checkbox"
            />
            <label htmlFor="publish-checkbox" className="text-sm text-gray-700 font-medium font-sans">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100 font-medium font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-6 py-3 text-white transition hover:opacity-90 disabled:opacity-50 font-medium font-sans"
            >
              {loading ? "💾 Saving..." : "✅ Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}