import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// GET - المنتجات المنشورة فقط (للعرض العام)
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("🔥 [API ERROR]:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - إنشاء منتج جديد (أدمن فقط)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, price, category, image, images, shortDescription, description, features, published, order } = body;

    if (!id || !name || typeof price !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();
    const existing = await Product.findOne({ id });
    if (existing) {
      return NextResponse.json(
        { error: "Product ID already exists" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      id,
      name,
      price,
      category: category || "",
      image: image || "",
      images: images || [],
      shortDescription: shortDescription || "",
      description: description || "",
      features: features || [],
      published: published ?? false,
      order: order ?? 0,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("🔥 [API ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
