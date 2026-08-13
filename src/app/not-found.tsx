// src/app/not-found.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MagneticWrapper from "@/components/MagneticWrapper";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <motion.span
          className="text-sage/15 font-display text-[10rem] md:text-[16rem] font-bold block leading-none"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          404
        </motion.span>

        <motion.h1
          className="text-burgundy font-display text-3xl md:text-4xl font-bold mb-4 -mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="text-burgundy/50 font-sans text-body-md mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <MagneticWrapper>
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-burgundy text-cream text-[0.82rem] font-sans tracking-wide rounded-full overflow-hidden"
            >
              <span className="relative z-10">Back to Home</span>
              <div className="absolute inset-0 bg-sage -translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out-expo" />
            </Link>
          </MagneticWrapper>
        </motion.div>
      </div>
    </div>
  );
}