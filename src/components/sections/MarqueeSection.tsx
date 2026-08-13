// src/components/sections/MarqueeSection.tsx
"use client";

const items = [
  "Brand Identity",
  "Visual Design",
  "Logo Creation",
  "Art Direction",
  "Typography",
  "Creative Strategy",
  "Brand Systems",
  "Visual Storytelling",
];

export default function MarqueeSection() {
  return (
    <section
      className="relative overflow-hidden select-none flex items-center"
      aria-hidden="true"
      style={{
  background: "#000000",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  height: "62px",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0, 0, 0, 0.4)",
}}
    >
      {/* ✨ Fade ناعم على الأطراف */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28"
        style={{
          background:
            "linear-gradient(to right, #000000 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28"
        style={{
          background:
            "linear-gradient(to left, #000000 0%, transparent 100%)",
        }}
      />

      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 mx-7 font-sans text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase"
            style={{
              color: "#FFFFFF",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {item}
            {/* ✨ فاصل أنيق */}
            <span
              style={{
                width: "20px",
                height: "1px",
                backgroundColor: "rgba(139, 92, 246, 0.4)",
              }}
            />
          </span>
        ))}
      </div>
    </section>
  );
}