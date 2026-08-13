// src/app/contact/page.tsx
import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact — Kerolos | Start a Project",
  description: "Make an impact ",
};

export default function ContactPage() {
  return <ContactPageContent />;
}