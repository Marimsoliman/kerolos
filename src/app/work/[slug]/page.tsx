// src/app/work/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from 'react';
import { getPublishedProjects, getProjectById } from "@/lib/projects";
import CaseStudyContent from "./CaseStudyContent";

export const revalidate = 3600; // Cache for 1 hour instead of 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

// Cache the data fetching functions
const getCachedProject = cache(async (slug: string) => {
  return await getProjectById(slug);
});

const getCachedProjects = cache(async () => {
  return await getPublishedProjects();
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCachedProject(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.name} — Kerolos`,
    description: project.shortDescription,
  };
}

// Parallel data fetching
async function getPageData(slug: string) {
  const [project, allProjects] = await Promise.all([
    getCachedProject(slug),
    getCachedProjects(),
  ]);
  
  return { project, allProjects };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const { project, allProjects } = await getPageData(slug);
  
  if (!project) notFound();

  const otherProjects = allProjects
    .filter((p) => p.id !== project.id && p._id !== project._id)
    .slice(0, 3);

  return <CaseStudyContent project={project} otherProjects={otherProjects} />;
}

// Pre-generate static pages at build time
export async function generateStaticParams() {
  try {
    const projects = await getCachedProjects();
    return projects.map((project) => ({
      slug: project.id,
    }));
  } catch {
    return [];
  }
}