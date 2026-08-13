// src/components/sections/AboutSection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SplitText from "@/components/SplitText";
import ScrollReveal from "@/components/ScrollReveal";

const skills = [
  "Brand Identity Designer",
  "Creative Director  ",
  "Brand Strategist ",
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="py-section bg-white relative overflow-hidden"
      id="about"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent/5 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-black/3 blur-3xl" aria-hidden="true" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="lg:col-span-7">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="accent-dot" />
              <span className="text-label font-sans text-gray">About</span>
            </motion.div>

            <SplitText
              text="Design with purpose, craft with passion."
              tag="h2"
              className="font-display text-hero-md font-bold text-black mb-8"
            />

            <ScrollReveal delay={0.2}>
              <p className="font-sans text-body-lg text-black/80 mb-6 leading-relaxed">
                I&apos;m Kerolos, a graphic designer and brand identity specialist based in creating visual experiences that leave lasting impressions. My work is driven by a simple belief: great design isn&apos;t just beautiful—it&apos;s meaningful, strategic, and unforgettable.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="font-sans text-body-md text-black/60 mb-10 leading-relaxed">
                Every brand has a unique story waiting to be told. My role is to uncover that narrative and translate it into a visual language that connects with people, builds trust, and stands the test of time. I approach each project with curiosity, intention, and a commitment to excellence.
              </p>
            </ScrollReveal>

            {/* Skills */}
            <ScrollReveal delay={0.4}>
              <div className="mb-10">
                <span className="text-label font-sans text-gray block mb-5">
                  Core Expertise
                </span>
                <div className="flex flex-wrap gap-3">
  {skills.map((skill, i) => (
    <motion.span
      key={skill}
      className="px-4 py-2 bg-white-100 border border-accent text-sm font-sans text-accent rounded-full hover:bg-accent hover:text-white transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
      whileHover={{ scale: 1.05 }}
    >
      {skill}
    </motion.span>
  ))}
</div>
              </div>
            </ScrollReveal>

            <div className="divider-line mb-10" />

            {/* Awards/Recognition */}
            <ScrollReveal delay={0.6}>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { number: "50+", label: "Projects" },
                  { number: "30+", label: "Clients" },
                  { number: "100%", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="block font-display text-4xl font-bold text-black mb-2 leading-none">
                      {stat.number}
                    </span>
                    <span className="text-micro font-sans text-gray">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Visual */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-medium">
                  <img
                    src="/images/about-photo.png"
                    alt="Kerolos - Graphic Designer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating element */}
                <motion.div
                  className="absolute -bottom-6 -right-6 px-6 py-4 bg-accent rounded-2xl shadow-strong"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <span className="block text-micro font-sans text-white mb-1">
                    Since
                  </span>
                  <span className="block font-display text-3xl font-bold text-white">
                    2021
                  </span>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}