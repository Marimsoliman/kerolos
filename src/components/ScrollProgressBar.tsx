// src/components/ScrollProgressBar.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin fixed indicator on the right edge that fills top-to-bottom as the
 * user scrolls the page. This replaces the native browser scrollbar, which
 * doesn't track correctly once Lenis (smooth scroll) takes over — that's
 * what was causing the small "cut off" purple sliver you were seeing.
 *
 * Mount this once near the root of your app (e.g. in layout.tsx, right
 * next to <SmoothScroller>), and make sure the native scrollbar is hidden
 * (see the CSS snippet below).
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 h-screen w-[3px] z-[999] pointer-events-none bg-white/5"
    >
      <motion.div
        className="w-full origin-top rounded-full"
        style={{
          height: "100%",
          scaleY,
          background:
            "linear-gradient(180deg, #A78BFA 0%, #8B5CF6 60%, #7C3AED 100%)",
          boxShadow: "0 0 12px rgba(139,92,246,0.6)",
        }}
      />
    </div>
  );
}