"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { COLORS } from "@/lib/theme";

const ACCENT = COLORS.accent;

type SelectedWorkProject = {
  id: string;
  name: string;
  category: string;
  year: string;
  image: string;
  description?: string;
  shortDescription?: string;
  tags?: string[];
};

// ─────────────────────────────────────────
// BACKGROUND - Memoized for performance
// ─────────────────────────────────────────
const StaticCinematicBackground = memo(function StaticCinematicBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 1100px 800px at 50% 50%,
            rgba(139,92,246,0.11) 0%,
            rgba(124,58,237,0.06) 25%,
            rgba(109,40,217,0.02) 50%,
            transparent 75%)`,
        }}
      />
    </div>
  );
});

// ─────────────────────────────────────────
// CENTRE TIMELINE - Single moving indicator
// ─────────────────────────────────────────
const CentreTimeline = memo(function CentreTimeline({
  projects,
  listRef,
}: {
  projects: SelectedWorkProject[];
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  // Premium spring physics - Linear/Apple inspired
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 20,
    restDelta: 0.001,
  });

  // Red progress line fills from top to bottom
  const redScaleY = useTransform(smoothProgress, [0, 1], [0, 1]);
  
  // Single indicator position - interpolates smoothly between 0% and 100%
  const indicatorY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
      style={{ width: 2, willChange: "transform" }}
    >
      {/* Fixed grey track */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(255,255,255,.12)" }}
      />

      {/* Red progress line - fills as you scroll */}
      <motion.div
        className="absolute top-0 left-0 right-0 rounded-full origin-top"
        style={{
          height: "100%",
          scaleY: redScaleY,
          background: `linear-gradient(to bottom, ${COLORS.accent} 0%, ${COLORS.secondary} 100%)`,
          willChange: "transform",
        }}
      />

      {/* SINGLE glowing indicator - travels along the timeline */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-30"
        style={{ 
          top: indicatorY, 
          y: "-50%",
          willChange: "transform",
        }}
      >
        {/* Soft pulsing glow ring */}
        <motion.span
          className="absolute rounded-full"
          style={{
            width: 40,
            height: 40,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`,
          }}
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
        
        {/* Premium glowing core */}
        <div
          className="relative"
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, #fff, ${ACCENT})`,
            boxShadow: `
              0 0 0 3px rgba(139, 92, 246, 0.2),
              0 0 20px ${COLORS.accent},
              0 0 40px rgba(139, 92, 246, 0.5),
              0 0 60px rgba(139, 92, 246, 0.2)
            `,
          }}
        />
      </motion.div>
    </div>
  );
});

// ─────────────────────────────────────────
// PROJECT ROW - Optimized
// ─────────────────────────────────────────
const ProjectRow = memo(function ProjectRow({
  project,
  index,
}: {
  project: SelectedWorkProject;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="grid items-center gap-0"
      style={{ gridTemplateColumns: "1fr 80px 1fr" }}
    >
      {/* TEXT SIDE */}
      <div
        className={isEven ? "pr-8 text-right" : "pl-8 text-left"}
        style={{ gridColumn: isEven ? 1 : 3, gridRow: 1 }}
      >
        <Link href={`/work/${project.id}`} className="group block">
          <p
            className="font-mono text-[11px] font-bold tracking-[0.25em] mb-3"
            style={{ color: ACCENT, opacity: 0.7 }}
          >
            {String(index + 1).padStart(2, "0")}
          </p>

          <div className={`flex items-center gap-1.5 mb-3 ${isEven ? "justify-end" : "justify-start"}`}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
            <span className="text-[0.62rem] font-sans text-white/40 uppercase tracking-widest font-semibold">
              {project.category}
            </span>
          </div>

          <h3 className="font-display text-xl md:text-2xl lg:text-[1.6rem] font-bold text-white leading-tight mb-3 transition-colors duration-200 group-hover:text-[#8B5CF6]">
            {project.name}
          </h3>

          <p className="font-sans text-xs md:text-sm text-white/45 leading-relaxed mb-4 line-clamp-3">
            {project.description || project.shortDescription || ""}
          </p>

          <div className={`flex flex-wrap gap-1.5 ${isEven ? "justify-end" : "justify-start"}`}>
            {(project.tags ?? []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/[0.05] border border-white/10 text-[0.62rem] font-sans text-white/40 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="font-mono text-[10px] text-white/25 mt-4 tracking-widest uppercase">
            {project.year}
          </p>
        </Link>
      </div>

      {/* CENTRE SPACER */}
      <div style={{ gridColumn: 2 }} className="relative self-stretch" />

      {/* IMAGE SIDE */}
      <div
        style={{ gridColumn: isEven ? 3 : 1, gridRow: 1 }}
        className={isEven ? "pl-8" : "pr-8"}
      >
        <Link href={`/work/${project.id}`} className="block group">
          <div
            className="relative overflow-hidden rounded-2xl bg-black/30 border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_50px_-15px_rgba(139,92,246,0.3)]"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={project.image}
              alt={project.name}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-4 py-2 rounded-full text-xs font-sans font-semibold text-white border border-white/30 bg-black/50 backdrop-blur-sm tracking-wider uppercase">
                View Project
              </span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────
export default function SelectedWork({
  projects,
}: {
  projects: SelectedWorkProject[];
}) {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="work"
      className="relative py-24 md:py-36 lg:py-48 overflow-hidden isolate bg-black"
    >
      <StaticCinematicBackground />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-20 md:mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block h-px w-6" style={{ background: ACCENT }} />
            <span className="text-[11px] font-sans text-white/40 uppercase tracking-[0.26em] font-semibold">
              Portfolio
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 tracking-tight leading-[1.05]">
            Selected Work<span style={{ color: ACCENT }}>.</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed max-w-lg">
            A curated collection of brand identities and visual systems — each
            one built around clarity, intention, and lasting impact.
          </p>
        </motion.div>

        {/* Projects list + timeline */}
        <div ref={listRef} className="relative">
          <CentreTimeline
            projects={projects}
            listRef={listRef}
          />

          <div
            className="flex flex-col"
            style={{ gap: "clamp(100px, 12vw, 140px)" }}
          >
            {projects.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* View All */}
        <div className="flex justify-center mt-24 md:mt-36">
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-200 text-sm font-sans font-medium"
          >
            View All Projects
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}