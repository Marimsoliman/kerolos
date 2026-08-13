"use client";

import { useRef, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { COLORS } from "@/lib/theme";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = COLORS.accent;

// Ultra-subtle film grain, encoded as an inline SVG fractal-noise data URI.
// Used at ~1.8% opacity with mix-blend-mode: overlay to kill banding without
// ever reading as "texture" — it should be felt, not seen.
const NOISE_DATA_URI =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==";

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();

  // ═══════════════════════════════════════════════════════
  // CINEMATIC LIGHT ENGINE
  // The light's target position (where the cursor is) and its
  // current position (what's actually rendered) are tracked
  // separately in refs — this avoids a React re-render on every
  // pointermove event. Each animation frame we nudge "current"
  // a small fraction of the way toward "target" (linear
  // interpolation / "lerp"). The smaller the lerp factor, the
  // heavier and more delayed the light feels — like it has real
  // mass and is drifting through the dark rather than snapping
  // to the mouse. Only once per frame do we commit the new
  // position to a CSS variable via style state, which is the
  // single re-render per frame instead of one per mouse event.
  // ═══════════════════════════════════════════════════════
  const targetX = useRef(50);
  const targetY = useRef(50);
  const currentX = useRef(50);
  const currentY = useRef(50);

  const [lightVars, setLightVars] = useState<CSSProperties>({
    "--light-x": "50%",
    "--light-y": "50%",
  } as CSSProperties);

  useEffect(() => {
    const container = ref.current;
    if (!container || reduceMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      // Clamp with generous overscroll so the light can drift
      // slightly offscreen without ever "teleporting" back.
      targetX.current = Math.max(-20, Math.min(120, x));
      targetY.current = Math.max(-20, Math.min(120, y));
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });

    let rafId: number;
    const tick = () => {
      // 0.045 = heavy, oil-like drift. Raise toward ~0.1 for a
      // snappier feel, lower toward ~0.02 for something almost
      // glacial. Never animate this with a fixed-duration
      // transition — the lerp itself IS the easing, and it keeps
      // adjusting live even if the cursor changes direction
      // mid-flight, which is what makes it feel alive rather
      // than scripted.
      const lerp = 0.045;
      currentX.current += (targetX.current - currentX.current) * lerp;
      currentY.current += (targetY.current - currentY.current) * lerp;

      setLightVars({
        "--light-x": `${currentX.current}%`,
        "--light-y": `${currentY.current}%`,
      } as CSSProperties);

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  const lineVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: reduceMotion ? 0 : i * 0.08, ease: EASE },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden text-white"
      style={
        {
          backgroundColor: "#000000",
          ...lightVars,
        } as CSSProperties
      }
    >
      {/* ═══════════════════════════════════════════════════════
          CINEMATIC BACKGROUND SYSTEM
          Three stacked layers, darkest to lightest:
          1) a near-invisible static base glow so the hero never
             reads as pure flat black even before the cursor moves
          2) the volumetric cursor light — several oversized,
             irregularly-sized/offset radial gradients layered on
             top of each other so the result reads as one soft
             diffuse light source instead of a visible circle
          3) film grain to break color banding across the gradient
          ═══════════════════════════════════════════════════════ */}

      {/* Layer 1 — static ambient base glow, centered behind content, زيادة الإضاءة */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              85% 70% at 50% 50%,
              rgba(139, 92, 246, 0.09) 0%,
              rgba(124, 58, 237, 0.045) 40%,
              rgba(109, 40, 217, 0.015) 65%,
              transparent 80%
            )
          `,
        }}
      />

      {/* Layer 2 — volumetric cursor light مع زيادة الإضاءة والانتشار */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(
              1400px 1050px at var(--light-x) var(--light-y),
              rgba(139, 92, 246, 0.16) 0%,
              rgba(139, 92, 246, 0.11) 20%,
              rgba(124, 58, 237, 0.075) 35%,
              rgba(109, 40, 217, 0.035) 55%,
              transparent 78%
            ),
            radial-gradient(
              900px 720px at var(--light-x) var(--light-y),
              rgba(139, 92, 246, 0.08) 0%,
              rgba(109, 40, 217, 0.04) 40%,
              rgba(109, 40, 217, 0.02) 60%,
              transparent 75%
            ),
            radial-gradient(
              2200px 1600px at var(--light-x) var(--light-y),
              rgba(124, 58, 237, 0.04) 0%,
              rgba(109, 40, 217, 0.015) 45%,
              transparent 68%
            )
          `,
          willChange: "background",
        }}
      />

      {/* Film grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage: `url("${NOISE_DATA_URI}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.018,
          mixBlendMode: "overlay",
        }}
      />

      {/* Content grid — unchanged */}
      <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-12 px-6 md:px-10 lg:px-16">
        <div className="col-span-12 flex h-full flex-col justify-center md:col-span-10 lg:col-span-8">
          {/* Quote content */}
          <div className="flex flex-col justify-center" style={{ maxWidth: 900 }}>
            <motion.div
              className="mb-10 flex items-center gap-3 md:mb-14"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span
                aria-hidden="true"
                className="h-[6px] w-[6px] rounded-full"
                style={{ background: ACCENT }}
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Philosophy
              </span>
            </motion.div>

            <p className="font-sans" style={{ fontWeight: 850 }}>
              <motion.span
                custom={0}
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="block text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.05] tracking-[-0.03em]"
              >
                Design is not just
              </motion.span>

              <motion.span
                custom={1}
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="block text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.05] tracking-[-0.03em]"
              >
                what it looks like.
              </motion.span>

              <motion.span
                custom={2}
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mt-3 block text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.05] tracking-[-0.03em] md:mt-4"
              >
                Design is
              </motion.span>

              {/* HOW — مع إضاءة حمراء محيطة */}
              <motion.span
                initial={{ opacity: 0, x: reduceMotion ? 0 : -48 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                whileHover={{
                  scale: 1.03,
                  letterSpacing: "-0.01em",
                  transition: { duration: 0.25, ease: EASE },
                }}
                className="mx-auto block cursor-default"
                style={{
                  fontSize: "clamp(4.5rem,15vw,10.625rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: COLORS.accent,
                  fontWeight: 900,
                  textShadow: `
                    0 0 40px rgba(139, 92, 246, 0.4),
                    0 0 80px rgba(139, 92, 246, 0.2),
                    0 0 120px rgba(124, 58, 237, 0.1)
                  `,
                }}
              >
                HOW
              </motion.span>

              <motion.span
                custom={4}
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mt-3 block text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.05] tracking-[-0.03em] md:mt-4"
              >
                it impacts.
              </motion.span>
            </p>

            {/* Underline مع إضاءة */}
            <div className="relative mt-10 h-px w-full max-w-[560px] md:mt-14">
              <motion.div
                className="absolute inset-y-0 left-0 h-px w-full origin-left"
                style={{ 
                  background: ACCENT,
                  boxShadow: `0 0 12px rgba(139, 92, 246, 0.5), 0 0 24px rgba(139, 92, 246, 0.2)`
                }}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rounded-full"
                style={{ 
                  background: ACCENT,
                  boxShadow: `0 0 10px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.3)`
                }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.7, ease: EASE }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}