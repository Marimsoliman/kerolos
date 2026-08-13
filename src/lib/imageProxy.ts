/**
 * تنظيف وتحويل روابط الصور لضمان التوافق مع Next.js Image Optimization
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return "";

  // إزالة المسافات والأحرف الغريبة
  let normalized = url.trim();

  // التأكد من وجود بروتوكول
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }

  // ⚡ إصلاح خاص بـ UploadThing URLs
  if (normalized.includes("utfs.io")) {
    // تنظيف أي معاملات زائدة
    normalized = normalized.split("?")[0];
    
    // التأكد من صيغة الرابط الصحيحة
    if (!normalized.includes("/f/")) {
      console.warn("⚠️ Invalid UploadThing URL format:", url);
    }
  }

  return normalized;
}

/**
 * التحقق من صلاحية رابط الصورة
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const normalized = normalizeImageUrl(url);
    const response = await fetch(normalized, {
      method: "HEAD",
      cache: "no-store",
    });
    return response.ok;
  } catch (error) {
    console.error("❌ Image validation failed:", url, error);
    return false;
  }
}

/**
 * الحصول على Fallback URL
 */
export function getFallbackImageUrl(width = 800, height = 600): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23111' width='${width}' height='${height}'/%3E%3Ctext fill='%23333' font-family='sans-serif' font-size='24' dy='50%25' dx='50%25' text-anchor='middle'%3EImage Not Available%3C/text%3E%3C/svg%3E`;
}