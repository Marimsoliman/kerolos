import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb"; // ✅ استخدم dbConnect بدلاً من clientPromise
import Project from "@/models/Project"; // ✅ استخدم Model

// GET - للمستخدمين العاديين (published only)
export async function GET(request: NextRequest) {
  try {
    await dbConnect(); // ✅ اتصل بقاعدة البيانات
    const projects = await Project.find({ published: true })
      .sort({ order: 1, year: -1 })
      .lean(); // ✅ استخدم Mongoose
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error("🔥 [API ERROR]:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - إنشاء مشروع جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      category,
      year,
      tags,
      image,
      images,
      projectSummary,
      client,
      service,
      published,
      order,
    } = body;

    if (!id || !name || !category || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect(); // ✅ اتصل بقاعدة البيانات
    const existing = await Project.findOne({ id });
    if (existing) {
      return NextResponse.json(
        { error: "Project ID already exists" },
        { status: 400 }
      );
    }

    const newProject = await Project.create({
      id,
      name,
      category,
      year: String(year),
      tags: tags || [],
      image,
      images: images || [],
      projectSummary: projectSummary || "",
      shortDescription: projectSummary || "",
      description: projectSummary || "",
      client: client || name,
      service: service || category,
      published: published || false,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: newProject._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}