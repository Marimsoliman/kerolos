// src/components/sections/ScrollTextReveal.tsx
"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const NOISE_DATA_URI =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2Ij48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==";

// ─────────────────────────────────────────
// تحويل النص لـ tokens (كلمات + فواصل أسطر)
// ─────────────────────────────────────────
type Token = { type: "word"; value: string } | { type: "break" };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // نقسم على الـ \n\n أولاً (فقرات)
  const paragraphs = text.split(/\n\n+/);

  paragraphs.forEach((paragraph, pIndex) => {
    // نقسم كل فقرة على الـ \n (سطر جديد عادي)
    const lines = paragraph.split(/\n/);

    lines.forEach((line, lIndex) => {
      // نقسم كل سطر على المسافات (كلمات)
      const words = line.trim().split(/\s+/).filter(Boolean);
      words.forEach((word) => {
        tokens.push({ type: "word", value: word });
      });

      // لو فيه أسطر تانية في نفس الفقرة
      if (lIndex < lines.length - 1) {
        tokens.push({ type: "break" });
      }
    });

    // لو فيه فقرات تانية — نضيف break مزدوج (مسافة أكبر)
    if (pIndex < paragraphs.length - 1) {
      tokens.push({ type: "break" });
      tokens.push({ type: "break" });
    }
  });

  return tokens;
}

export default function ScrollTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  const targetX = useRef(50);
  const targetY = useRef(50);
  const currentX = useRef(50);
  const currentY = useRef(50);

  const [styleVars, setStyleVars] = useState<CSSProperties>({
    "--light-x": "50%",
    "--light-y": "50%",
  } as CSSProperties);

  // ═══════════════════════════════════════════════════════
  // CURSOR TRACKING
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      targetX.current = Math.max(-20, Math.min(120, x));
      targetY.current = Math.max(-20, Math.min(120, y));
    };

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    let rafId: number;
    const updatePosition = () => {
      const lerpFactor = 0.045;
      currentX.current +=
        (targetX.current - currentX.current) * lerpFactor;
      currentY.current +=
        (targetY.current - currentY.current) * lerpFactor;

      setStyleVars({
        "--light-x": `${currentX.current}%`,
        "--light-y": `${currentY.current}%`,
      } as CSSProperties);

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ═══════════════════════════════════════════════════════
  // النص — استخدم \n\n للفقرات الجديدة
  // ═══════════════════════════════════════════════════════
  const text =
    "If your vision is to build a brand that elevates your business and leaves a lasting impression on your customers, we’re here to bring that vision to life.Explore some of our featured work below and discover how we’ve helped our clients build brands that leave a lasting impact.";

  const tokens = useMemo(() => tokenize(text), [text]);

  // عدد الكلمات فقط (بدون الـ breaks) — للحساب الصحيح للـ scroll progress
  const wordCount = useMemo(
    () => tokens.filter((t) => t.type === "word").length,
    [tokens]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "center center"],
  });

  // نعمل counter للكلمات عشان نحسب الـ index بشكل صحيح
  let wordIndex = 0;

  return (
    <section
      ref={containerRef}
      className="relative w-full py-[clamp(15rem,35vh,40rem)] overflow-hidden"
      aria-label="Editorial Statement"
      style={{
        background: "#000000",
        ...styleVars,
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          CINEMATIC BACKGROUND SYSTEM
          ═══════════════════════════════════════════════════════ */}

      {/* Volumetric Cursor Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(
              ellipse 1300px 950px at var(--light-x) var(--light-y),
              rgba(139, 92, 246, 0.18) 0%,
              rgba(139, 92, 246, 0.12) 18%,
              rgba(124, 58, 237, 0.08) 32%,
              rgba(109, 40, 217, 0.04) 52%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 850px 650px at var(--light-x) var(--light-y),
              rgba(139, 92, 246, 0.09) 0%,
              rgba(59, 130, 246, 0.05) 30%,
              rgba(109, 40, 217, 0.025) 50%,
              transparent 72%
            ),
            radial-gradient(
              ellipse 2000px 1400px at var(--light-x) var(--light-y),
              rgba(124, 58, 237, 0.045) 0%,
              rgba(109, 40, 217, 0.02) 40%,
              transparent 65%
            )
          `,
          willChange: "background",
        }}
      />

      {/* Depth Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[0]"
        style={{
          background: `
            radial-gradient(
              ellipse 75% 65% at 50% 50%,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(124, 58, 237, 0.04) 35%,
              rgba(109, 40, 217, 0.015) 60%,
              transparent 85%
            )
          `,
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.015]"
        style={{
          backgroundImage: `url("${NOISE_DATA_URI}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-14">
        <div
          className="font-display font-bold tracking-tight"
          style={{
            fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
            lineHeight: 1.3,
          }}
        >
          {tokens.map((token, i) => {
            if (token.type === "break") {
              // ✅ سطر جديد — br مع مسافة إضافية
              return <br key={`br-${i}`} />;
            }

            // ✅ كلمة عادية
            const currentWordIndex = wordIndex;
            wordIndex++;

            return (
              <Word
                key={`word-${i}`}
                word={token.value}
                index={currentWordIndex}
                totalWords={wordCount}
                scrollYProgress={scrollYProgress}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface WordProps {
  word: string;
  index: number;
  totalWords: number;
  scrollYProgress: MotionValue<number>;
}

function Word({ word, index, totalWords, scrollYProgress }: WordProps) {
  const start = index / totalWords;
  const end = (index + 1) / totalWords;

  const color = useTransform(
    scrollYProgress,
    [start, end],
    ["rgba(255, 255, 255, 0.25)", "rgba(255, 255, 255, 1)"]
  );

  return (
    <motion.span
      style={{ color }}
      className="inline-block mr-[0.35em] transition-colors duration-100"
    >
      {word}
    </motion.span>
  );
}