import mongoose from "mongoose";
import dbConnect from "./mongodb";
import Product from "@/models/Product";

export interface ProductType {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  shortDescription?: string;
  description?: string;
  features?: string[];
  published: boolean;
  order?: number;
  createdAt?: Date;
}

export async function getPublishedProducts(): Promise<ProductType[]> {
  try {
    await dbConnect();
    const products = await Product.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      id: p.id || p._id.toString(),
    }));
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    await dbConnect();

    const query: any = { published: true };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or = [{ id }, { _id: new mongoose.Types.ObjectId(id) }];
    } else {
      query.id = id;
    }

    const product = await Product.findOne(query).lean();
    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
      id: product.id || product._id.toString(),
    } as ProductType;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
}

export async function getAllProducts(): Promise<ProductType[]> {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ order: 1 }).lean();

    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      id: p.id || p._id.toString(),
    }));
  } catch (error) {
    console.error("❌ Error fetching all products:", error);
    return [];
  }
}
