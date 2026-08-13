import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// POST - إنشاء طلب من صفحة الخروج
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, items, paymentMethod } = body;

    if (!customerName || !customerName.trim()) {
      return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    const cleanItems = items.map((it: any) => ({
      productId: String(it.productId || ""),
      name: String(it.name || ""),
      price: Number(it.price) || 0,
      qty: Math.max(1, Number(it.qty) || 1),
    }));

    // نحسب الإجمالي من السيرفر (مش من العميل)
    const total = cleanItems.reduce((s: number, it: any) => s + it.price * it.qty, 0);
    if (total <= 0) {
      return NextResponse.json({ error: "إجمالي غير صالح" }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: String(customerPhone || "").trim(),
      customerEmail: String(customerEmail || "").trim(),
      items: cleanItems,
      total,
      currency: "EGP",
      paymentMethod: paymentMethod === "paypal" ? "paypal" : "instapay",
      status: "pending",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("🔥 [API ERROR] create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// GET - كل الطلبات (أدمن فقط)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json(orders, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("🔥 [API ERROR] fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
