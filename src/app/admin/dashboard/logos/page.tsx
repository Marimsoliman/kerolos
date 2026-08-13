// src/app/admin/dashboard/logos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiArrowLeft, FiUploadCloud, FiLoader, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

interface Logo {
  _id: string;
  src: string;
  name?: string;
  order?: number;
}

export default function LogosAdminPage() {
  const router = useRouter();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const res = await fetch("/api/logos");
      const data = await res.json();
      if (Array.isArray(data)) setLogos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const maxWidth = 350;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedBase64 = canvas.toDataURL("image/png");
          sendLogoToDatabase(optimizedBase64, file.name);
        } else {
          setUploading(false);
        }
      };

      img.onerror = () => {
        alert("ملف صورة غير صالح");
        setUploading(false);
      };
    };

    reader.readAsDataURL(file);
  };

  const sendLogoToDatabase = async (base64Src: string, fileName: string) => {
    try {
      const res = await fetch("/api/logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: base64Src,
          name: fileName || "Logo",
        }),
      });

      if (res.ok) {
        fetchLogos();
      } else {
        alert("فشل في حفظ اللوجو");
      }
    } catch (e) {
      alert("خطأ في الاتصال بالسيرفر");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت تأكد من حذف هذا اللوجو؟")) return;
    try {
      const res = await fetch(`/api/logos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLogos((prev) => prev.filter((logo) => logo._id !== id));
      } else {
        alert("تعذر حذف اللوجو من السيرفر");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const moveLogo = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= logos.length) return;

    const newLogos = [...logos];
    [newLogos[index], newLogos[targetIndex]] = [newLogos[targetIndex], newLogos[index]];

    setLogos(newLogos);

    const items = newLogos.map((logo, i) => ({
      _id: logo._id,
      order: i,
    }));

    try {
      await fetch("/api/logos/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } catch (e) {
      console.error("Failed to save reorder", e);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-28 pb-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Brand Logos Management</h1>

        {/* Upload Box */}
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-12 text-center backdrop-blur-sm">
          <FiUploadCloud className="w-10 h-10 text-white/40 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white mb-1">Upload New Logo</h2>
          <p className="text-xs text-white/50 mb-6">Select any PNG, SVG, or JPG logo image</p>

          <div className="inline-block relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              id="logo-file-input"
              className="hidden"
            />
            <label
              htmlFor="logo-file-input"
              className={`cursor-pointer inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-dark transition ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <>
                  <FiLoader className="animate-spin" /> Saving Logo...
                </>
              ) : (
                "Choose Logo File"
              )}
            </label>
          </div>
        </div>

        {/* Current Logos Grid */}
        <h2 className="text-lg font-bold text-white mb-4">
          Logos List ({logos.length}) — Use arrows to reorder
        </h2>

        {loading ? (
          <p className="text-sm text-white/50">Loading logos...</p>
        ) : logos.length === 0 ? (
          <p className="text-sm text-white/40">No logos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {logos.map((logo, index) => (
              <div
                key={logo._id}
                className="bg-white/5 p-4 rounded-xl border border-white/10 relative flex flex-col items-center justify-center min-h-[130px] group backdrop-blur-sm hover:bg-white/8 hover:border-white/20 transition-all"
              >
                {/* Badge الترتيب */}
                <span className="absolute top-2 left-2 bg-white/10 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  #{index + 1}
                </span>

                {/* صورة اللوجو */}
                <img src={logo.src} alt="Logo" className="max-h-12 w-auto object-contain my-3" />

                {/* تحكم الترتيب */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => moveLogo(index, "left")}
                    disabled={index === 0}
                    className="text-white/40 hover:text-white disabled:opacity-20 transition"
                    title="Move Left"
                  >
                    <FiArrowLeftCircle className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveLogo(index, "right")}
                    disabled={index === logos.length - 1}
                    className="text-white/40 hover:text-white disabled:opacity-20 transition"
                    title="Move Right"
                  >
                    <FiArrowRightCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* زر الحذف */}
                <button
                  type="button"
                  onClick={() => handleDelete(logo._id)}
                  className="absolute top-2 right-2 p-1.5 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition"
                  title="Delete Logo"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}