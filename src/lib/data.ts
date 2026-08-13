export interface Project {
  id: string;
  name: string;
  category: string;
  year: string;
  shortDescription: string;
  description: string;
  tags: string[];
  image: string;
  images: string[];
  gradientClass: string;
  initial: string;
  overview: string;
  challenge: string;
  concept: string;
  strategy: string;
  colors: { name: string; hex: string }[];
  typography: {
    primary: string;
    secondary: string;
    description: string;
  };
}

export interface Service {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    number: "01",
    title: "Brand Strategy",
    description:
      "Positioning, messaging, and market research that give a brand a clear reason to exist and a clear direction to grow.",
    deliverables: ["Positioning", "Messaging", "Market Research", "Brand Story"],
  },
  {
    number: "02",
    title: "Logo & Identity Design",
    description:
      "A distinctive, timeless mark and visual system built to work everywhere - from a business card to a billboard.",
    deliverables: ["Logo Design", "Color System", "Typography", "Iconography"],
  },
  {
    number: "03",
    title: "Brand Guidelines",
    description:
      "A clear, practical rulebook so the identity stays consistent across every team, touchpoint, and future hire.",
    deliverables: ["Style Guide", "Usage Rules", "Templates", "Asset Library"],
  },
  {
    number: "04",
    title: "Packaging & Print",
    description:
      "Packaging, stationery, and print collateral that carry the brand's identity into the physical world.",
    deliverables: ["Packaging Design", "Stationery", "Print Collateral", "Mockups"],
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "Understanding the business, the audience, and the competitive landscape before a single pixel is touched.",
  },
  {
    step: "02",
    title: "Define",
    description:
      "Turning research into a clear strategic direction - positioning, tone, and the core idea the brand will live by.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "Bringing the strategy to life visually - exploring concepts, refining the chosen direction, and building the system.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "Finalizing every asset, documenting the guidelines, and handing off a brand that's ready to launch.",
  },
];

export const projects: Project[] = [
  {
    id: "elsalam",
    name: "Elsalam",
    category: "Brand Identity",
    year: "2024",
    shortDescription: "Brand identity for a leading electrical appliances company",
    description: "A distinctive brand identity for Elsalam Group, a well-established electrical appliances company with a strong local market presence.",
    tags: ["Logo Design", "Brand Identity", "Packaging"],
    image: "/images/projects/stellar-coffee/Elsalam Presentation-01.webp",
    images: [
      "/images/projects/stellar-coffee/Elsalam Presentation-01.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-02.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-03.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-04.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-05.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-06.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-07.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-08.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-09.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-10.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-11.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-12.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-13.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-14.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-15.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-16.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-17.webp",
      "/images/projects/stellar-coffee/Elsalam Presentation-18.webp",
    ],
    gradientClass: "bg-gradient-to-br from-slate-100 to-slate-300",
    initial: "E",
    overview: "Elsalam Group is a well-established electrical appliances company with a strong presence in the local market. The company has built a solid reputation for delivering high-quality, reliable, and affordable home appliances that meet the evolving needs of its customers. As part of this project, we built a distinctive brand identity that clearly communicates what Elsalam Group stands for and reflects the company's expertise in the electrical appliances industry in a simple, clear, and memorable way.",
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
  },
];