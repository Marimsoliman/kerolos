// src/app/page.tsx
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import SelectedWork from "@/components/sections/SelectedWork";
import LogoWall from "@/components/LogoWall"; // ✅ التأكد من الاستيراد
import PhilosophySection from "@/components/sections/PhilosophySection";
import ServicesSection from "@/components/sections/ServicesSection";
import ScrollTextReveal from "@/components/sections/ScrollTextReveal";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <ScrollTextReveal />
      <SelectedWork projects={projects} />
      <ServicesSection />
      <LogoWall />
      <TestimonialsSection />
      <PhilosophySection />
    </>
  );
}