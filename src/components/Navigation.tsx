// src/components/Navigation.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop" },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // ⚡ الناف تختفي أول ما تسكرول لتحت وتظهر أول ما تسكرول لفوق
  // + خلفية زجاجية عند السكرول
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY <= 20) setHidden(false);
      else if (currentY > lastY + 2) setHidden(true);
      else if (currentY < lastY - 2) setHidden(false);
      lastY = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: hidden ? "-160%" : 0 }}
      transition={{
        y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.4 },
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          className={`
            relative backdrop-blur-xl transition-all duration-700 ease-out rounded-full px-4 py-2.5 sm:px-5
            ${scrolled ? "bg-white/[0.07]" : "bg-transparent"}
          `}
        >
          {/* إضاءة علوية */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.20] to-transparent rounded-full -translate-y-[0.5px]" />

          {/* تدرج داخلي */}
          <div className="absolute inset-0 h-1/2 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <Link href="/" className="flex items-center flex-shrink-0" aria-label="Kerolos Home">
              <Image src="/images/kairoslogoo.png" alt="Kerolos Logo" width={110} height={28} className="h-5 sm:h-7 w-auto object-contain brightness-0 invert" priority />
            </Link>

            {/* ⚡ اللينكات باينة نص على كل المقاسات */}
            <nav className="flex items-center gap-1.5 sm:gap-4" role="navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[13px] font-medium whitespace-nowrap ${
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Let's Talk - باين على كل المقاسات (أصغر على الموبايل) */}
            <Link
              href="/contact"
              className="flex-shrink-0 px-2 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 bg-[#8B5CF6] text-white rounded-full text-[10px] sm:text-[13px] font-medium border border-[#8B5CF6] hover:bg-[#7C3AED] transition-all hover:shadow-[0_8px_24px_rgba(139,92,246,0.4)]"
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
