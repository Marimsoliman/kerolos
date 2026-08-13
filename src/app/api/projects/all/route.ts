import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// ✅ منع الكاش نهائياً
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const projects = await Project.find({})
      .sort({ order: 1, year: -1 })
      .lean()
      .exec();

    console.log(`📦 API /projects/all: Found ${projects.length} projects`);

    // ✅ إضافة headers لمنع أي browser cache
    return NextResponse.json(
      projects.map((p: any) => ({
        _id: p._id.toString(),
        id: p.id,
        name: p.name,
        category: p.category,
        year: p.year,
        image: p.image,
        images: p.images || [],
        shortDescription: p.shortDescription || p.projectSummary || "",
        projectSummary: p.projectSummary || "",
        client: p.client || p.name,
        service: p.service || p.category,
        tags: p.tags || [],
        published: p.published || false,
        order: p.order || 0,
      })),
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}