// src/app/about/page.tsx
import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About — Kerolos",
  description: "Kerolos is a graphic design and brand identity practice focused on turning ideas into clear, memorable and meaningful visual identities.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}