// src/components/sections/TestimonialsSection.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  animate,
} from "framer-motion";
import { COLORS } from "@/lib/theme";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

// Placeholder data — swap for a DB fetch when ready.
const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Kerlous is an exceptionally creative and highly professional graphic designer. The quality of his work exceeded my expectations, and I would confidently recommend him to anyone looking for premium branding and design services.",
    author: "Amr Elhaddad",
    role: "Founder & CEO, Elhaddad Group",
  },
  {
    id: "2",
    quote:
      "Working with Kerlous was an outstanding experience. His creativity, professionalism, and refined design sense made the entire process smooth and enjoyable. I highly recommend his services.",
    author: "Karim Mahmoud Gomaa",
    role: "Managing Director, Gomaa Trading Co.",
  },
  {
    id: "3",
    quote:
      "Professional, reliable, and highly committed. What impressed me most was not only the exceptional quality of the work, but also his punctuality and dedication to delivering everything on schedule.",
    author: "Abanob Ehab",
    role: "Founder, AE Business Solutions",
  },
  {
    id: "4",
    quote:
      "Outstanding work with exceptional attention to detail. Kerlous combines creativity with professionalism, delivering high-quality designs that truly stand out.",
    author: "Mohamed Elmassaryr",
    role: "CEO, Elmassary Construction",
  },
  {
    id: "5",
    quote:
      "Beautiful work with outstanding creative vision. It was a pleasure working with Kerlous, and I'm glad I had the opportunity to collaborate with such a talented designer.",
    author: "Adel Al Rifai",
    role: "Owner & General Manager, Al Rifai Group",
  },
  {
    id: "6",
    quote:
      "One of the best professionals I've ever worked with. Creative, trustworthy, and highly professional. The quality of the work was outstanding, and every project was delivered faster than expected.",
    author: "Emad El Masry",
    role: "Managing Director, El Masry Industries",
  },
];

const CARD_GAP = 24; // matches gap-6 on the track

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.77l-5.2 2.73.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [step, setStep] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      const track = trackRef.current;
      if (!vp || !track) return;
      const total = track.scrollWidth;
      const view = vp.clientWidth;
      setMaxDrag(Math.max(0, total - view));
      const first = track.firstElementChild as HTMLElement | null;
      if (first) setStep(first.offsetWidth + CARD_GAP);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const goTo = useCallback(
    (dir: 1 | -1) => {
      if (step <= 0 || maxDrag <= 0) return;
      const current = x.get();
      const target = Math.max(-maxDrag, Math.min(0, current - dir * step));
      animate(x, target, { type: "spring", stiffness: 130, damping: 22 });
    },
    [step, maxDrag, x]
  );

  const dragProps = reduceMotion
    ? {}
    : {
        drag: "x" as const,
        dragConstraints: { left: -maxDrag, right: 0 },
        dragElastic: 0.06,
        dragTransition: { power: 0.3, timeConstant: 220 },
        onDragStart: () => x.stop(),
      };

  return (
    <section
      className="relative w-full overflow-hidden py-28 md:py-36 lg:py-44"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Header */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <motion.div
          className="flex items-end justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block h-px w-6" style={{ background: COLORS.accent }} />
              <span className="text-[11px] font-sans text-white/40 uppercase tracking-[0.26em] font-semibold">
                Testimonials
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 tracking-tight leading-[1.05]">
              What clients say<span style={{ color: COLORS.accent }}>.</span>
            </h2>
            <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed max-w-lg">
              Real words from the people I&apos;ve partnered with — drag to
              explore.
            </p>
          </div>

          {/* Arrows */}
          <motion.div
            className="hidden md:flex items-center gap-3 pb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Previous testimonial"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-accent hover:text-white hover:bg-accent/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Next testimonial"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-accent hover:text-white hover:bg-accent/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-14 md:mt-20"
      >
        <div
          ref={viewportRef}
          className="relative overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          {/* Edge fade masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 md:w-24"
            style={{ background: `linear-gradient(to right, ${COLORS.bg} 0%, transparent 100%)` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 md:w-24"
            style={{ background: `linear-gradient(to left, ${COLORS.bg} 0%, transparent 100%)` }}
          />

          <div
            className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12"
          >
            <motion.div
              ref={trackRef}
              className="flex cursor-grab gap-6 active:cursor-grabbing"
              style={{ x }}
              {...dragProps}
            >
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="relative flex w-[85vw] shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 md:p-9 sm:w-[380px] md:w-[420px]"
                >
                  {/* Accent top bar */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-[2px] rounded-l-2xl"
                    style={{ background: `linear-gradient(to bottom, ${COLORS.accent}, ${COLORS.secondary})` }}
                  />

                  <div className="mb-6 flex items-center gap-3" style={{ color: COLORS.accent }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  <p className="flex-1 font-sans text-[15px] md:text-base leading-relaxed text-white/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary})` }}
                      aria-hidden="true"
                    >
                      {t.author
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-sans text-sm font-semibold text-white">{t.author}</p>
                      <p className="mt-0.5 font-sans text-xs text-accent-light">{t.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
