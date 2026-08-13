// src/components/sections/ServicesSection.tsx
"use client";

import { useLayoutEffect, useRef, useState, useMemo, useEffect } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CINEMATIC_BG } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });

const HERO_BG: CSSProperties = {
  backgroundColor: "#000000",
  backgroundImage: CINEMATIC_BG,
};

type Service = {
  number: string;
  title: string;
  description: string;
  tagline: string;
  image: string;
  metrics: string[];
  accent: string;
  isGif?: boolean;
};

const services: Service[] = [
  {
  number: "01",
  title: "Brand Identity\nDesigner",
  description:
    "I transform ideas into distinctive brand identities that feel clear, intentional, and impossible to ignore. From the first concept to the final visual system, I create brands that look consistent and communicate clearly.",
  tagline: "VISUAL SYSTEM",
  image: "/images/media/brand-identity.webm",
  metrics: ["Logo Systems", "Typography", "Color Architecture"],
  accent: "#8B5CF6",
  isGif: true,
},
  {
    number: "02",
    title: "Creative\nDirector",
    description:
      "I bring ideas to life through thoughtful design, clear direction, and a strong visual point of view. Every project starts with a question, a strategy, and a purpose — because good design is never just about making things look good.",
    tagline: "ART DIRECTION",
    image: "/images/media/brand-strategy2.png",
    metrics: ["Visual Strategy", "Art Direction", "Design Systems"],
    accent: "#3B82F6",
  },
  {
    number: "03",
    title: "Brand\nStrategist",
    description:
      "A brand is more than a logo, a color palette, or a beautiful visual identity. It's about understanding who you are, what you stand for, and why people should choose you.",
    tagline: "POSITIONING",
    image: "/images/media/brand-Director2.png",
    metrics: ["Market Position", "Brand Voice", "Strategy"],
    accent: "#A78BFA",
  },
];

// ══════════════════════════════════════════════════════════
// IN-APP BROWSER DETECTION
// Social apps (Instagram, Facebook, TikTok, WhatsApp, Twitter/X,
// LinkedIn, Line, KakaoTalk, WeChat, Telegram, Snapchat...) open
// links inside their own embedded WebView instead of the user's
// real mobile browser. These WebViews implement custom
// show/hide toolbar behavior that conflicts with how GSAP
// ScrollTrigger pins elements (position: fixed / transform),
// corrupting the scroll-progress calculation. There is no
// universal fix for this — every one of these apps behaves
// slightly differently and it's a known, long-standing class of
// bugs across the entire web (not specific to this codebase).
// The only reliable strategy is to detect these WebViews via
// their user agent and serve a simpler, non-pinned layout that
// doesn't depend on precise scroll-distance math at all.
// ══════════════════════════════════════════════════════════
function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|KAKAOTALK|NAVER|MicroMessenger|Twitter|TikTok|musical_ly|Snapchat|Pinterest|LinkedInApp|WhatsApp|Telegram/i.test(
    ua
  );
}

// Returns null until we've checked on the client (avoids SSR
// mismatch), then true/false permanently for this session.
function useIsInAppBrowser() {
  const [value, setValue] = useState<boolean | null>(null);
  useEffect(() => {
    setValue(isInAppBrowser());
  }, []);
  return value;
}

export default function ServicesSection() {
  const inApp = useIsInAppBrowser();

  // Render nothing but the background until we know which
  // version to use — prevents a flash of the wrong experience
  // or GSAP mounting then instantly getting torn down.
  if (inApp === null) {
    return (
      <div id="services" style={{ minHeight: "100vh", ...HERO_BG }} />
    );
  }

  return inApp ? <StackedServices /> : <PinnedServices />;
}

// ==========================================
// DESKTOP + NORMAL MOBILE BROWSERS
// GSAP pinned horizontal-scroll experience — scroll/pin logic UNCHANGED.
// ==========================================
function PinnedServices() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      const count = panels.length;

      const getViewportWidth = () =>
        window.visualViewport?.width ?? window.innerWidth;

      const getDistance = () =>
        Math.max(track.scrollWidth - getViewportWidth(), 0);

      let ticking = false;
      const updateActiveIndex = (idx: number) => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (idx !== indexRef.current) {
              indexRef.current = idx;
              setActiveIndex(idx);
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        const media = panel.querySelector<HTMLElement>("[data-panel-media]");
        if (!content || !media) return;
        gsap.set(content, { opacity: 0, y: 60 });
        gsap.set(media, { opacity: 0, scale: 1.05 });
      });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: sticky,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.round(self.progress * (count - 1)),
              count - 1
            );
            updateActiveIndex(idx);
          },
          onRefresh: (self) => {
            self.animation?.progress(self.progress);
          },
        },
      });

      master.to(
        track,
        { x: () => -getDistance(), ease: "none", duration: count - 1 },
        0
      );

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        const media = panel.querySelector<HTMLElement>("[data-panel-media]");
        if (!content || !media) return;

        master.to(
          [content, media],
          { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.6 },
          i - 0.6
        );
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      const imgs = outer.querySelectorAll("img");
      imgs.forEach((img) => {
        if (!img.complete) img.addEventListener("load", onLoad, { once: true });
      });

      return () => {
        window.removeEventListener("load", onLoad);
      };
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} id="services" className="relative">
      <div
        ref={stickyRef}
        className="relative w-full overflow-hidden"
        style={{
          ...HERO_BG,
          contain: "layout style paint",
height: "100vh",
minHeight: "100dvh",
}}
      >
        {/* Film grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.017]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Ambient bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-[0]"
          style={{
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "55%",
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(139, 92, 246, 0.28) 0%, rgba(124, 58, 237, 0.12) 45%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <Header />

        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${services.length * 100}vw` }}
        >
          {services.map((service, i) => (
            <HPanel
              key={service.number}
              service={service}
              index={i}
              isActive={activeIndex === i}
            />
          ))}
        </div>

        <ProgressDots total={services.length} activeIndex={activeIndex} />
      </div>
    </div>
  );
}

// ==========================================
// IN-APP BROWSER FALLBACK
// Same exact visual design as the desktop card, just stacked
// vertically with normal document scroll — no pin, no scrub, no
// scroll-distance math. Reveal uses framer-motion's whileInView
// (IntersectionObserver under the hood), which is rock-solid in
// every WebView because it doesn't care about scroll *speed* or
// *distance*, only whether the element is visible on screen.
// ==========================================
function StackedServices() {
  return (
    <div id="services" className="relative w-full" style={{ ...HERO_BG }}>
      {/* Film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.017]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Ambient bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[0]"
        style={{
          top: "8%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "35%",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(139, 92, 246, 0.28) 0%, rgba(124, 58, 237, 0.12) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 px-5 py-16 md:px-12">
        <h2 className="font-display m-0 mb-10 text-[clamp(28px,4vw,52px)] leading-[0.95] font-bold tracking-[-0.03em] text-white">
          What I Do
          <span className="text-accent">.</span>
        </h2>

        <div className="flex flex-col gap-8">
          {services.map((service, i) => (
            <StackedPanel key={service.number} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StackedPanel({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full max-w-[860px] flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm md:flex-row border border-white/10"
      style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.22)" }}
    >
      {/* ── Image side ── */}
      <div
        className="relative shrink-0 overflow-hidden bg-black/20 w-full md:w-[52%]"
        style={{
          aspectRatio: service.isGif ? "16 / 11" : "16 / 12",
          minHeight: "220px",
        }}
      >
        {service.isGif ? (
  <video
    src={service.image}
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute inset-0 h-full w-full object-cover"
  />
) : (
  <Image
    src={service.image}
    alt={service.title.replace("\n", " ")}
    fill
    className="object-contain"
    sizes="(max-width: 768px) 100vw, 52vw"
    loading={index === 0 ? "eager" : "lazy"}
    priority={index === 0}
    quality={90}
  />
)}
      </div>

      {/* ── Content side ── */}
      <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-9">
        {/* Tagline */}
        <div className="mb-3 flex items-center gap-2.5">
          <div
            className="h-[3px] w-5 rounded-full"
            style={{ background: service.accent }}
          />
          <span
            className="text-[9px] font-bold tracking-[0.32em] uppercase"
            style={{ color: service.accent }}
          >
            {service.tagline}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display m-0 mb-3 text-[clamp(20px,2.4vw,36px)] leading-[1.05] font-bold tracking-[-0.025em] whitespace-pre-line text-white">
          {service.title}
          <span style={{ color: service.accent }}>.</span>
        </h3>

        {/* Description */}
        <p className="m-0 mb-5 max-w-[360px] text-[clamp(12px,0.9vw,13.5px)] leading-[1.7] text-white/55">
          {service.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-1.5">
          {service.metrics.map((metric) => (
            <span
              key={metric}
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em]"
              style={{
                color: service.accent,
                background: `${service.accent}20`,
                border: `1px solid ${service.accent}45`,
              }}
            >
              {metric}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// HEADER (pinned version)
// ==========================================
function Header() {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 left-0 z-20"
      style={{ padding: "clamp(20px, 3vw, 36px) clamp(20px, 4vw, 60px)" }}
    >
      <h2 className="font-display m-0 text-[clamp(28px,4vw,52px)] leading-[0.95] font-bold tracking-[-0.03em] text-white">
        What I Do
        <span className="text-accent">.</span>
      </h2>
    </div>
  );
}

// ==========================================
// HORIZONTAL PANEL (pinned version)
// FIX: on mobile the card stacks as flex-col (image on top of
// text). The image container previously used minHeight:100%,
// which made it fill almost the entire card height inside a
// capped max-h-[400px] box — pushing the text out and clipping
// it via overflow-hidden, since this section has no vertical
// scroll (it's pinned). Now the image gets a fixed share of the
// height on mobile (and keeps its original % width on desktop
// where the layout is flex-row), and the card gets a taller cap
// on small screens so the text has room to breathe. The GSAP
// pin/scrub/scroll-distance logic above is untouched.
//
// FIX 2: this panel was rendering EVERY service — including the
// isGif: true video service — through next/image's <Image>
// component with unoptimized={service.isGif}. next/image only
// knows how to handle actual image formats (png/jpg/webp/gif as
// a static image); it cannot render a .webm video file at all,
// so the "unoptimized" flag did nothing useful and the video
// silently failed to render. The in-app-browser fallback
// (StackedPanel below) already branched to a real <video> tag
// for isGif services — this panel just never had that branch.
// Now it does, matching StackedPanel exactly.
// ==========================================
function HPanel({
  service,
  index,
  isActive,
}: {
  service: Service;
  index: number;
  isActive: boolean;
}) {
  return (
    <div
      data-panel
      className="relative flex h-full w-screen shrink-0 items-center justify-center px-5 pt-20 pb-14 md:px-12 lg:px-16"
      style={{ contain: "layout style" }}
    >
      <div
        data-panel-content
        className="flex h-full max-h-[560px] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm transition-shadow duration-500 md:max-h-[400px] md:flex-row border border-white/10"
        style={{
          boxShadow: isActive
            ? "0 24px 64px rgba(0,0,0,0.38)"
            : "0 12px 40px rgba(0,0,0,0.22)",
          willChange: isActive ? "box-shadow" : "auto",
        }}
      >
        {/* ── Image side ── */}
        <div
          className={`relative shrink-0 overflow-hidden bg-black/20 h-[42%] w-full md:h-full ${
            service.isGif ? "md:w-[58%]" : "md:w-[52%]"
          }`}
        >
          <div
            data-panel-media
            className="absolute inset-0"
            style={{ contain: "strict" }}
          >
            {service.isGif ? (
              <video
                src={service.image}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={service.image}
                alt={service.title.replace("\n", " ")}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 58vw"
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                quality={90}
              />
            )}
          </div>
        </div>

        {/* ── Content side ── */}
        <div className="flex flex-1 flex-col justify-center overflow-hidden p-5 md:p-8 lg:p-9">
          {/* Tagline */}
          <div className="mb-2 flex items-center gap-2.5 md:mb-3">
            <div
              className="h-[3px] w-5 rounded-full"
              style={{ background: service.accent }}
            />
            <span
              className="text-[9px] font-bold tracking-[0.32em] uppercase"
              style={{ color: service.accent }}
            >
              {service.tagline}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display m-0 mb-2 text-[clamp(18px,2.4vw,36px)] leading-[1.05] font-bold tracking-[-0.025em] whitespace-pre-line text-white md:mb-3">
            {service.title}
            <span style={{ color: service.accent }}>.</span>
          </h3>

          {/* Description */}
          <p className="m-0 mb-3 max-w-[360px] text-[clamp(11px,0.9vw,13.5px)] leading-[1.55] text-white/55 line-clamp-3 md:mb-5 md:leading-[1.7] md:line-clamp-none">
            {service.description}
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap gap-1.5">
            {service.metrics.map((metric) => (
              <span
                key={metric}
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] transition-transform duration-200 hover:scale-105"
                style={{
                  color: service.accent,
                  background: `${service.accent}20`,
                  border: `1px solid ${service.accent}45`,
                }}
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PROGRESS DOTS (pinned version)
// ==========================================
function ProgressDots({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  const accent = useMemo(
    () => services[activeIndex]?.accent || "#8B5CF6",
    [activeIndex]
  );

  return (
    <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{
            width: i === activeIndex ? 36 : 6,
            background:
              i === activeIndex
                ? accent
                : i < activeIndex
                  ? `${accent}55`
                  : "rgba(255,255,255,0.15)",
            willChange:
              i === activeIndex ||
              i === activeIndex - 1 ||
              i === activeIndex + 1
                ? "width, background"
                : "auto",
          }}
        />
      ))}
    </div>
  );
}