// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ الأنواع المسموحة فقط
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // ✅ حماية 1: لازم يكون أدمن مسجل دخول
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ حماية 2: التحقق من نوع الملف
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images allowed." },
        { status: 400 }
      );
    }

    // ✅ حماية 3: التحقق من حجم الملف
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ حماية 4: تنظيف اسم الملف من أي حاجة خطيرة
    // ده بيمنع هجمات زي: ../../etc/passwd
    const safeName = file.name
      .replace(/[^a-zA-Z0-9.\-_]/g, "-") // شيل أي رموز غريبة
      .replace(/\.{2,}/g, ".")            // شيل النقط المتكررة
      .substring(0, 100);                 // حد أقصى لطول الاسم

    const timestamp = Date.now();
    const filename = `${timestamp}-${safeName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // ✅ حماية 5: تأكد إن المسار النهائي جوه مجلد uploads فعلاً
    const filepath = path.join(uploadDir, filename);
    if (!filepath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}