import mongoose from "mongoose";
import dbConnect from "./mongodb";
import Project from "@/models/Project";

export interface ProjectType {
  _id: string;
  id: string;
  name: string;
  category: string;
  year: string;
  image: string;
  shortDescription?: string;
  description?: string;
  projectSummary?: string;
  client?: string;
  service?: string;
  tags?: string[];
  images: string[];
  published: boolean;
  gradientClass?: string;
  initial?: string;
  overview?: string;
  challenge?: string;
  concept?: string;
  strategy?: string;
  colors?: { name: string; hex: string }[];
  typography?: {
    primary: string;
    secondary: string;
    description: string;
  };
  createdAt?: Date;
}

export async function getPublishedProjects(): Promise<ProjectType[]> {
  try {
    await dbConnect();
    
    const projects = await Project.find({ published: true })
      .sort({ order: 1, year: -1 })
      .lean();

    return projects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      id: p.id || p._id.toString(),
    }));
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectType | null> {
  try {
    await dbConnect();

    // ✅ Build query safely
    const query: any = { published: true };

    // Only add _id to query if the value is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or = [{ id }, { _id: new mongoose.Types.ObjectId(id) }];
    } else {
      // If not a valid ObjectId, only search by custom 'id' field
      query.id = id;
    }

    console.log("🔍 Query:", JSON.stringify(query));

    const project = await Project.findOne(query).lean();

    if (!project) {
      console.log("❌ Project not found for id:", id);
      return null;
    }

    console.log("✅ Project found:", project.name);

    return {
      ...project,
      _id: project._id.toString(),
      id: project.id || project._id.toString(),
    } as ProjectType;
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    return null;
  }
}

export async function getAllProjects(): Promise<ProjectType[]> {
  try {
    await dbConnect();
    
    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .lean();

    return projects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      id: p.id || p._id.toString(),
    }));
  } catch (error) {
    console.error("❌ Error fetching all projects:", error);
    return [];
  }
}