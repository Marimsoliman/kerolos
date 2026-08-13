// src/app/work/loading.tsx
import { CINEMATIC_BG } from "@/lib/theme";

export default function WorkLoading() {
  return (
    <div
      className="min-h-screen pt-32 pb-20 relative"
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

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 relative z-10">
        {/* Header Skeleton */}
        <div className="mb-16 md:mb-24 animate-pulse">
          <div className="h-4 w-20 bg-white/10 rounded mb-4" />
          <div className="h-12 w-64 bg-white/10 rounded mb-6" />
          <div className="h-6 w-96 bg-white/10 rounded" />
        </div>

        <div className="h-px bg-white/10 mb-16" />

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col animate-pulse">
              <div className="bg-white/5 w-full rounded-lg mb-5 aspect-square border border-white/10" />
              <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-4 w-1/2 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}