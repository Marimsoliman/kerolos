// src/app/about/AboutPageContent.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import ScrollReveal from "@/components/ScrollReveal";
import MagneticWrapper from "@/components/MagneticWrapper";
import { CINEMATIC_BG } from "@/lib/theme";

/* ============================================================
   DATA
   ============================================================ */

const services = [
  {
    number: "01",
    title: "Brand Identity",
    description:
      "Strategic brand systems that define who you are and how the world sees you.",
  },
  {
    number: "02",
    title: "Logo Design",
    description:
      "Distinctive, timeless marks crafted to be instantly recognizable and memorable.",
  },
  {
    number: "03",
    title: "Creative Direction",
    description:
      "Guiding the full visual language of a brand across every touchpoint.",
  },
  {
    number: "04",
    title: "Website Design",
    description:
      "Editorial, modern interfaces that translate brand identity into digital experience.",
  },
  {
    number: "05",
    title: "Front-End Development",
    description:
      "Fast, responsive builds using React, Next.js and TypeScript, pixel-perfect every time.",
  },
  {
    number: "06",
    title: "Back-End Development",
    description:
      "Reliable, scalable systems built with .NET and Node.js to power your product.",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description: "Understanding your goals, audience and vision.",
  },
  {
    number: "02",
    title: "Design",
    description: "Creating unique branding and interfaces.",
  },
  {
    number: "03",
    title: "Develop",
    description: "Building fast, responsive and scalable websites.",
  },
  {
    number: "04",
    title: "Launch",
    description: "Delivering a polished digital experience ready for growth.",
  },
];

const pillars = [
  {
    title: "Creative Strategy",
    description:
      "Every project starts with a clear strategic foundation, so design decisions always serve a purpose.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Beautiful Design",
    description:
      "Editorial, considered visual identities that feel premium, timeless and unmistakably yours.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M4 20L14.5 9.5M14.5 9.5l2-2 2.5 2.5-2 2M14.5 9.5l3 3M6 18l-1.5 3.5L8 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Modern Development",
    description:
      "Clean, scalable code and fast, responsive builds engineered for performance and growth.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M8 8L4 12l4 4M16 8l4 4-4 4M13.5 6L10.5 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const stats = [
  { number: "150+", label: "Projects" },
  { number: "150+", label: "Clients" },
  { number: "5+", label: "Years Experience" },
  { number: "99%", label: "Client Satisfaction" },
];

export default function AboutPageContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end center"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      {/* ============================================================
          SECTION 1 — HERO FULL SCREEN - CINEMATIC DARK BACKGROUND
          ============================================================ */}
      <section
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "#000000",
          backgroundImage: CINEMATIC_BG,
        }}
      >
        {/* Film grain overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.017]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Soft ambient bloom layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-[0]"
          style={{
            top: "-32%",
            left: "-28%",
            width: "68%",
            height: "75%",
            background: "radial-gradient(ellipse 100% 100% at 42% 38%, rgba(139, 92, 246, 0.32) 0%, rgba(124, 58, 237, 0.14) 42%, transparent 68%)",
            filter: "blur(70px)",
          }}
        />

        {/* Hero Content Container */}
        <motion.div
          style={{ scale: heroScale }}
          className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 w-full relative z-10 py-20"
        >
          <div className="max-w-5xl mx-auto">
            {/* Decorative Top Line */}
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "center" }}
            >
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-orange-600 to-transparent" />
            </motion.div>

            {/* Label — "About Us" */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-accent text-label font-sans uppercase tracking-[0.2em] whitespace-nowrap">
                About Us
              </span>
              <motion.span
                className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>

            {/* HEADING */}
            <div className="mb-12 md:mb-14">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white leading-tight">
                {/* Line 1 */}
                <motion.div
                  className="overflow-hidden py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    We Design Brands.
                  </motion.span>
                </motion.div>

                {/* Line 2 (Desktop) */}
                <motion.div
                  className="hidden md:block overflow-hidden py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    Every
                  </motion.span>
                  <motion.span
                    className="text-accent inline-block mx-3"
                    initial={{ opacity: 0, y: 60, rotate: -8 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    Great
                  </motion.span>
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                  </motion.span>
                  <motion.span
                    className="block overflow-hidden py-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      Brand Starts Here.
                    </motion.span>
                  </motion.span>
                </motion.div>

                {/* Line 2 (Mobile) */}
                <motion.div
                  className="md:hidden overflow-hidden py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    Every   
                  </motion.span>
                  <motion.span
                    className="text-accent inline-block mx-2"
                    initial={{ opacity: 0, y: 60, rotate: -8 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    Great 
                  </motion.span>
                  <motion.div
                    className="block overflow-hidden py-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 1,
                        delay: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      Brand Starts Here.
                    </motion.span>
                    
                  </motion.div>
                </motion.div>
              </h1>
            </div>

            {/* DESCRIPTION */}
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Paragraph 1 */}
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.75 }}
              >
                <motion.p
                  className="text-white/70 font-sans text-lg md:text-xl lg:text-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  We combine strategic branding with modern web development
                  to create complete digital experiences.
                </motion.p>
              </motion.div>

              {/* Paragraph 2 */}
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.95 }}
              >
                <motion.p
                  className="text-white/50 font-sans text-base md:text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.95,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  From memorable visual identities to fast, scalable
                  websites, we help businesses launch, grow and stand out.
                </motion.p>
              </motion.div>
            </div>

            {/* Decorative Bottom Line */}
            <motion.div
              className="mt-14 md:mt-16 h-px w-full max-w-2xl mx-auto bg-gradient-to-r from-transparent via-orange-600/30 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1,
                delay: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "center" }}
            />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-white/40"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-orange-600 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================
          SECTION 2 — ABOUT US
          ============================================================ */}
      <section className="py-section bg-black relative">
        <div className="absolute inset-0 opacity-[0.015]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, #FFFFFF 1px, transparent 1px),
              linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <motion.div
          className="absolute top-20 right-10 w-2 h-2 rounded-full bg-accent/30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-label font-sans text-white/60 uppercase tracking-wider">
                The Studio
              </span>
            </div>
            <h2 className="text-hero-sm font-display font-bold text-white mb-16 max-w-2xl">
              Two disciplines.{" "}
              <motion.span
                className="text-accent inline-block"
                whileInView={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 0.6 }}
              >
                One vision.
              </motion.span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Person 1 */}
            <ScrollReveal delay={0.1}>
              <motion.div
                className="rounded-2xl lg:rounded-3xl overflow-hidden h-full flex flex-col group cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10"
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="aspect-[4/5] overflow-hidden border-b border-white/10 relative">
                  <motion.img
                    src="/images/Graphic.jpeg"
                    alt="Graphic Designer"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="p-7 md:p-9 flex-1 flex flex-col relative">
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="text-micro font-sans text-accent block mb-2 uppercase tracking-widest">
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-500">
                    kerolos tarek 
                  </h3>
                  <span className="text-white/50 font-sans text-body-sm block mb-5">
                    Graphic Designer &amp; Brand Identity Specialist
                  </span>
                  <p className="text-white/60 font-sans text-body-md leading-relaxed">
                    Crafting timeless visual identities, brand systems and
                    creative experiences that help businesses communicate
                    with clarity and confidence.
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Person 2 */}
            <ScrollReveal delay={0.2}>
              <motion.div
                className="rounded-2xl lg:rounded-3xl overflow-hidden h-full flex flex-col group cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10"
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="aspect-[4/5] overflow-hidden border-b border-white/10 relative">
                  <motion.img
                    src="./images/programmer1.jepg"
                    alt="Full Stack Developer"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="p-7 md:p-9 flex-1 flex flex-col relative">
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="text-micro font-sans text-accent block mb-2 uppercase tracking-widest">
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-500">
                    mariam soliman
                  </h3>
                  <span className="text-white/50 font-sans text-body-sm block mb-5">
                    Full Stack Developer
                  </span>
                  <p className="text-white/60 font-sans text-body-md leading-relaxed">
                    Designing and developing high-performance websites and
                    digital products using modern technologies with a strong
                    focus on performance, scalability and user experience.
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* REST OF SECTIONS - Continue with same black background theme... */}
      {/* I'll provide abbreviated versions to keep response concise */}
      
      {/* SERVICES SECTION */}
      <section className="py-section-sm bg-black/95 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
          <ScrollReveal>
            <span className="text-accent text-label font-sans uppercase block mb-3 tracking-widest">
              Our Craft
            </span>
            <h2 className="text-hero-sm font-display font-bold text-white mb-5">
              What We Create
            </h2>
            <p className="text-white/50 font-sans text-body-md max-w-xl mb-10 leading-relaxed">
              Two disciplines, one seamless process — from brand strategy to
              a fully developed digital product.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.08}>
                <motion.div
                  className="bg-white/5 border-2 rounded-xl lg:rounded-2xl p-7 md:p-8 h-full relative overflow-hidden cursor-pointer group backdrop-blur-sm"
                  style={{
                    borderColor:
                      hoveredService === i ? "#8B5CF6" : "rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-accent z-0"
                    initial={{ scaleY: 0 }}
                    animate={{
                      scaleY: hoveredService === i ? 1 : 0,
                    }}
                    style={{ transformOrigin: "bottom" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />

                  <div className="relative" style={{ zIndex: 10 }}>
                    <motion.span
                      className="font-display text-3xl md:text-4xl block mb-5 font-bold transition-all duration-300"
                      animate={{
                        color:
                          hoveredService === i
                            ? "rgba(255,255,255,0.5)"
                            : "#8B5CF6",
                      }}
                    >
                      {service.number}
                    </motion.span>

                    <motion.h3
                      className="font-display text-lg md:text-xl font-bold mb-3 transition-all duration-300"
                      animate={{
                        color: hoveredService === i ? "#FFFFFF" : "#FFFFFF",
                      }}
                    >
                      {service.title}
                    </motion.h3>

                    <motion.p
                      className="font-sans text-body-sm leading-relaxed transition-all duration-300"
                      animate={{
                        color:
                          hoveredService === i
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {service.description}
                    </motion.p>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
                    style={{ zIndex: 10 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredService === i ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"
                    style={{ zIndex: 5 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: hoveredService === i ? 1 : 0,
                      scale: hoveredService === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-section bg-black">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <ScrollReveal>
            <span className="text-accent text-label font-sans uppercase block mb-3 tracking-widest">
              How We Work
            </span>
            <h2 className="text-hero-sm font-display font-bold text-white mb-16">
              Our Process
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            <motion.div
              className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            />

            {process.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.12}>
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-5 md:mb-8">
                    <motion.span
                      className="font-display text-2xl md:text-3xl font-bold text-accent relative z-10 bg-black pr-2"
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {step.number}
                    </motion.span>
                    <div className="h-px flex-1 bg-accent/20 md:hidden" />
                  </div>

                  <h3 className="text-white font-display text-xl md:text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-white/50 font-sans text-body-md leading-relaxed">
                    {step.description}
                  </p>

                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section className="py-section bg-black/95 relative overflow-hidden">
        <motion.div
          className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-accent mb-8">
              Why Us
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={pillar.title} delay={i * 0.12}>
                <motion.div
                  className="group bg-white/5 rounded-2xl lg:rounded-3xl p-8 md:p-10 h-full border border-white/10 backdrop-blur-sm relative overflow-hidden cursor-pointer"
                  whileHover={{
                    y: -12,
                    boxShadow: "0 25px 60px rgba(139,92,246,0.25)",
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-7"
                      whileHover={{
                        rotate: 360,
                        scale: 1.15,
                        backgroundColor: "#8B5CF6",
                        color: "#FFFFFF",
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {pillar.icon}
                    </motion.div>

                    <h3 className="text-white font-display text-xl md:text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                      {pillar.title}
                    </h3>

                    <p className="text-white/55 font-sans text-body-md leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-section-sm bg-black">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14 md:mb-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <motion.div
                  className="text-center md:text-left group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="block font-display text-4xl md:text-5xl font-bold text-white mb-2 leading-none group-hover:text-accent transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.span>
                  <span className="text-micro font-sans text-white/60 uppercase tracking-widest">
                    {stat.label}
                  </span>
                  <motion.div
                    className="w-12 h-1 bg-accent mt-3 mx-auto md:mx-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1 + 0.3,
                    }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-14 md:mt-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-section bg-black text-center relative overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-orange-600/10 to-transparent"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-hero-md font-display font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Let&apos;s build something{" "}
              <motion.span
                className="italic text-accent inline-block"
                whileHover={{
                  rotate: [-2, 2, -2, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                unforgettable.
              </motion.span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-white/55 font-sans text-body-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you need a complete brand identity, a modern website,
              or both, we&apos;re here to turn your ideas into meaningful
              digital experiences.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <MagneticWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-accent text-white text-[0.85rem] font-sans font-medium tracking-wide rounded-full overflow-hidden shadow-xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 group-hover:text-accent transition-colors">Start Your Project</span>
                  <motion.span
                    className="relative z-10 group-hover:text-accent transition-colors"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </MagneticWrapper>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}