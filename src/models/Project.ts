import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  id: string;
  name: string;
  category: string;
  year: string;
  image: string;
  images?: string[];
  projectSummary?: string;
  shortDescription?: string;
  description?: string;
  client?: string;
  service?: string;
  tags?: string[];
  published: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: String, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  projectSummary: { type: String, default: "" },
  shortDescription: { type: String, default: "" },
  description: { type: String, default: "" },
  client: { type: String, default: "" },
  service: { type: String, default: "" },
  tags: { type: [String], default: [] },
  published: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);