// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { projects as staticProjects } from "@/lib/data";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const results = [];
    for (let i = 0; i < staticProjects.length; i++) {
      const p = staticProjects[i];
      const existing = await Project.findOne({ id: p.id });
      if (existing) {
        results.push({ id: p.id, status: "skipped (already exists)" });
        continue;
      }
      await Project.create({
        id: p.id,
        name: p.name,
        category: p.category,
        year: p.year,
        tags: p.tags,
        image: p.image,
        images: p.images,
        shortDescription: p.shortDescription,
        description: p.description,
        overview: p.overview,
        challenge: p.challenge,
        strategy: p.strategy,
        concept: p.concept,
        gradientClass: p.gradientClass,
        initial: p.initial,
        colors: p.colors,
        typography: p.typography,
        order: i,
        published: true,
      });
      results.push({ id: p.id, status: "created" });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("SEED ERROR:", error);
    return NextResponse.json(
      { error: "Seed failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}