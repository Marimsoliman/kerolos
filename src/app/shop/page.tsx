import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Kerolos",
  description: "Coming soon — premium digital products by Kerolos.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <h1 className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Coming Soon
        </h1>
        <p className="font-sans text-sm md:text-base text-white/50 max-w-md mx-auto">
          Our shop is under construction. Stay tuned for premium digital products.
        </p>
      </div>
    </main>
  );
}
