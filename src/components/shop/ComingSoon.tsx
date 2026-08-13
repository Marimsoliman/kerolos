"use client";

import Link from "next/link";
import { CINEMATIC_BG } from "@/lib/theme";

const BG_STYLE = {
  backgroundColor: "#000000",
  backgroundImage: CINEMATIC_BG,
} as const;

export default function ComingSoon() {
  return (
    <div className="min-h-screen pt-32 pb-20 relative flex items-center" style={BG_STYLE}>
      <div className="max-w-[800px] mx-auto px-5 md:px-8 relative z-10 text-center">
        <span className="text-accent text-[11px] md:text-xs font-sans uppercase block mb-3 tracking-widest">
          Shop
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
          Coming Soon
        </h1>
        <p className="text-white/50 font-sans text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The shop is currently unavailable. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 bg-[#8B5CF6] text-white rounded-full text-[14px] font-medium hover:bg-[#7C3AED] transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}