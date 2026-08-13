import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

function buildLookupQuery(projectId: string) {
  // ✅ Only add _id if the value is a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(projectId)) {
    return {
      $or: [
        { id: projectId },
        { _id: new mongoose.Types.ObjectId(projectId) }
      ]
    };
  }
  
  // Otherwise, only search by custom 'id' field
  return { id: projectId };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const projectId = decodeURIComponent(id);

    console.log("🔍 Looking for project:", projectId);

    const project = await Project.findOne(buildLookupQuery(projectId)).lean();

    if (!project) {
      console.log("❌ Project not found");
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("✅ Project found:", project.name);

    return NextResponse.json(project);
  } catch (error) {
    console.error("❌ GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const projectId = decodeURIComponent(id);
    const body = await request.json();

    const updatedProject = await Project.findOneAndUpdate(
      buildLookupQuery(projectId),
      { ...body, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("❌ PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const projectId = decodeURIComponent(id);

    const deletedProject = await Project.findOneAndDelete(buildLookupQuery(projectId));

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}