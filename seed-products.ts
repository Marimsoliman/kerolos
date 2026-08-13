import "dotenv/config";
import { dbConnect } from "./src/lib/mongodb";
import Product from "./src/models/Product";

const placeholder = [
  {
    id: "brand-guideline-template",
    name: "Brand Guideline Template",
    price: 350,
    category: "Template",
    shortDescription: "A complete brand guideline template with editable layers.",
    description:
      "A ready-to-use brand guideline template designed for agencies and studios.\nEditable in Illustrator and fully organized with layers.",
    features: [
      "Editable Illustrator file",
      "CMYK + RGB color modes",
      "Logo construction grids",
      "Typography system pages",
      "Print ready (A4)",
    ],
  },
  {
    id: "logo-design-starter-kit",
    name: "Logo Design Starter Kit",
    price: 200,
    category: "Design Kit",
    shortDescription: "Everything you need to present logo concepts to clients.",
    description:
      "A starter kit to showcase logo concepts professionally, including presentation boards and final file exports.",
    features: [
      "Concept presentation boards",
      "Vector source files",
      "Color + B/W versions",
      "Export guidelines",
    ],
  },
  {
    id: "social-media-post-pack",
    name: "Social Media Post Pack",
    price: 150,
    category: "Templates",
    shortDescription: "20 editable social media post templates.",
    description:
      "A pack of 20 modern social media post templates sized for Instagram, Facebook, and LinkedIn.",
    features: [
      "20 templates (1080x1080)",
      "Editable in Illustrator",
      "Fonts suggestions included",
      "Organized layers",
    ],
  },
  {
    id: "business-card-mockup-set",
    name: "Business Card Mockup Set",
    price: 120,
    category: "Mockups",
    shortDescription: "Realistic business card mockups for client presentations.",
    description:
      "A set of photorealistic business card mockups to present your designs in context.",
    features: [
      "6 high-res scenes",
      "Smart objects",
      "300 DPI",
      "Easy drag & drop",
    ],
  },
  {
    id: "presentation-deck-template",
    name: "Presentation Deck Template",
    price: 180,
    category: "Templates",
    shortDescription: "A clean, cinematic presentation deck for creative agencies.",
    description:
      "A premium presentation deck template with cinematic layouts, ideal for pitches and case studies.",
    features: [
      "30 slide layouts",
      "Editable charts",
      "Light + dark themes",
      "Keynote + PPTX",
    ],
  },
];

async function main() {
  await dbConnect();
  let created = 0;
  for (const p of placeholder) {
    const existing = await Product.findOne({ id: p.id });
    if (existing) {
      console.log("exists:", p.id);
      continue;
    }
    await Product.create({ ...p, published: true, order: created + 1 });
    created++;
    console.log("created:", p.id);
  }
  console.log(`\nDone. Created ${created} placeholder product(s).`);
  process.exit(0);
}

main().catch((e) => {
  console.error("FATAL", e?.message || e);
  process.exit(1);
});
