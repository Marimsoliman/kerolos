// src/components/LineReveal.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface LineRevealProps {
  className?: string;
  delay?: number;
  direction?: "left" | "right" | "center";
}

export default function LineReveal({
  className = "",
  delay = 0,
  direction = "left",
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const origins: Record<string, string> = {
    left: "left",
    right: "right",
    center: "center",
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="h-px bg-burgundy/15 w-full"
        style={{ transformOrigin: origins[direction] }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 1.2,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </div>
  );
}