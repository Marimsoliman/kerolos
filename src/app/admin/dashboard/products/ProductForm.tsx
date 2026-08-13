"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFiles } from "@/utils/uploadthing";
import imageCompression from "browser-image-compression";

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: {
    _id?: string;
    id?: string;
    name?: string;
    price?: number;
    category?: string;
    image?: string;
    shortDescription?: string;
    description?: string;
    features?: string[];
    published?: boolean;
  };
}

// ⚡ ضغط الصورة بس لو مش GIF (عشان نحافظ على حركة الـ GIF)
const compressIfNeeded = async (file: File): Promise<File> => {
  const isGif =
    file.type === "image/gif" ||
    (file.type === "application/octet-stream" && file.name.toLowerCase().endsWith(".gif")) ||
    file.name.toLowerCase().endsWith(".gif");
  if (isGif) return file;
  if (file.size < 500 * 1024) return file;
  try {
    return (await imageCompression(file, {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      initialQuality: 0.8,
      useWebWorker: true,
    })) as File;
  } catch {
    return file;
  }
};

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none";
const labelCls = "mb-2 block text-sm font-semibold text-gray-700";

export default function ProductForm({ mode, initial }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: initial?.id || "",
    name: initial?.name || "",
    price: initial?.price?.toString() || "",
    category: initial?.category || "",
    image: initial?.image || "",
    shortDescription: initial?.shortDescription || "",
    description: initial?.description || "",
    features: (initial?.features || []).join("\n"),
    published: initial?.published ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileToUpload = await compressIfNeeded(file);
      const res = await uploadFiles("imageUploader", { files: [fileToUpload] });
      if (res?.[0]?.url) update("image", res[0].url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const priceNum = Number(form.price);
    if (!form.name.trim()) return setError("اسم المنتج مطلوب");
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return setError("السعر لازم يكون رقم أكبر من 0");
    if (mode === "create" && !form.id.trim())
      return setError("الـ slug مطلوب (مثال: brand-guideline)");

    const payload = {
      id: form.id.trim().toLowerCase().replace(/\s+/g, "-"),
      name: form.name.trim(),
      price: priceNum,
      category: form.category.trim(),
      image: form.image,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      published: form.published,
    };

    setSubmitting(true);
    try {
      const url =
        mode === "create"
          ? "/api/products"
          : `/api/products/${initial?._id || initial?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "فشل الحفظ");
        return;
      }
      router.push("/admin/dashboard/products");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Name *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Brand Guideline Template"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Slug (ID) {mode === "create" ? "*" : ""}</label>
          <input
            className={`${inputCls} ${mode === "edit" ? "bg-gray-100" : ""}`}
            value={form.id}
            onChange={(e) => update("id", e.target.value)}
            placeholder="brand-guideline-template"
            disabled={mode === "edit"}
          />
        </div>

        <div>
          <label className={labelCls}>Price (EGP) *</label>
          <input
            className={inputCls}
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="350"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Category</label>
          <input
            className={inputCls}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="Template"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Short Description</label>
          <textarea
            className={inputCls}
            rows={2}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            placeholder="A short one-line description shown on the product card"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea
            className={inputCls}
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Full description. Use one line per paragraph."
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>
            Features (one per line)
          </label>
          <textarea
            className={inputCls}
            rows={4}
            value={form.features}
            onChange={(e) => update("features", e.target.value)}
            placeholder={"Editable layers\nCMYK + RGB\nPrint ready"}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Product Image</label>
          <div className="flex items-start gap-4">
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt="preview"
                className="w-28 h-20 object-cover rounded-lg border border-gray-200"
              />
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 hover:border-accent hover:text-accent transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              {uploading ? "Uploading..." : "Upload image"}
            </label>
          </div>
        </div>

        <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="w-4 h-4 accent-[#8B5CF6]"
          />
          <span className="text-sm font-medium text-gray-700">
            Published (visible in shop)
          </span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/products")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
