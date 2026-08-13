"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LogoItem {
  _id: string;
  src: string;
  name?: string;
  order?: number;
}

export default function LogoWall() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // % position

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch("/api/logos");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const sortedLogos = data.sort(
              (a, b) => (a.order || 0) - (b.order || 0)
            );
            setLogos(sortedLogos);
          }
        }
      } catch (e) {
        console.error("Failed to load logos:", e);
      }
    }
    fetchLogos();
  }, []);

  // تتبع حركة السهم/الماوس داخل السكشن
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (logos.length === 0) return null;

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[60vh] w-full items-center overflow-hidden py-32 md:py-44 lg:py-52"
      style={{ backgroundColor: "#000000" }}
    >
      {/* ══════════════════════════════════════════════════
          AMBIENT LIGHT SOURCE — الإضاءة الأساسية الثابتة
          دايمًا في نص الشاشة، مش بتتحرك
          ══════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 90% at 50% 50%, rgba(139, 92, 246, 0.055) 0%, rgba(124, 58, 237, 0.032) 30%, rgba(109, 40, 217, 0.014) 55%, transparent 78%),
            radial-gradient(ellipse 75% 60% at 50% 48%, rgba(124, 58, 237, 0.030) 0%, rgba(109, 40, 217, 0.012) 45%, transparent 72%)
          `,
        }}
      />

      {/* ══════════════════════════════════════════════════
          MOUSE-FOLLOWING GLOW — إضاءة إضافية بتتبع السهم
          طبقة خفيفة فوق الأساسية، بتتحرك مع الماوس
          ══════════════════════════════════════════════════ */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        animate={{
          background: `radial-gradient(circle 500px at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 35%, transparent 70%)`,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* ══════════════════════════════════════════════════
          DEPTH VIGNETTE
          Ultra-soft edge falloff that pulls focus inward
          ══════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 95% 85% at 50% 50%, transparent 42%, rgba(0, 0, 0, 0.38) 76%, rgba(0, 0, 0, 0.72) 100%)
          `,
        }}
      />

      {/* Film grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.017]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 sm:px-12 md:px-16 lg:px-24">
        <ul className="grid grid-cols-2 sm:grid-cols-3 items-center justify-center gap-x-16 gap-y-20 sm:gap-x-20 sm:gap-y-24 md:gap-x-28 md:gap-y-32 lg:gap-x-32 lg:gap-y-36">
          {logos.map((logo, index) => (
            <motion.li
              key={logo._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.06 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.name || "Brand Logo"}
                className="h-auto w-auto max-h-[42px] sm:max-h-[48px] md:max-h-[56px] lg:max-h-[62px] max-w-[104px] sm:max-w-[122px] md:max-w-[138px] object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}