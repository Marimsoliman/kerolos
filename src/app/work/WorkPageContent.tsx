"use client";

import Link from "next/link";
import { memo } from "react";
import { CINEMATIC_BG } from "@/lib/theme";

interface Project {
  _id: string;
  id: string;
  name: string;
  category: string;
  year: string;
  image: string;
  shortDescription?: string;
  published: boolean;
  order?: number;
}

interface WorkPageContentProps {
  initialProjects: Project[];
}

const BG_STYLE = {
  backgroundColor: "#000000",
  backgroundImage: CINEMATIC_BG,
};

const BLOOM_STYLE: React.CSSProperties = {
  top: "-32%",
  left: "-28%",
  width: "68%",
  height: "75%",
  background:
    "radial-gradient(ellipse 100% 100% at 42% 38%, rgba(139,92,246,0.32) 0%, rgba(124,58,237,0.14) 42%, transparent 68%)",
  filter: "blur(70px)",
};

const ProjectCard = memo(
  ({
    project,
    index,
    isPriority,
  }: {
    project: Project;
    index: number;
    isPriority: boolean;
  }) => {
    return (
      <div
        className="group flex flex-col h-full opacity-0 animate-fadeInUp"
        style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
      >
        <Link
          href={`/work/${project.id}`}
          prefetch={isPriority}
          className="block flex-1 flex flex-col"
        >
          <div className="relative w-full rounded-xl mb-5 border border-white/10 overflow-hidden bg-[#0d0d0d] aspect-[4/3]">
            <img
              src={project.image}
              alt={project.name}
              loading={isPriority ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="absolute top-4 left-4 z-20">
              <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-black text-[0.65rem] font-sans tracking-widest uppercase rounded-full shadow-lg">
                {project.category}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-white text-xs font-sans tracking-widest uppercase flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
                View
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h2 className="text-white font-display text-lg md:text-xl font-semibold tracking-tight group-hover:text-accent transition-colors duration-300 mb-2 line-clamp-2">
                {project.name}
              </h2>
              <p className="text-white/40 font-sans text-sm leading-relaxed line-clamp-2">
                {project.shortDescription}
              </p>
            </div>
            <span className="text-white/30 font-sans text-xs mt-3">
              {project.year}
            </span>
          </div>
        </Link>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

export default function WorkPageContent({
  initialProjects,
}: WorkPageContentProps) {
  const projects = [...initialProjects].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined)
      return a.order - b.order;
    return Number(b.year) - Number(a.year);
  });

  const decorations = (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.017]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[0]"
        style={BLOOM_STYLE}
      />
    </>
  );

  const header = (
    <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
      <div className="mb-16 md:mb-24">
        <span className="text-accent text-[11px] md:text-xs font-sans uppercase block mb-3 tracking-widest">
          Portfolio
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
          Selected Work
        </h1>
        <p className="text-white/50 font-sans text-base md:text-lg max-w-2xl leading-relaxed">
          A curated collection of brand identity, visual identity, and graphic
          design projects.
        </p>
      </div>
      <div className="h-px bg-white/10 mb-16" />
    </div>
  );

  if (projects.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 relative" style={BG_STYLE}>
        {decorations}
        {header}
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 backdrop-blur-sm">
            <p className="text-white/50 mb-4 text-lg font-sans">
              No projects available at the moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={BG_STYLE}>
      {decorations}
      {header}

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {projects.map((project, i) => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              index={i}
              isPriority={i < 6}
            />
          ))}
        </div>
      </div>
    </div>
  );
}