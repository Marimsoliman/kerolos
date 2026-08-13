// src/app/api/pricing/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServicePricing from "@/models/ServicePricing";

const DEFAULT_PRICING = [
  { name: "Logo Design", price: "$400 — $1,200", desc: "2-3 unique concepts with full ownership", features: ["Concepts & Revisions", "All file formats", "Brand guidelines mini"], order: 0 },
  { name: "Brand Identity", price: "$1,500 — $4,000", desc: "Complete brand system for startups & companies", features: ["Logo + Visual System", "Typography & Colors", "Guidelines + Assets"], order: 1 },
  { name: "Visual Identity", price: "$1,200 — $3,500", desc: "Cohesive visual language across touchpoints", features: ["Art Direction", "Graphic Language", "Applications"], order: 2 },
  { name: "Website Design", price: "$2,000 — $6,000", desc: "High-performance, premium websites", features: ["UI/UX Design", "Framer / Next.js Development", "Responsive & SEO"], order: 3 },
  { name: "Art Direction", price: "$2,500 — $5,000", desc: "Creative vision for your campaign or brand", features: ["Concept Development", "Visual Storytelling", "Shoot Direction"], order: 4 },
  { name: "Creative Direction", price: "$3,500 — $8,000", desc: "Leading your brand's creative strategy", features: ["Strategy & Vision", "Team Leadership", "Full Execution"], order: 5 },
  { name: "Social Media Design", price: "$600 — $1,500/mo", desc: "Monthly content that converts", features: ["12-15 Posts / Month", "Stories & Reels Covers", "Consistent Identity"], order: 6 },
  { name: "Other", price: "Custom", desc: "Got something else? Let's talk.", features: ["Custom Scope", "Flexible Timeline", "Tailored Quote"], order: 7 },
];

export async function GET() {
  try {
    await connectDB();
    let pricing = await ServicePricing.find({}).sort({ order: 1 });

    // Seed default pricing if empty
    if (pricing.length === 0) {
      await ServicePricing.insertMany(DEFAULT_PRICING);
      pricing = await ServicePricing.find({}).sort({ order: 1 });
    }

    return NextResponse.json(pricing);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const service = await ServicePricing.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Bulk update
    if (Array.isArray(body)) {
      const results = await Promise.all(
        body.map((item: any) =>
          ServicePricing.findByIdAndUpdate(item._id, item, { new: true })
        )
      );
      return NextResponse.json(results);
    }

    // Single update
    const service = await ServicePricing.findByIdAndUpdate(body._id, body, {
      new: true,
    });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}