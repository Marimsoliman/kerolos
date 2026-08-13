// scripts/importProjects.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: String, required: true },
  tags: [String],
  image: { type: String, required: true },
  images: [String],
  shortDescription: String,
  description: String,
  overview: String,
  challenge: String,
  strategy: String,
  concept: String,
  colors: [{ name: String, hex: String }],
  typography: {
    primary: String,
    secondary: String,
    description: String
  },
  gradientClass: String,
  initial: String,
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const projects = [
  {
    id: "elsalam",
    name: "Elsalam",
    category: "Brand Identity",
    year: "2024",
    shortDescription: "Brand identity for a leading electrical appliances company",
    description: "A distinctive brand identity for Elsalam Group, a well-established electrical appliances company with a strong local market presence.",
    tags: ["Logo Design", "Brand Identity", "Packaging"],
    image: "/images/projects/stellar-coffee/Elsalam Presentation-01.jpg",
    images: [
      "/images/projects/stellar-coffee/Elsalam Presentation-01.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-02.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-03.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-04.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-05.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-06.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-07.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-08.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-09.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-10.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-12.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-13.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-14.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-15.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-16.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-17.jpg",
      "/images/projects/stellar-coffee/Elsalam Presentation-18.jpg",
    ],
    gradientClass: "bg-gradient-to-br from-slate-100 to-slate-300",
    initial: "E",
    overview: "Elsalam Group is a well-established electrical appliances company with a strong presence in the local market. The company has built a solid reputation for delivering high-quality, reliable, and affordable home appliances that meet the evolving needs of its customers. As part of this project, we built a distinctive brand identity that clearly communicates what Elsalam Group stands for and reflects the company's expertise in the electrical appliances industry in a simple, clear, and memorable way. The goal was to create more than just a visual identity — we developed a strong and timeless brand that elevates the company's perceived value, strengthens its presence in the market, and establishes a clear foundation for long-term growth and recognition for years to come.",
    challenge: "Communicate expertise and reliability in the electrical appliances category in a way that is simple, clear, and memorable.",
    concept: "A timeless brand system built around trust, quality, and long-term value for everyday households.",
    strategy: "Developed a clear and memorable visual identity that elevates the company's perceived value and establishes a strong foundation for long-term market recognition.",
    colors: [
      { name: "Deep Navy", hex: "#1B2A4A" },
      { name: "Signal Red", hex: "#C0392B" },
      { name: "Warm Grey", hex: "#D9D6D0" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
    typography: {
      primary: "Montserrat",
      secondary: "Inter",
      description: "A confident, geometric sans-serif pairing that communicates reliability and modern craftsmanship.",
    },
    published: true,
    order: 1
  },
  {
    id: "urban-studios",
    name: "Urban Studios",
    category: "Brand Strategy",
    year: "2023",
    shortDescription: "Strategic brand positioning for architecture firm",
    description: "Strategic brand positioning and visual identity for a modern architecture firm.",
    tags: ["Brand Strategy", "Logo Design", "Guidelines"],
    image: "/images/projects/urban-studios/main.jpg",
    images: [
      "/images/projects/urban-studios/main.jpg",
      "/images/projects/urban-studios/business-card.jpg",
      "/images/projects/urban-studios/stationery.jpg",
    ],
    gradientClass: "bg-gradient-to-br from-black to-gray-800",
    initial: "U",
    overview: "Urban Studios needed a brand that would position them as innovative leaders in modern architecture.",
    challenge: "Position architecture firm as modern and innovative while maintaining professional credibility.",
    concept: "Bold, geometric forms inspired by architectural precision and urban landscapes.",
    strategy: "Developed bold, geometric visual identity reflecting architectural precision and contemporary design thinking.",
    colors: [
      { name: "Midnight Black", hex: "#000000" },
      { name: "Slate Grey", hex: "#333333" },
      { name: "Steel", hex: "#666666" },
      { name: "Concrete", hex: "#CCCCCC" },
    ],
    typography: {
      primary: "Montserrat",
      secondary: "Roboto",
      description: "Strong, geometric typefaces that reflect architectural precision and modern aesthetics.",
    },
    published: true,
    order: 2
  }
];

async function importProjects() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing projects (optional)
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert new projects
    const result = await Project.insertMany(projects);
    console.log(`✅ Imported ${result.length} projects successfully!`);

    for (const project of result) {
      console.log(`   - ${project.name} (${project.id})`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

importProjects();