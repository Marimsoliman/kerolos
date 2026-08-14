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

const HERO_TEXT_OFFSET = "clamp(72px, 14vh, 160px)";

/* ═══════════════════════════════════════════════════════════════════
   MOBILE PORTRAIT LOCK  (unchanged — see notes at bottom of file)
   ═══════════════════════════════════════════════════════════════════ */

function isPhoneDevice(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  const longSide = Math.max(window.innerWidth, window.innerHeight);
  return coarse && noHover && shortSide <= 480 && longSide <= 950;
}

interface LockState {
  active: boolean;
  angle: number;
}

function useMobilePortraitLock(): LockState {
  const [state, setState] = useState<LockState>({ active: false, angle: 90 });

  useEffect(() => {
    let nativeLockWorked = false;

    const tryNativeLock = async () => {
      try {
        const so: any = (window.screen as any)?.orientation;
        if (so && typeof so.lock === "function") {
          await so.lock("portrait");
          nativeLockWorked = true;
        }
      } catch {
        nativeLockWorked = false;
      }
    };

    const evaluate = () => {
      if (nativeLockWorked) {
        setState((s) => (s.active ? { ...s, active: false } : s));
        return;
      }
      if (!isPhoneDevice()) {
        setState((s) => (s.active ? { ...s, active: false } : s));
        return;
      }
      const landscape = window.innerWidth > window.innerHeight;
      const rawAngle =
        (window.screen as any)?.orientation?.angle ??
        (typeof (window as any).orientation === "number"
          ? ((window as any).orientation + 360) % 360
          : 90);
      const angle = rawAngle === 270 || rawAngle === -90 ? 270 : 90;
      setState({ active: landscape, angle });
    };

    tryNativeLock().finally(evaluate);

    window.addEventListener("resize", evaluate);
    window.addEventListener("orientationchange", evaluate);
    const so: any = (window.screen as any)?.orientation;
    so?.addEventListener?.("change", evaluate);

    return () => {
      window.removeEventListener("resize", evaluate);
      window.removeEventListener("orientationchange", evaluate);
      so?.removeEventListener?.("change", evaluate);
      try {
        (window.screen as any)?.orientation?.unlock?.();
      } catch {
        /* noop */
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (state.active) root.setAttribute("data-mpl", "1");
    else root.removeAttribute("data-mpl");
    return () => root.removeAttribute("data-mpl");
  }, [state.active]);

  return state;
}

function MobilePortraitLockStyles() {
  return (
    <style>{`
      html[data-mpl="1"],
      html[data-mpl="1"] body {
        overflow: hidden !important;
        overscroll-behavior: none;
        background: #050505;
      }

      html[data-mpl="1"] .mpl-stage {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vh;
        height: 100vw;
        transform-origin: top left;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        container-type: size;
        container-name: mplstage;
        will-change: transform;
      }
      html[data-mpl="1"] .mpl-stage[data-angle="90"] {
        transform: rotate(-90deg) translateX(-100%);
      }
      html[data-mpl="1"] .mpl-stage[data-angle="270"] {
        transform: rotate(90deg) translateY(-100%);
      }

      html[data-mpl="1"] [data-hero="section"],
      html[data-mpl="1"] [data-hero="inner"] {
        min-height: 85cqh !important;
      }
      html[data-mpl="1"] [data-hero="inner"] {
        padding-left: 20px !important;
        padding-right: 20px !important;
        max-width: none !important;
      }
      html[data-mpl="1"] [data-hero="textcol"] {
        max-width: 600px !important;
        margin-top: clamp(72px, 14cqh, 160px) !important;
      }
      html[data-mpl="1"] [data-hero="eyebrow"] { font-size: 10px !important; }
      html[data-mpl="1"] [data-hero="eyebrow-wrap"] { margin-bottom: 12px !important; }
      html[data-mpl="1"] [data-hero="headline-wrap"] { margin-bottom: 20px !important; }
      html[data-mpl="1"] [data-hero="word"] {
        font-size: clamp(32px, 7cqw, 96px) !important;
        line-height: 1.1 !important;
        letter-spacing: -0.02em !important;
      }
      html[data-mpl="1"] [data-hero="paragraph"] {
        font-size: 13px !important;
        max-width: 260px !important;
        margin-left: -8px !important;
        margin-bottom: 24px !important;
        padding-right: clamp(8px, 3cqw, 24px) !important;
      }
      html[data-mpl="1"] [data-hero="cta-wrap"] { margin-bottom: 32px !important; }
      html[data-mpl="1"] [data-hero="cta"] {
        height: 48px !important;
        padding-left: 24px !important;
        padding-right: 24px !important;
        font-size: 13px !important;
      }
      html[data-mpl="1"] [data-hero="stats"] { gap: 32px !important; }
      html[data-mpl="1"] [data-hero="stat-value"] { font-size: 24px !important; }
      html[data-mpl="1"] [data-hero="stat-label"] { font-size: 9px !important; }
      html[data-mpl="1"] [data-hero="glow"] {
        width: 85cqw !important;
        height: 85cqw !important;
        right: -25cqw !important;
        top: 18% !important;
        margin-top: 0 !important;
        filter: blur(70px) !important;
      }

      /* ── MOBILE PORTRAIT PLACEMENT (mirrors the Tailwind mobile
            branch below, but re-anchored to the rotated stage) ── */
      html[data-mpl="1"] [data-hero="portrait-box"] {
        top: clamp(48px, 11cqh, 132px) !important;
        bottom: auto !important;
        right: -14% !important;
        width: min(52cqh, 132%) !important;
        height: 70cqh !important;
      }

      @supports not (container-type: size) {
        html[data-mpl="1"] .mpl-stage { container-type: normal; }
        html[data-mpl="1"] [data-hero="word"] { font-size: 32px !important; }
        html[data-mpl="1"] [data-hero="section"],
        html[data-mpl="1"] [data-hero="inner"] { min-height: 85% !important; }
        html[data-mpl="1"] [data-hero="portrait-box"] {
          top: 11% !important; height: 70% !important; width: 132% !important;
        }
        html[data-mpl="1"] [data-hero="glow"] {
          width: 320px !important; height: 320px !important; right: -90px !important;
        }
      }
    `}</style>
  );
}

/* ─────────────────────────────────────────────────────────────── */

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

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth) setLoaded(true);
  }, []);

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
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }),
};

function HeroInner({
  scrollContainer,
}: {
  scrollContainer?: React.RefObject<HTMLElement>;
}) {
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
    ...(scrollContainer ? { container: scrollContainer as any } : {}),
  });

  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const portraitScrollY = useTransform(smoothScrollY, [0, 1], [0, shouldReduce ? 0 : 120]);

  const contentOpacity = useTransform(smoothScrollY, [0.4, 0.8], [1, 0]);
  const contentY = useTransform(smoothScrollY, [0.4, 0.8], [0, shouldReduce ? 0 : 80]);

  const glowX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const glowY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);

  const headingWords = ["Building", "Impactful", "Digital", "Experiences"];

  return (
    <section
      ref={sectionRef}
      data-hero="section"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[85vh] bg-[#050505] overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, #0c0a14 0%, #06050a 60%, #030304 100%)" }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 15% 15%, rgba(168,85,247,0.3), transparent 45%), radial-gradient(circle at 70% 55%, rgba(139,92,246,0.35), transparent 50%)` }} />
        <GridTexture />
        <motion.div
          data-hero="glow"
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

      <div
        data-hero="inner"
        className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 min-h-[85vh] flex items-start"
      >
        {/* TEXT CONTENT — z-10, always above the portrait (z-0) */}
        <motion.div
          data-hero="textcol"
          className="relative z-10 w-full max-w-[600px] lg:max-w-[520px]"
          style={{ opacity: contentOpacity, y: contentY, marginTop: HERO_TEXT_OFFSET }}
        >
          <motion.div
            data-hero="eyebrow-wrap"
            custom={0.15}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-3 sm:mb-4 md:mb-6"
          >
            <span data-hero="eyebrow" className="text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-white/50">
              Full Stack Developer • Graphic Designer
            </span>
          </motion.div>

          <div data-hero="headline-wrap" className="mb-5 sm:mb-6 md:mb-8 flex flex-col items-start">
            {headingWords.map((word, i) => (
              <div key={word} className="overflow-hidden py-1">
                <motion.span
                  data-hero="word"
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
            data-hero="paragraph"
            custom={0.8}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-[13px] sm:text-[15px] md:text-[17px] leading-[1.7] text-white/60 
                       max-w-[260px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[400px] 
                       mb-6 sm:mb-8 md:mb-10
                       -ml-2 sm:ml-0"
            style={{
              paddingRight: "clamp(8px, 3vw, 24px)",
            }}
          >
            I design and develop high-performance digital experiences that combine modern design, clean code, and seamless interaction.
          </motion.p>

          <motion.div
            data-hero="cta-wrap"
            custom={1.0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <Link
              href="/contact"
              data-hero="cta"
              className="relative z-10 inline-flex h-[48px] sm:h-[54px] md:h-[62px] px-6 sm:px-8 md:px-10 items-center gap-3 rounded-full border border-[#8b5cf6]/40 text-white hover:bg-[#8b5cf6] transition-all text-[13px] sm:text-[14px] md:text-[15px] font-medium"
            >
              Let&apos;s Build Together <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>

          <div data-hero="stats" className="flex gap-8 sm:gap-10 md:gap-12">
            {[{ v: "150+", l: "Projects" }, { v: "150+", l: "Clients" }, { v: "5+", l: "Years" }].map((s) => (
              <div key={s.l}>
                <div data-hero="stat-value" className="text-[24px] sm:text-[32px] md:text-[38px] font-bold tracking-tight text-[#8B5CF6] drop-shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                  {s.v}
                </div>
                <div data-hero="stat-label" className="text-[9px] sm:text-[10px] md:text-[11px] text-white/40 uppercase tracking-[0.15em] mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/*
          PORTRAIT CONTAINER
          ═══════════════════════════════════════════════════════════
          MOBILE ONLY (< 640px) — was: `bottom-0 w-[95%] h-[96vh]`.

          Why the head sat so low before
          ──────────────────────────────
          The <img> is `object-contain object-bottom` inside a box that
          was 95% wide (~332px @390) but 96vh tall (~810px). With a 3:4
          source, CONTAIN fits by WIDTH → the rendered image was only
          ~443px tall, and `object-bottom` glued those 443px to the
          BOTTOM of the 810px box. Result: ~367px of dead, invisible
          space above the head. The person wasn't "positioned low" —
          the box simply had a huge empty top region.

          The fix
          ───────
          Size the box so it MATCHES the image instead of towering over
          it, then anchor it from the TOP:

            top-[clamp(48px,11vh,132px)] + bottom-auto
                → head starts in the eyebrow/first-headline band.
                  11vh tracks the same rhythm as HERO_TEXT_OFFSET
                  (14vh) so text and portrait rise/fall together.
                  48px floor protects 320×568; 132px ceiling stops the
                  head drifting down on tall 430×932 screens.

            h-[70vh]  +  w-[min(52vh,132%)]
                → 52vh × 4/3 = 69.3vh ≈ the 70vh box height, so the
                  image now FILLS its box: zero dead space, and the
                  body still runs down to ~81vh (top + height), i.e.
                  the bottom of the 85vh hero. Driving the width from
                  vh (not %) keeps the head-to-text relationship
                  identical at 320/360/375/390/393/414/430, because
                  both values now scale off the same axis.
                  `min(…,132%)` caps the width on unusually short
                  viewports so the person can never balloon sideways.

            right-[-14%]
                → the extra width from the vh-driven sizing is pushed
                  OFF the right edge (clipped by the section's
                  overflow-hidden), so the face stays right-of-centre
                  and never travels left over the headline column.

          Layering: this box is z-0 and `pointer-events-none`; the text
          column is z-10 and the CTA carries its own `relative z-10`,
          so copy stays readable and the button stays clickable even
          where the body passes behind it.

          `sm:top-auto sm:bottom-0` restores the ORIGINAL bottom anchor
          for every non-phone breakpoint — tablet and desktop values
          below are untouched.
        */}
        <div
          data-hero="portrait-box"
          className="absolute z-0 pointer-events-none
                     top-[clamp(48px,11vh,132px)] bottom-auto right-[-14%] w-[min(52vh,132%)] h-[70vh]
                     sm:top-auto sm:bottom-0 sm:right-[-5%] sm:w-[85%] sm:h-[96vh] 
                     md:right-[-10vw] md:w-[clamp(560px,70vw,700px)] md:h-[110vh] 
                     lg:right-[0%] lg:w-[clamp(620px,46vw,900px)] lg:h-auto lg:top-[3%] lg:bottom-auto
                     lg:portrait:right-[-10vw] lg:portrait:w-[clamp(650px,75vw,900px)] lg:portrait:h-[110vh] lg:portrait:top-auto lg:portrait:bottom-0"
        >
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Portrait
              smoothMouseX={smoothMouseX}
              smoothMouseY={smoothMouseY}
              scrollParallaxY={portraitScrollY}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const { active, angle } = useMobilePortraitLock();
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <MobilePortraitLockStyles />

      {active ? (
        <div ref={stageRef} className="mpl-stage" data-angle={angle}>
          <HeroInner key="locked" scrollContainer={stageRef as React.RefObject<HTMLElement>} />
        </div>
      ) : (
        <HeroInner key="free" />
      )}
    </>
  );
}