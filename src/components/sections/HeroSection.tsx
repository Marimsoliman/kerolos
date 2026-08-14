"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  Variants,
  MotionValue,
} from "framer-motion";

const PORTRAIT_SRC = "/images/kairos-portofolio4.png";
const FADE_MASK =
  "linear-gradient(to bottom, #000 0%, #000 94%, rgba(0,0,0,0.7) 97%, transparent 100%)";

// ─────────────────────────────────────────────────────────────
// TUNE HERE: single control point for how far the text column
// sits below the top of the hero. Uses clamp(min, preferred, max)
// so it scales proportionally with viewport height (vh) on every
// breakpoint — no separate sm/md/lg magic numbers to keep in sync,
// and no risk of the text drifting into the navbar on short screens.
//   min  -> floor distance from the top (navbar safety)
//   14vh -> proportional offset that tracks the portrait's height
//   max  -> ceiling so very tall viewports don't push it too far
// Nudge the "14vh" value up/down to fine-tune against the actual
// portrait image once you see it rendered. The vertical gaps between
// the eyebrow/headline/paragraph/CTA blocks below were tightened by
// a matching amount so pushing this offset down doesn't grow the
// overall hero height — the whole block shifts down as a unit
// instead of stretching taller.
// ─────────────────────────────────────────────────────────────
const HERO_TEXT_OFFSET = "clamp(72px, 14vh, 160px)";

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function FilmGrainOverlay() {
  return <div aria-hidden className="absolute inset-0 pointer-events-none z-[6] opacity-[0.03] mix-blend-overlay" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}} />;
}
function GridTexture() {
  return <div aria-hidden className="absolute inset-0 pointer-events-none z-[1]" style={{opacity:0.022, backgroundImage:`linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`, backgroundSize:"72px 72px"}} />;
}
function VignetteOverlay() {
  return <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]" style={{background:`radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)`}} />;
}

interface PortraitProps {
  smoothMouseX?: MotionValue<number>;
  smoothMouseY?: MotionValue<number>;
  scrollParallaxY?: MotionValue<number>;
}
function Portrait({ smoothMouseX, smoothMouseY, scrollParallaxY }: PortraitProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const shouldReduce = useReducedMotion();
  useEffect(() => { if (imgRef.current?.complete && imgRef.current?.naturalWidth) setLoaded(true); }, []);
  const tx = useTransform(smoothMouseX || useMotionValue(0), [-0.5, 0.5], shouldReduce ? [0, 0] : [-12, 12]);
  const ty = useTransform(smoothMouseY || useMotionValue(0), [-0.5, 0.5], shouldReduce ? [0, 0] : [-8, 8]);

  return (
    <motion.div
      style={{ y: scrollParallaxY || 0, x: tx, translateY: ty }}
      className="relative w-full h-full pointer-events-none select-none"
    >
      <div
        className="relative w-full h-full"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s",
          WebkitMaskImage: FADE_MASK,
          maskImage: FADE_MASK
        }}
      >
        <img
          ref={imgRef}
          src={PORTRAIT_SRC}
          alt=""
          width={1200}
          height={1600}
          className="w-full h-full object-contain object-bottom"
          style={{ filter: "brightness(1.06) contrast(1.08)" }}
          onLoad={() => setLoaded(true)}
          loading="eager"
        />
      </div>
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.3 + i * 0.12, duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  }),
};
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ opacity: 1, y: 0, transition: { delay: d, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }),
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const smoothMouseX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const smoothMouseY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const portraitScrollY = useTransform(smoothScrollY, [0, 1], [0, shouldReduce ? 0 : 120]);

  const contentOpacity = useTransform(smoothScrollY, [0.4, 0.8], [1, 0]);
  const contentY = useTransform(smoothScrollY, [0.4, 0.8], [0, shouldReduce ? 0 : 80]);

  const glowX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const glowY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);

  const headingWords = ["Building", "Impactful", "Digital", "Experiences"];

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative w-full min-h-[85vh] bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, #0c0a14 0%, #06050a 60%, #030304 100%)" }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 15% 15%, rgba(168,85,247,0.3), transparent 45%), radial-gradient(circle at 70% 55%, rgba(139,92,246,0.35), transparent 50%)` }} />
        <GridTexture />
        <motion.div
          className="absolute z-[2] rounded-full w-[85vw] h-[85vw] right-[-25vw] top-[18%] blur-[70px]
                     sm:w-[600px] sm:h-[600px] sm:right-[-120px] sm:top-[20%] sm:blur-[110px]
                     md:w-[1000px] md:h-[1000px] md:right-[-100px] md:top-1/2 md:-mt-[500px] md:blur-[180px]"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 75%)",
            x: glowX,
            y: glowY,
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <VignetteOverlay />
        <FilmGrainOverlay />
      </div>

      {/*
        Row container: switched from `items-center` to `items-start`.
        Under `items-center`, any padding/margin we add to the text
        column gets visually halved (the browser centers the box
        including its own spacing), which is why previous pt-* bumps
        barely moved anything. `items-start` + an explicit margin-top
        on the text column below gives full, predictable 1:1 control.
      */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 min-h-[85vh] flex items-start">
        {/* TEXT CONTENT — vertically aligned to shoulder/upper-chest level of the portrait */}
        <motion.div
          className="relative z-10 w-full max-w-[600px] lg:max-w-[520px]"
          style={{ opacity: contentOpacity, y: contentY, marginTop: HERO_TEXT_OFFSET }}
        >
          <motion.div custom={0.15} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-3 sm:mb-4 md:mb-6">
            <span className="text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-white/50">
              Full Stack Developer • Graphic Designer
            </span>
          </motion.div>

          <div className="mb-5 sm:mb-6 md:mb-8 flex flex-col items-start">
            {headingWords.map((word, i) => (
              <div key={word} className="overflow-hidden py-1">
                <motion.span
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="block font-black tracking-[-0.02em] sm:tracking-[-0.03em] text-[clamp(32px,7vw,96px)] leading-[1.1] lg:text-[clamp(40px,4.2vw,68px)] lg:leading-[1.08]"
                  style={{
                    paddingBottom: "0.15em",
                    marginBottom: "-0.15em",
                    fontFamily: "var(--font-display)",
                    ...(word === "Digital"
                      ? {
                          background: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 55%, #7c3aed 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }
                      : { color: "#fff" }),
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>

          <motion.p 
            custom={0.8} 
            variants={fadeUpVariants} 
            initial="hidden" 
            animate="visible" 
            className="text-[13px] sm:text-[15px] md:text-[17px] leading-[1.7] text-white/60 max-w-[280px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[400px] mb-6 sm:mb-8 md:mb-10"
          >
            I design and develop high-performance digital experiences that combine modern design, clean code, and seamless interaction.
          </motion.p>

          <motion.div custom={1.0} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-8 sm:mb-10 md:mb-12">
            <Link href="/contact" className="inline-flex h-[48px] sm:h-[54px] md:h-[62px] px-6 sm:px-8 md:px-10 items-center gap-3 rounded-full border border-[#8b5cf6]/40 text-white hover:bg-[#8b5cf6] transition-all text-[13px] sm:text-[14px] md:text-[15px] font-medium">
              Let's Build Together <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="flex gap-8 sm:gap-10 md:gap-12">
            {[{ v: "150+", l: "Projects" }, { v: "150+", l: "Clients" }, { v: "5+", l: "Years" }].map((s) => (
              <div key={s.l}>
                <div className="text-[24px] sm:text-[32px] md:text-[38px] font-bold tracking-tight text-[#8B5CF6] drop-shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                  {s.v}
                </div>
                <div className="text-[9px] sm:text-[10px] md:text-[11px] text-white/40 uppercase tracking-[0.15em] mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/*
          LARGE PORTRAIT — anchored bottom-right on mobile/tablet (unchanged).
          On lg+ desktop only: switched from a bottom-anchored oversized
          container to a smaller, top-anchored one. `lg:top-[3%]` (raised
          from the previous 10%) so the portrait's shoulder/chest level
          lines up with the text column now that HERO_TEXT_OFFSET was
          also reduced — both moved up together to keep them aligned.
        */}
        <div className="absolute z-0 bottom-0 lg:bottom-0 lg:top-[3%] right-[-6%] sm:right-[-5%] md:right-[-2%] lg:right-[0%] w-[95%] sm:w-[85%] md:w-[56%] lg:w-[46%] h-[96vh] sm:h-[96vh] md:h-[150vh] lg:h-auto pointer-events-none">
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Portrait smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} scrollParallaxY={portraitScrollY} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}