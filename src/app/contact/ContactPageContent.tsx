"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import MagneticWrapper from "@/components/MagneticWrapper";
import { CINEMATIC_BG } from "@/lib/theme";

const WHATSAPP_NUMBER = "201019740451";

interface ServicePricing {
  _id: string;
  name: string;
  price: string; // هنا بتحطي الرينج مثلا $400 – $1,200
  desc: string;
  features: string[];
  active: boolean;
}

const budgetOptions = [
  { value: "", label: "Select a range" },
  { value: "1k-3k", label: "$1,000 — $3,000" },
  { value: "3k-5k", label: "$3,000 — $5,000" },
  { value: "5k-10k", label: "$5,000 — $10,000" },
  { value: "10k+", label: "$10,000+" },
];

function BudgetSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const current = budgetOptions.find((o) => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between bg-[#0E0E0E] border border-white/[0.12] rounded-xl px-4 py-3.5 text-left">
        <span className={`font-sans text-[14px] ${value ? "text-white" : "text-white/30"}`}>{current?.label || "Select a range"}</span>
        <motion.svg animate={{ rotate: open ? 180 : 0 }} width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-white/40"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute z-50 mt-2 w-full rounded-xl bg-[#111111] border border-white/[0.08] p-1.5">
            {budgetOptions.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[13px] ${value === opt.value ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white"}`}>{opt.label}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPageContent() {
  const [services, setServices] = useState<ServicePricing[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formState, setFormState] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/pricing").then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setServices(data.filter((s: ServicePricing) => s.active));
    }).catch(console.error);
  }, []);

  const toggle = (s: string) => setSelectedServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const whatsappLink = useMemo(() => {
    const servicesText = selectedServices.length ? selectedServices.join(", ") : "your services";
    const text = `Hi Kerolos! I'm interested in: ${servicesText}.%0AName: ${formState.name || "-"}%0ABudget: ${formState.budget || "-"}%0AMessage: ${formState.message || ""}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [selectedServices, formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formState, services: selectedServices }) });
      setSubmitted(true);
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative" style={{ backgroundColor: "#000", backgroundImage: CINEMATIC_BG }}>
        <motion.div className="text-center max-w-lg relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-accent text-5xl block mb-6">✓</span>
          <h1 className="text-hero-sm font-display font-bold text-white mb-4">Message Sent</h1>
          <p className="text-white/60">Thank you! I&apos;ll get back to you within 24-48 hours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-section relative" style={{ backgroundColor: "#000", backgroundImage: CINEMATIC_BG }}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left */}
          <div className="lg:col-span-5">
            <motion.span className="text-accent text-label font-sans uppercase block mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Contact</motion.span>
            
            {/* ⚡ العنوان الجديد - impact موف ومفيش قص */}
            <div className="mb-6">
              <h1 className="font-display font-bold tracking-tight leading-[1.05] text-[clamp(44px,6vw,80px)]">
                <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block text-white pb-[0.15em]">
                    Make an
                  </motion.span>
                </span>
                <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block pb-[0.15em] bg-gradient-to-r from-[#c4b5fd] via-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
                    impact
                  </motion.span>
                </span>
              </h1>
            </div>

            <ScrollReveal delay={0.45}><p className="text-white/60 font-display text-xl italic">Let&apos;s turn it into something unforgettable.</p></ScrollReveal>
          </div>

          {/* Form */}
          <ScrollReveal direction="right" delay={0.3} className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="text-white text-label uppercase block mb-3">Services Interested In</label>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <button key={s._id} type="button" onClick={() => toggle(s.name)} className={`px-4 py-2 rounded-full text-[0.78rem] border transition-all ${selectedServices.includes(s.name) ? "bg-accent text-white border-accent shadow-[0_0_20px_rgba(139,92,246,0.4)]" : "border-white/15 text-white/60 hover:border-accent/50 hover:text-white bg-white/[0.03]"}`}>{s.name}</button>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedServices.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: 10, height: 0 }} className="overflow-hidden">
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedServices.map((name) => {
                          const p = services.find((s) => s.name === name);
                          if (!p) return null;
                          return (
                            <div key={name} className="rounded-2xl bg-[#101011] border border-white/[0.08] p-4">
                              <div className="flex justify-between items-start mb-2"><h4 className="text-white font-medium text-sm">{p.name}</h4><span className="text-[#A78BFA] font-bold text-sm ml-3">{p.price}</span></div>
                              <p className="text-white/40 text-[12px] mb-3">{p.desc}</p>
                              <ul className="space-y-1">{p.features.map((f) => (<li key={f} className="text-[11px] text-white/30 flex gap-1.5"><span className="text-accent">•</span> {f}</li>))}</ul>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { key: "name", label: "Your Name", type: "text", placeholder: "John Doe", required: true },
                { key: "email", label: "Email Address", type: "email", placeholder: "john@example.com", required: true },
                { key: "company", label: "Company / Brand", type: "text", placeholder: "Your brand name", required: false },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-white text-label uppercase block mb-2">{field.label} {field.required && "*"}</label>
                  <input type={field.type} required={field.required} placeholder={field.placeholder} value={formState[field.key as keyof typeof formState]} onChange={(e) => setFormState({ ...formState, [field.key]: e.target.value })} className="w-full bg-[#0E0E0E] border border-white/[0.12] rounded-xl text-white px-4 py-3.5 focus:border-accent/50 focus:outline-none placeholder:text-white/20" />
                </div>
              ))}

              <div><label className="text-white text-label uppercase block mb-2">Budget Range</label><BudgetSelect value={formState.budget} onChange={(v) => setFormState({ ...formState, budget: v })} /></div>
              <div><label className="text-white text-label uppercase block mb-2">Tell Me About Your Project *</label><textarea required rows={4} placeholder="Describe your project..." value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full bg-[#0E0E0E] border border-white/[0.12] rounded-xl text-white px-4 py-3.5 focus:border-accent/50 focus:outline-none resize-none placeholder:text-white/20" /></div>

              <div className="pt-3 flex flex-col md:flex-row gap-3">
                <MagneticWrapper><button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-accent text-white rounded-full w-full md:w-auto disabled:opacity-50">{submitting ? "Sending..." : "Send Message"} <span>→</span></button></MagneticWrapper>
                <a href={whatsappLink} target="_blank" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all w-full md:w-auto">WhatsApp</a>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}