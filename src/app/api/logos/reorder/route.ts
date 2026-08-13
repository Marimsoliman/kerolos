// src/app/api/logos/reorder/route.ts
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

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    const bulkOps = items.map((item: { _id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await Logo.bulkWrite(bulkOps);

    return NextResponse.json({ message: 'Logos reordered successfully' });
  } catch (error: any) {
    console.error("Reorder Error:", error);
    return NextResponse.json({ error: 'Failed to reorder logos' }, { status: 500 });
  }
}