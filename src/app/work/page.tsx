// src/app/work/page.tsx
import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects";
import WorkPageContent from "./WorkPageContent";

// ⚡ شيلنا force-dynamic وحطينا revalidate
// الصفحة هتفتح فوراً في 0 ثانية، وهتحدث نفسها في الخلفية كل 60 ثانية لو في جديد
export const revalidate = 60; 

export const metadata: Metadata = {
  title: "Work — Kerolos",
  description:
    "A curated collection of brand identity, visual identity, and graphic design projects.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return <WorkPageContent initialProjects={projects} />;
}