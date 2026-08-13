import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  shortDescription?: string;
  description?: string;
  features?: string[];
  published: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: "" },
  image: { type: String, default: "" },
  images: { type: [String], default: [] },
  shortDescription: { type: String, default: "" },
  description: { type: String, default: "" },
  features: { type: [String], default: [] },
  published: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
