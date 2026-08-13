// src/components/ScrollReveal.tsx
"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, TargetAndTransition } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  amount?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.9,
  once = true,
  amount = 0.2,
  distance = 60,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const directions: Record<string, TargetAndTransition> = {
    up: { y: distance, x: 0, opacity: 0 },
    down: { y: -distance, x: 0, opacity: 0 },
    left: { x: distance, y: 0, opacity: 0 },
    right: { x: -distance, y: 0, opacity: 0 },
    none: { y: 0, x: 0, opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={directions[direction]}
      animate={
        isInView ? { x: 0, y: 0, opacity: 1 } : directions[direction]
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}