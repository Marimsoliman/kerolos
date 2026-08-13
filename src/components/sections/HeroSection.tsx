"use client";
 
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
  Variants,
  MotionValue,
} from "framer-motion";
 
const PORTRAIT_SRC = "/images/kairos-portofolio4.png";
// ✅ تحسين الـ masks
const FADE_MASK =
  "linear-gradient(to bottom, #000 0%, #000 90%, rgba(0,0,0,0.8) 95%, transparent 100%)";
const FADE_MASK_MOBILE =
  "linear-gradient(to bottom, #000 0%, #000 80%, rgba(0,0,0,0.6) 90%, transparent 100%)";
 
function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FilmGrainOverlay() {
  return <div aria-hidden className="absolute inset-0 pointer-events-none z-[6] opacity-[0.03] mix-blend-overlay" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}} />;
}

function GridTexture() {
  return <div aria-hidden className="absolute inset-0 pointer-events-none z-[1]" style={{opacity:0.022, backgroundImage:`linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`, backgroundSize:"72px 72px"}} />;
}

function VignetteOverlay() {
  return <div aria-hidden className="absolute inset-0 pointer-events-none z-[5]" style={{background:`radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)`}} />;
}
 
interface PortraitProps {
  smoothMouseX?: MotionValue<number>;
  smoothMouseY?: MotionValue<number>;
  scrollParallaxY?: MotionValue<number>;
  mask?: string;
  scale?: number;
}

function Portrait({ smoothMouseX, smoothMouseY, scrollParallaxY, mask, scale = 1 }: PortraitProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const shouldReduce = useReducedMotion();
  
  useEffect(() => { 
    if (imgRef.current?.complete && imgRef.current?.naturalWidth) setLoaded(true); 
  }, []);
  
  const tx = useTransform(smoothMouseX || useMotionValue(0), [-0.5, 0.5], shouldReduce ? [0, 0] : [-8, 8]);
  const ty = useTransform(smoothMouseY || useMotionValue(0), [-0.5, 0.5], shouldReduce ? [0, 0] : [-6, 6]);
  
  return (
    <motion.div 
      style={{ y: scrollParallaxY || 0, x: tx, translateY: ty }} 
      className="relative w-full h-full pointer-events-none select-none"
    >
      <div 
        className="relative w-full h-full overflow-hidden" 
        style={{ 
          opacity: loaded ? 1 : 0, 
          transition: "opacity 1s ease-out", 
          WebkitMaskImage: mask || FADE_MASK, 
          maskImage: mask || FADE_MASK 
        }}
      >
        <img 
          ref={imgRef} 
          src={PORTRAIT_SRC} 
          alt="Portfolio portrait" 
          width={1200} 
          height={1600} 
          className="w-full h-full object-contain object-top"
          style={{ 
            filter: "brightness(1.06) contrast(1.08)",
            transform: `scale(${scale})`,
            transformOrigin: "top center"
          }}
          onLoad={() => setLoaded(true)} 
          loading="eager" 
        />
      </div>
    </motion.div>
  );
}
 
const wordVariants: Variants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.3 + i * 0.12, duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: d, duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }),
};

// ✅ Animation للـ Stats
const statVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: 1.2 + i * 0.1, 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    }
  })
};
 
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  
  // ✅ إضافة useInView للـ stats
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const smoothMouseX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const smoothMouseY = useSpring(rawY, { stiffness: 80, damping: 20 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }, [rawX, rawY]);
 
  const { scrollYProgress } = useScroll({ 
    target: sectionRef, 
    offset: ["start start", "end start"] 
  });
  
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const portraitScrollY = useTransform(smoothScrollY, [0, 1], [0, shouldReduce ? 0 : 80]);
  const contentOpacity = useTransform(smoothScrollY, [0, 0.45], [1, 0]);
  const contentY = useTransform(smoothScrollY, [0, 1], [0, shouldReduce ? 0 : 90]);
  const glowX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const glowY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);
 
  const headingWords = ["Building", "Impactful", "Digital", "Experiences"];
  const stats = [
    { v: "150+", l: "Projects" }, 
    { v: "150+", l: "Clients" }, 
    { v: "5+", l: "Years" }
  ];
 
  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMove} 
      className="relative w-full min-h-screen bg-[#050505] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ 
          background: "radial-gradient(ellipse 90% 70% at 50% 50%, #0c0a14 0%, #06050a 60%, #030304 100%)" 
        }} />
        <div className="absolute inset-0" style={{ 
          background: `radial-gradient(circle at 15% 15%, rgba(168,85,247,0.3), transparent 45%), radial-gradient(circle at 70% 55%, rgba(139,92,246,0.35), transparent 50%)` 
        }} />
        <GridTexture />
        <motion.div 
          className="absolute z-[2] rounded-full w-[500px] h-[500px] right-[-80px] top-[35%] -mt-[250px] blur-[100px] md:w-[1000px] md:h-[1000px] md:right-[-100px] md:top-1/2 md:-mt-[500px] md:blur-[180px]" 
          style={{ 
            background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 80%)", 
            x: glowX, 
            y: glowY,
          }} 
          animate={{ scale: [1, 1.08, 1] }} 
          transition={{ duration: 7, repeat: Infinity }} 
        />
        <VignetteOverlay />
        <FilmGrainOverlay />
      </div>
 
      <motion.div 
        className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20" 
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* ========== DESKTOP + TABLET ========== */}
        <div className="hidden md:grid md:grid-cols-[42%_58%] items-center min-h-screen">
          <div className="flex flex-col justify-center py-[120px] pr-6">
            
            <motion.div 
              custom={0.15} 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible" 
              className="mb-8"
            >
              <span className="text-[11px] tracking-[0.22em] uppercase text-white/50">
                Full Stack Developer • Graphic Designer
              </span>
            </motion.div>
 
            <div className="mb-8 flex flex-col">
              {headingWords.map((word, i) => (
                <div key={word} className="overflow-hidden py-1">
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="block font-black tracking-[-0.03em]"
                    style={{
                      fontSize: "clamp(44px, 5.2vw, 84px)",
                      lineHeight: "1.15",
                      paddingBottom: "0.18em",
                      marginBottom: "-0.18em",
                      fontFamily: "var(--font-display)",
                      // ✅ تحسين الـ gradient عشان يشتغل على Vercel
                      ...(word === "Digital"
                        ? {
                            backgroundImage: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 55%, #7c3aed 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                          }
                        : { color: "#fff" }),
                    }}
                  >
                    {word}
                  </motion.span>
                </div>
              ))}
            </div>
 
            <motion.p 
              custom={0.8} 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible" 
              className="text-[15px] leading-[1.75] text-white/50 max-w-[460px] mb-10"
            >
              I design and develop high-performance digital experiences that combine modern design, clean code, and seamless interaction.
            </motion.p>
 
            <motion.div 
              custom={1.0} 
              variants={fadeUpVariants} 
              initial="hidden" 
              animate="visible" 
              className="mb-14"
            >
              <Link 
                href="/contact" 
                className="inline-flex h-[60px] px-9 items-center gap-3 rounded-full border border-[#8b5cf6]/40 text-white hover:bg-[#8b5cf6] transition-all duration-300"
              >
                Let's Build Together <ArrowRightIcon />
              </Link>
            </motion.div>
 
            {/* ✅ Stats مع animation */}
            <motion.div 
              ref={statsRef}
              className="flex"
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.l}
                  custom={i}
                  variants={statVariants}
                  className={`px-7 ${i === 0 ? "pl-0" : ""} ${i < 2 ? "border-r border-white/10" : ""}`}
                >
                  <div className="text-[28px] font-bold tracking-tight text-[#8B5CF6] drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]">
                    {s.v}
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest mt-1">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
 
          {/* ✅ Portrait للـ Desktop */}
          <motion.div 
            className="relative flex items-end justify-center" 
            style={{ height: "120vh", marginTop: "-9rem" }} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1.2 }}
          >
            <div className="w-full h-full">
              <Portrait 
                smoothMouseX={smoothMouseX} 
                smoothMouseY={smoothMouseY} 
                scrollParallaxY={portraitScrollY} 
              />
            </div>
          </motion.div>
        </div>
 
        {/* ========== MOBILE ========== */}
        <div className="md:hidden flex flex-col items-center text-center min-h-screen pt-0 pb-12">
          {/* ✅ صورة محسّنة للموبايل */}
          <motion.div 
            className="relative overflow-hidden"
            style={{
              width: "100%",
              height: "85vh",
              minHeight: "600px",
              maxHeight: "750px",
              marginTop: "4rem",
            }}
            initial={{ opacity: 0, scale: 1.1 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 flex items-start justify-center">
              <Portrait 
                smoothMouseX={smoothMouseX} 
                smoothMouseY={smoothMouseY} 
                mask={FADE_MASK_MOBILE}
                scale={1.15}
              />
            </div>
          </motion.div>
          
          {/* ✅ Content */}
          <div className="mt-6 w-full px-5 relative z-20">
            <motion.div 
              custom={0.15}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mb-5"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-white/50">
                Full Stack Developer • Graphic Designer
              </span>
            </motion.div>
 
            <div className="mb-6">
              {headingWords.map((word, i) => (
                <div key={word} className="overflow-hidden py-1">
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="block font-black tracking-[-0.03em]"
                    style={{
                      fontSize: "clamp(36px, 10vw, 52px)",
                      lineHeight: "1.1",
                      paddingBottom: "0.12em",
                      marginBottom: "-0.12em",
                      fontFamily: "var(--font-display)",
                      ...(word === "Digital"
                        ? {
                            backgroundImage: "linear-gradient(135deg, #c4b5fd, #8b5cf6)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                          }
                        : { color: "#fff" }),
                    }}
                  >
                    {word}
                  </motion.span>
                </div>
              ))}
            </div>
 
            {/* ✅ Stats للموبايل */}
            <motion.div 
              className="grid grid-cols-3 w-full max-w-[340px] mx-auto mt-8 border-t border-white/10 pt-6 gap-4"
              initial="hidden"
              animate="visible"
            >
              {stats.map((s, i) => (
                <motion.div 
                  key={s.l}
                  custom={i}
                  variants={statVariants}
                  className={`${i < 2 ? "border-r border-white/10" : ""}`}
                >
                  <div className="text-[24px] font-bold text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                    {s.v}
                  </div>
                  <div className="text-[9px] text-white/40 uppercase tracking-wider mt-1">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </motion.div>
 
            <motion.div
              custom={1.3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <Link 
                href="/contact" 
                className="mt-8 w-full max-w-[320px] inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-[#8b5cf6]/40 text-white text-[14px] hover:bg-[#8b5cf6]/10 transition-all duration-300"
              >
                Let's Build Together <ArrowRightIcon />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}