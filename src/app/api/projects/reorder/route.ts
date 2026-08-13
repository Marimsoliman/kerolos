import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projects } = await request.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await dbConnect();

    // Update order for each project
    await Promise.all(
      projects.map((p: { id: string; order: number }) =>
        Project.updateOne({ id: p.id }, { $set: { order: p.order } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder projects" },
      { status: 500 }
    );
  }
}