import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - كل المنتجات (أدمن فقط)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const products = await Product.find({}).sort({ order: 1, createdAt: -1 }).lean().exec();

    const clean = products.map((p: any) => ({
      _id: p._id.toString(),
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      images: p.images || [],
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      features: p.features || [],
      published: p.published,
      order: p.order,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(clean, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("🔥 [API ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
