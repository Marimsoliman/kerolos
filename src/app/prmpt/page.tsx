"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_LEFT =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4";
const VIDEO_RIGHT =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4";

const GALLERY_IMAGES = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85",
];

const SYMBOLS = ["8", "$", "^^", "%", "/"];

function buildLayout(count: number, cols: number): number[] {
  const layout: number[] = [];
  let imgIndex = 0;
  let row = 0;

  while (imgIndex < count) {
    const a = (row * 2 + (row % 2)) % cols;
    const rowCells = Array(cols).fill(-1);
    rowCells[a] = imgIndex++;

    if (row % 3 === 0 && imgIndex < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      rowCells[b] = imgIndex++;
    }

    layout.push(...rowCells);
    row++;
  }

  return layout;
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice || window.innerWidth < 1024) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden lg:block fixed pointer-events-none z-50"
      style={{ mixBlendMode: "exclusion", transform: "translate(-50%, -50%)" }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22.75" stroke="white" strokeWidth="2.5" />
        <path d="M24 12 L30 24 L24 36 L18 24 Z" fill="white" />
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <motion.div
      className="fixed pointer-events-none z-20 top-4 left-4 lg:top-8 lg:left-8"
      style={{ mixBlendMode: "exclusion" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <svg
        className="w-[124px] sm:w-[266px] lg:w-[355px]"
        viewBox="0 0 355 110"
        fill="none"
      >
        <path d="M20 30 H80 V50 H60 V90 H40 V50 H20 Z" fill="white" />
        <path
          d="M100 30 H140 Q160 30 160 50 V70 Q160 90 140 90 H120 V50 H140"
          fill="white"
        />
        <path
          d="M180 30 H240 V50 H200 V55 H235 V70 H200 V75 H240 V90 H180 Z"
          fill="white"
        />
        <path
          d="M260 30 H300 Q320 30 320 50 V90 H300 V50 H280 V90 H260 Z"
          fill="white"
        />
        <circle
          cx="335"
          cy="60"
          r="18"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <text
          x="335"
          y="67"
          textAnchor="middle"
          fontSize="14"
          fill="white"
          fontFamily="Inter Tight"
        >
          R
        </text>
      </svg>
    </motion.div>
  );
}

function Caption() {
  return (
    <motion.div
      className="fixed pointer-events-none z-20 text-white left-4 top-[118px] w-[calc(100vw-32px)] lg:left-8 lg:top-[244px] lg:w-[692px]"
      style={{
        mixBlendMode: "exclusion",
        fontFamily: "var(--font-inter-tight)",
        fontWeight: 500,
        fontSize: 12,
        lineHeight: "140%",
        letterSpacing: "-0.04em",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
    >
      <span className="hidden lg:block">
        When switching between videos near the center, do not reset currentTime
        to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of
        center, keep both videos at currentTime = 0 and show whichever was last
        active.
      </span>
      <span className="lg:hidden">
        Archive Collection "PROMPT" — Scroll to explore the gallery.
      </span>
    </motion.div>
  );
}

function HeaderNav() {
  return (
    <motion.div
      className="fixed z-20 pointer-events-none flex items-center justify-between top-4 right-4 lg:top-8 lg:right-8 h-[30px]"
      style={{ mixBlendMode: "exclusion" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
    >
      <span
        className="hidden lg:inline text-white uppercase mr-10"
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        ABOUT
      </span>
      <div className="flex items-center gap-5 lg:gap-12">
        <svg className="w-6 h-6 lg:w-[30px] lg:h-[30px]" viewBox="0 0 40 40">
          <path d="M0 14H40" stroke="white" strokeWidth="2.5" />
          <path d="M0 26H40" stroke="white" strokeWidth="2.5" />
        </svg>
        <span
          className="text-white text-[13px] lg:text-[15px]"
          style={{ fontFamily: "var(--font-inter-tight)", fontWeight: 500 }}
        >
          [ CART ]
        </span>
      </div>
    </motion.div>
  );
}

function ProductInfo() {
  const [symbol, setSymbol] = useState("8");
  const lastUpdate = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate.current < 80) return;
      lastUpdate.current = now;
      setSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      id="outro-info"
      className="fixed pointer-events-none z-20 flex flex-col items-center left-0 right-0 bottom-12 lg:items-start lg:right-8 lg:bottom-20 lg:left-auto lg:w-[330px]"
      style={{ mixBlendMode: "exclusion" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
      data-outro-offset="132"
    >
      <div className="flex flex-col items-center w-[252px] mb-3 lg:items-start lg:w-[330px] lg:mb-8">
        <div className="relative w-5 h-5 lg:w-[30px] lg:h-[30px] mb-2">
          <svg className="absolute inset-0" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18.75"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span
            id="circle-symbol"
            className="absolute inset-0 flex items-center justify-center text-white uppercase text-[10px] lg:text-[15px]"
            style={{
              fontFamily: "var(--font-inter-tight)",
              fontWeight: 500,
              letterSpacing: "-0.04em",
            }}
          >
            {symbol}
          </span>
        </div>
        <div
          className="text-white text-center lg:text-left uppercase text-[20px] lg:text-[30px]"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 500,
            lineHeight: "100%",
            letterSpacing: "-0.04em",
          }}
        >
          ARCHIVE COLLECTION
          <br />
          &quot;PROMPT&quot;
        </div>
      </div>
      <div
        className="text-white text-center text-[60px] lg:text-[80px]"
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 500,
          lineHeight: "100%",
          letterSpacing: "-0.04em",
        }}
      >
        $97,33
      </div>
    </motion.div>
  );
}

function ViewButton() {
  return (
    <div
      id="outro-buy"
      className="fixed pointer-events-none z-20 flex items-center justify-center bg-white rounded-full left-4 right-4 bottom-[60px] h-[100px] lg:left-auto lg:right-8 lg:bottom-8 lg:w-[330px] lg:h-[174px]"
      style={{
        mixBlendMode: "exclusion",
        transformOrigin: "right bottom",
        transform: "scale(0)",
      }}
    >
      <span
        className="text-white text-[72px] lg:text-[110px]"
        style={{
          mixBlendMode: "exclusion",
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 500,
          letterSpacing: "-0.04em",
        }}
      >
        view
      </span>
    </div>
  );
}

function VideoContainer() {
  const leftRef = useRef<HTMLVideoElement>(null);
  const rightRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSideRef = useRef<"left" | "right">("right");
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches ||
          window.innerWidth < 1024
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    let loadedCount = 0;
    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setLoaded(true);
        if (containerRef.current) {
          containerRef.current.style.opacity = "1";
        }
      }
    };

    left.addEventListener("loadeddata", handleLoad);
    right.addEventListener("loadeddata", handleLoad);

    return () => {
      left.removeEventListener("loadeddata", handleLoad);
      right.removeEventListener("loadeddata", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isMobile || prefersReducedMotion) {
      right.style.display = "block";
      left.style.display = "none";

      const playRight = () => {
        right.style.display = "block";
        left.style.display = "none";
        right.play();
      };

      const playLeft = () => {
        left.style.display = "block";
        right.style.display = "none";
        left.play();
      };

      right.addEventListener("ended", playLeft);
      left.addEventListener("ended", playRight);

      playRight();

      return () => {
        right.removeEventListener("ended", playLeft);
        left.removeEventListener("ended", playRight);
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        const width = window.innerWidth;
        const center = width / 2;
        const deadZone = Math.max(30, width * 0.05);
        const cursorX = e.clientX;

        const distFromCenter = cursorX - center;

        if (Math.abs(distFromCenter) < deadZone) {
          if (activeSideRef.current === "left") {
            left.currentTime = 0;
            left.style.display = "block";
            right.style.display = "none";
          } else {
            right.currentTime = 0;
            right.style.display = "block";
            left.style.display = "none";
          }
          return;
        }

        if (distFromCenter < -deadZone) {
          if (activeSideRef.current !== "right") {
            activeSideRef.current = "right";
            right.currentTime = 0;
          }
          right.style.display = "block";
          left.style.display = "none";

          const leftEdge = 0;
          const centerLeftEdge = center - deadZone;
          const distance = centerLeftEdge - cursorX;
          const range = centerLeftEdge - leftEdge;
          const progress = Math.max(0, Math.min(1, distance / range));
          const targetTime = progress * right.duration;

          if (!right.seeking && Math.abs(right.currentTime - targetTime) > 0.1) {
            right.currentTime = targetTime;
          }
        } else {
          if (activeSideRef.current !== "left") {
            activeSideRef.current = "left";
            left.currentTime = 0;
          }
          left.style.display = "block";
          right.style.display = "none";

          const rightEdge = width;
          const centerRightEdge = center + deadZone;
          const distance = cursorX - centerRightEdge;
          const range = rightEdge - centerRightEdge;
          const progress = Math.max(0, Math.min(1, distance / range));
          const targetTime = progress * left.duration;

          if (!left.seeking && Math.abs(left.currentTime - targetTime) > 0.1) {
            left.currentTime = targetTime;
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [loaded, isMobile]);

  return (
    <div
      id="main-canvas"
      ref={containerRef}
      className="pointer-events-none fixed inset-0 w-full h-full z-0 overflow-hidden lg:top-0 lg:h-full"
      style={{
        opacity: 0,
        transition: "opacity 0.3s ease",
        top: isMobile ? 220 : 0,
        height: isMobile ? "calc(100vh - 220px)" : "100%",
      }}
    >
      <video
        ref={leftRef}
        src={VIDEO_LEFT}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "none" }}
      />
      <video
        ref={rightRef}
        src={VIDEO_RIGHT}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "block" }}
      />
    </div>
  );
}

function WhiteOverlay() {
  return (
    <div
      id="outro-overlay"
      className="fixed inset-0 pointer-events-none z-[12] bg-white"
      style={{ opacity: 0 }}
    />
  );
}

function Footer() {
  return (
    <div
      id="outro-footer"
      className="fixed pointer-events-none z-20 flex items-center justify-between w-[calc(100vw-32px)] left-4 bottom-6 lg:w-auto lg:gap-20 lg:left-4 lg:bottom-8"
      style={{ mixBlendMode: "exclusion", opacity: 0 }}
    >
      <span
        className="text-white uppercase text-[11px] lg:text-[13px]"
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        PRMPT (R) 2026
      </span>
      <span
        className="text-white uppercase text-[11px] lg:text-[13px]"
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        PRIVACY POLICY
      </span>
    </div>
  );
}

function BlackPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [cols, setCols] = useState(2);
  const [layout, setLayout] = useState<number[]>([]);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      const newCols = width >= 1024 ? 4 : width >= 640 ? 3 : 2;
      setCols(newCols);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  useEffect(() => {
    setLayout(buildLayout(GALLERY_IMAGES.length, cols));
  }, [cols]);

  useGSAP(() => {
    if (!panelRef.current) return;

    ScrollTrigger.create({
      trigger: "#scroll-spacer",
      start: "top top",
      end: "100vh top",
      scrub: true,
      onUpdate: (self) => {
        if (panelRef.current) {
          const progress = self.progress;
          panelRef.current.style.transform = `translateY(${
            (1 - progress) * 100
          }vh)`;
        }
      },
    });
  }, []);

  useEffect(() => {
    const vh = window.innerHeight;
    let maxScroll = 0;

    const raf = () => {
      const scrollY = window.scrollY;

      if (scrollY <= vh) {
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = "translateY(0)";
        }
      } else {
        const phase2Offset = scrollY - vh;
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = `translateY(-${phase2Offset}px)`;
          maxScroll = Math.max(
            maxScroll,
            wrapperRef.current.scrollHeight - vh
          );
        }

        cardsRef.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const { top, bottom } = rect;

          if (bottom <= 0 || top >= vh) {
            card.style.transform = "scale(0)";
            return;
          }

          const enterScale = Math.min(1, (vh - top) / (vh * 0.6));
          const exitScale = Math.min(1, bottom / (vh * 0.4));
          const scale = Math.min(enterScale, exitScale);

          card.style.transform = `scale(${scale})`;
        });

        if (scrollY > vh + maxScroll) {
          const outroProgress = Math.min(
            1,
            (scrollY - vh - maxScroll) / (vh - 100)
          );

          const overlay = document.getElementById("outro-overlay");
          if (overlay) overlay.style.opacity = String(outroProgress);

          const info = document.getElementById("outro-info");
          if (info) {
            const offset = parseInt(info.dataset.outroOffset || "132");
            info.style.transform = `translateY(-${outroProgress * offset}px)`;
          }

          const buy = document.getElementById("outro-buy");
          if (buy) buy.style.transform = `scale(${outroProgress})`;

          const footer = document.getElementById("outro-footer");
          if (footer) footer.style.opacity = String(outroProgress);
        }
      }

      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const updateHeight = () => {
      const spacer = document.getElementById("scroll-spacer");
      if (spacer && wrapperRef.current) {
        const vh = window.innerHeight;
        const wrapScrollHeight = wrapperRef.current.scrollHeight;
        maxScroll = wrapScrollHeight - vh;
        spacer.style.height = `${vh + maxScroll + 2 * vh}px`;
      }
    };

    const timer = setInterval(updateHeight, 100);
    setTimeout(() => clearInterval(timer), 2000);

    return () => clearInterval(timer);
  }, [layout]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 bg-black z-10"
      style={{ transform: "translateY(100vh)" }}
    >
      <div
        ref={wrapperRef}
        className="w-full"
        style={{ paddingTop: "min(400px, 40vh)" }}
      >
        <div
          className="grid gap-4 px-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {layout.map((imgIdx, cellIdx) => {
            if (imgIdx === -1) {
              return <div key={cellIdx} style={{ aspectRatio: "2/3" }} />;
            }

            const colIndex = cellIdx % cols;
            const isLeftHalf = colIndex < cols / 2;

            return (
              <div
                key={cellIdx}
                ref={(el) => {
                  if (el) cardsRef.current[cellIdx] = el;
                }}
                className="bp-card"
                style={{
                  aspectRatio: "2/3",
                  transform: "scale(0)",
                  transformOrigin: isLeftHalf ? "right bottom" : "left bottom",
                }}
              >
                <img
                  src={GALLERY_IMAGES[imgIdx]}
                  alt={`Gallery ${imgIdx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PrmptPage() {
  return (
    <div
      id="scroll-spacer"
      className="relative bg-white select-none cursor-none lg:cursor-none"
      style={{ height: "500vh" }}
    >
      <CustomCursor />
      <Logo />
      <Caption />
      <HeaderNav />
      <ProductInfo />
      <ViewButton />
      <VideoContainer />
      <WhiteOverlay />
      <Footer />
      <BlackPanel />
    </div>
  );
}