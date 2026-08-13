// src/app/api/logos/[id]/route.ts
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await Logo.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Logo deleted successfully' });
  } catch (error: any) {
    console.error("Delete Logo Error:", error);
    return NextResponse.json({ error: 'Failed to delete logo' }, { status: 500 });
  }
}