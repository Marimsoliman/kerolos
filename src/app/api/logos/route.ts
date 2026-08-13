// src/app/api/logos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

const LogoSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    name: { type: String, default: 'Brand Logo' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Logo = mongoose.models.Logo || mongoose.model('Logo', LogoSchema);

// GET: جلب جميع اللوجوهات مرتبة حسب order
export async function GET() {
  try {
    await dbConnect();
    const logos = await Logo.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(logos || []);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST: إضافة لوجو جديد
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body || !body.src) {
      return NextResponse.json({ error: 'الصورة مطلوبة' }, { status: 400 });
    }

    const count = await Logo.countDocuments();

    const newLogo = await Logo.create({
      src: body.src,
      name: body.name || 'Brand Logo',
      order: count,
    });

    return NextResponse.json(newLogo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'فشل إضافة اللوجو' }, { status: 500 });
  }
}