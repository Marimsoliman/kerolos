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
const FADE_MASK_MOBILE =
  "linear-gradient(to bottom, #000 0%, #000 90%, rgba(0,0,0,0.5) 96%, transparent 100%)";

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
  mask?: string;
  fit?: "contain" | "cover";
  /** "fill" = fills a fixed-height parent box (desktop).
   *  "natural" = the image dictates its own height at its true aspect
   *  ratio, so nothing is ever cropped or squeezed — used on mobile. */
  sizeMode?: "fill" | "natural";
  /** CSS object-position, only used when fit="cover". e.g. "50% 15%" */
  objectPosition?: string;
  /** Extra zoom on top of object-cover, e.g. 1.3 = 30% closer.
   *  This is what actually makes the subject bigger in frame — object-cover
   *  alone only guarantees the container is filled, it won't zoom past that. */
  zoom?: number;
}
function Portrait({ smoothMouseX, smoothMouseY, scrollParallaxY, mask, fit = "contain", sizeMode = "fill", objectPosition, zoom = 1 }: PortraitProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const shouldReduce = useReducedMotion();
  useEffect(() => { if (imgRef.current?.complete && imgRef.current?.naturalWidth) setLoaded(true); }, []);
  const tx = useTransform(smoothMouseX || useMotionValue(0), [-0.5, 0.5], shouldReduce ? [0, 0] : [-8, 8]);
  const ty = useTransform(smoothMouseY || useMotionValue(0), [-0.5, 0.5], shouldReduce ? [0, 0] : [-6, 6]);

  const isNatural = sizeMode === "natural";

  return (
    <motion.div
      style={{ y: scrollParallaxY || 0, x: tx, translateY: ty }}
      className={`relative w-full pointer-events-none select-none ${isNatural ? "" : "h-full"}`}
    >
      <div
        className={`relative w-full overflow-hidden ${isNatural ? "" : "h-full"}`}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s",
          WebkitMaskImage: mask || FADE_MASK,
          maskImage: mask || FADE_MASK
        }}
      >
        <img
          ref={imgRef}
          src={PORTRAIT_SRC}
          alt=""
          width={1200}
          height={1600}
          className={
            isNatural
              ? "w-full h-auto block" // true aspect ratio, no crop, no stretch
              : `w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"} ${objectPosition ? "" : "object-top"}`
          }
          style={{
            filter: "brightness(1.06) contrast(1.08)",
            ...(objectPosition ? { objectPosition } : {}),
            ...(zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: objectPosition || "50% 50%" } : {}),
          }}
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
  const portraitScrollY = useTransform(smoothScrollY, [0, 1], [0, shouldReduce ? 0 : 80]);

  // Desktop: fade the left text column out as you scroll past the hero.
  const contentOpacityDesktop = useTransform(smoothScrollY, [0, 0.45], [1, 0]);
  const contentYDesktop = useTransform(smoothScrollY, [0, 1], [0, shouldReduce ? 0 : 90]);

  // Mobile: fade out much later (near the very end of the hero) so there's
  // time to actually read the heading/paragraph before it disappears.
  const contentOpacityMobile = useTransform(smoothScrollY, [0.75, 1], [1, 0]);
  const contentYMobile = useTransform(smoothScrollY, [0.75, 1], [0, shouldReduce ? 0 : 40]);

  const glowX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const glowY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);

  const headingWords = ["Building", "Impactful", "Digital", "Experiences"];

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative w-full min-h-screen bg-[#050505]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, #0c0a14 0%, #06050a 60%, #030304 100%)" }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 15% 15%, rgba(168,85,247,0.3), transparent 45%), radial-gradient(circle at 70% 55%, rgba(139,92,246,0.35), transparent 50%)` }} />
        <GridTexture />
        {/* Purple glow blob — sits above the background but BELOW the portrait (z-2 vs portrait's z-10),
            so on mobile it must have room to breathe around/behind the portrait image. */}
        <motion.div
          className="absolute z-[2] rounded-full w-[380px] h-[380px] right-[-60px] top-[6%] blur-[90px] md:w-[1000px] md:h-[1000px] md:right-[-100px] md:top-1/2 md:-mt-[500px] md:blur-[180px]"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 80%)",
            x: glowX,
            y: glowY,
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        {/* second, softer glow lower down so it reads behind the mobile text block too */}
        <div
          className="absolute md:hidden z-[2] rounded-full w-[320px] h-[320px] left-[-80px] bottom-[6%] blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 75%)" }}
        />
        <VignetteOverlay />
        <FilmGrainOverlay />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20">
        {/* DESKTOP + TABLET */}
        <motion.div
          className="hidden md:grid md:grid-cols-[42%_58%] items-center min-h-screen"
          style={{ opacity: contentOpacityDesktop, y: contentYDesktop }}
        >
          <div className="flex flex-col justify-center py-[120px] pr-6">

            <motion.div custom={0.15} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-8">
              <span className="text-[11px] tracking-[0.22em] uppercase text-white/50">Full Stack Developer • Graphic Designer</span>
            </motion.div>

            <div className="mb-8 flex flex-col">
              {headingWords.map((word, i) => (
                <div key={word} className="overflow-hidden py-1">
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="block font-black tracking-[-0.03em]"
                    style={{
                      fontSize: "clamp(44px, 5.2vw, 84px)",
                      lineHeight: "1.15",
                      paddingBottom: "0.18em",
                      marginBottom: "-0.18em",
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

            <motion.p custom={0.8} variants={fadeUpVariants} initial="hidden" animate="visible" className="text-[15px] leading-[1.75] text-white/50 max-w-[460px] mb-10">
              I design and develop high-performance digital experiences that combine modern design, clean code, and seamless interaction.
            </motion.p>

            <motion.div custom={1.0} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-14">
              <Link href="/contact" className="inline-flex h-[60px] px-9 items-center gap-3 rounded-full border border-[#8b5cf6]/40 text-white hover:bg-[#8b5cf6] transition-all">
                Let's Build Together <ArrowRightIcon />
              </Link>
            </motion.div>

            <div className="flex">
              {[{ v: "150+", l: "Projects" }, { v: "150+", l: "Clients" }, { v: "5+", l: "Years" }].map((s, i) => (
                <div key={s.l} className={`px-7 ${i === 0 ? "pl-0" : ""} ${i < 2 ? "border-r border-white/10" : ""}`}>
                  <div className="text-[28px] font-bold tracking-tight text-[#8B5CF6] drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]">{s.v}</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div className="relative flex items-end justify-center" style={{ height: "120vh", marginTop: "-9rem" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <div className="w-full h-full">
              <Portrait smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} scrollParallaxY={portraitScrollY} fit="contain" />
            </div>
          </motion.div>
        </motion.div>

        {/* MOBILE - wide crop showing shoulders only */}
        <motion.div
          className="md:hidden flex flex-col items-center text-center min-h-screen pt-0 pb-8"
          style={{ opacity: contentOpacityMobile, y: contentYMobile }}
        >
          <motion.div
            className="overflow-hidden mt-10"
            style={{
              width: "110vw",
              height: "92vh",
              minHeight: "460px",
              marginLeft: "calc(-50vw + 50%)", // full-bleed edge to edge
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Framing is controlled by two knobs, no transform/scale needed:
                1) this container's height above (taller = shows more of the
                   shoulders/chest, shorter = zooms in tighter on the face)
                2) objectPosition below — "50% Y%" where a SMALLER Y shows
                   more hair/top-of-head, a LARGER Y crops higher and shows
                   more shoulders. Nudge both a few % at a time. */}
            <Portrait
              smoothMouseX={smoothMouseX}
              smoothMouseY={smoothMouseY}
              mask={FADE_MASK_MOBILE}
              fit="cover"
              objectPosition="50% 20%"
              zoom={1.3}
            />
          </motion.div>

          <div className="mt-6 w-full px-4">
            <div className="mb-5">
              <span className="text-[10px] tracking-[0.22em] uppercase text-white/50">Full Stack Developer • Graphic Designer</span>
            </div>

            <div className="mb-5">
              {headingWords.map((word, i) => (
                <div key={word} className="overflow-hidden py-1">
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="block font-black tracking-[-0.03em]"
                    style={{
                      fontSize: "clamp(34px, 9vw, 48px)",
                      lineHeight: "1.1",
                      paddingBottom: "0.15em",
                      marginBottom: "-0.15em",
                      ...(word === "Digital"
                        ? {
                            background: "linear-gradient(135deg, #c4b5fd, #8b5cf6)",
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

            <p className="text-[13px] leading-[1.7] text-white/50 max-w-[340px] mx-auto mb-6">
              I design and develop high-performance digital experiences that combine modern design, clean code, and seamless interaction.
            </p>

            <div className="grid grid-cols-3 w-full max-w-[300px] mx-auto mt-2 border-t border-white/10 pt-5">
              {[{ v: "150+", l: "Projects" }, { v: "150+", l: "Clients" }, { v: "5+", l: "Years" }].map((s,i)=>(
                <div key={s.l} className={`${i<2?"border-r border-white/10":""}`}>
                  <div className="text-[22px] font-bold text-[#8B5CF6]">{s.v}</div>
                  <div className="text-[10px] text-white/40 uppercase">{s.l}</div>
                </div>
              ))}
            </div>

            <Link href="/contact" className="mt-7 w-full max-w-[300px] inline-flex h-[52px] items-center justify-center gap-3 rounded-full border border-[#8b5cf6]/40 text-white">
              Let's Build Together <ArrowRightIcon />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}