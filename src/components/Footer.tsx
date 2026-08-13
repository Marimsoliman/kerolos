"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedinIn,
  FaBehance,
  FaArrowRight,
} from "react-icons/fa6";
import { COLORS } from "@/lib/theme";

const ACCENT = COLORS.accent;

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/kerolostarek.eg/",
    icon: FaInstagram,
    ariaLabel: "Visit Kerolos on Instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@kerolostarek4",
    icon: FaTiktok,
    ariaLabel: "Visit Kerolos on TikTok",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCZ9P3ls1AsCCgnAKh5ceitQ",
    icon: FaYoutube,
    ariaLabel: "Visit Kerolos on YouTube",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kerollos-tarek-b138b7234/",
    icon: FaLinkedinIn,
    ariaLabel: "Visit Kerolos on LinkedIn",
  },
  {
    name: "Behance",
    href: "https://www.behance.net/kerloustarek",
    icon: FaBehance,
    ariaLabel: "Visit Kerolos on Behance",
  },
];

const footerNavLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "WORK", href: "/work" },
  { name: "SHOP", href: "/shop" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={
        {
          background: "#000000",
        } as CSSProperties
      }
    >
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 lg:px-14">
        {/* Main Footer Content */}
        <div className="pt-14 pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:items-center">
            {/* LEFT SIDE — BRANDING */}
            <div className="lg:col-span-3 flex items-center justify-center lg:justify-start">
              <Link
                href="/"
                className="group inline-block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6]/40 rounded-sm"
                aria-label="Kerolos Home"
              >
                <h2
                  className="font-sans text-2xl md:text-3xl font-bold tracking-tight transition-opacity duration-300 group-hover:opacity-90"
                  style={{ color: ACCENT }}
                >
                  Kerolos <span style={{ color: ACCENT }}>•</span>
                </h2>
              </Link>
            </div>

            {/* CENTER — NAVIGATION + SOCIAL ICONS */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center gap-6 md:gap-7">
              {/* Navigation */}
              <nav aria-label="Footer navigation">
                <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:gap-x-6 lg:gap-x-7">
                  {footerNavLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6]/40 rounded-sm"
                      >
                        <span className="font-sans text-xs md:text-[13px] tracking-[0.08em] font-medium uppercase text-white transition-colors duration-300 ease-out group-hover:text-[#8B5CF6]">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-5 md:gap-6">
                {socialLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      className="group outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6]/40 rounded-sm"
                    >
                      <Icon
                        className="w-4 h-4 md:w-[18px] md:h-[18px] text-white transition-all duration-300 ease-out group-hover:text-[#8B5CF6] group-hover:scale-[1.08]"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE — CONTACT AREA */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm md:text-[15px] text-white">
                  Let&apos;s work together
                </span>

                <Link
                  href="/contact"
                  aria-label="Go to contact page"
                  className="group flex items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6]/40 rounded-full"
                >
                  <span className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-black transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:bg-[#8B5CF6] group-hover:text-white">
                    <FaArrowRight
                      className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ease-out group-hover:translate-x-[1px]"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM CENTER — COPYRIGHT */}
          <div className="mt-10 md:mt-12 lg:mt-14">
            <p className="text-center font-sans text-xs md:text-[13px] text-white/50">
              © {currentYear} BY KERO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}