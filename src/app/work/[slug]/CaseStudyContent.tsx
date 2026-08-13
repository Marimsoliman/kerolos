// src/app/work/[slug]/CaseStudyContent.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useState, useEffect, useRef } from "react";

interface Project {
  _id?: string;
  id: string;
  name: string;
  category: string;
  year: string;
  projectSummary?: string;
  client?: string;
  service?: string;
  shortDescription?: string;
  description?: string;
  tags?: string[];
  image: string;
  images: string[];
}

const BackNavigation = memo(() => (
  <section className="pt-24 md:pt-28 pb-8 relative z-10">
    <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
      <Link
        href="/work"
        prefetch={true}
        className="text-white/30 font-sans text-[11px] md:text-xs uppercase tracking-[0.15em] hover:text-accent transition-colors inline-flex items-center gap-2 group"
      >
        <svg
          className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Work</span>
      </Link>
    </div>
  </section>
));
BackNavigation.displayName = "BackNavigation";

const ProjectInfo = memo(
  ({
    displaySummary,
    displayClient,
    displayService,
    year,
    tags,
  }: {
    displaySummary: string;
    displayClient: string;
    displayService: string;
    year: string;
    tags?: string[];
  }) => (
    <section className="text-white py-12 md:py-16 lg:py-20 relative z-10">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
        {displaySummary && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 md:mb-16 lg:mb-20">
              <div className="lg:col-span-5">
                <h2 className="text-xs md:text-sm font-sans font-bold text-white uppercase tracking-[0.12em]">
                  Project Summary
                </h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-white/80 font-sans text-sm md:text-base leading-[1.7] whitespace-pre-line">
                  {displaySummary}
                </p>
              </div>
            </div>
            <div className="h-px bg-white/10 mb-12 md:mb-16 lg:mb-20" />
          </>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-xs md:text-sm font-sans font-bold text-white uppercase tracking-[0.12em]">
              Client &amp; Service
            </h2>
          </div>
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {[
                ["Client", displayClient],
                ["Service", displayService],
                ["Year", year],
              ].map(([label, val]) => (
                <div key={label} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6">
                  <span className="text-white/50 font-sans text-xs uppercase tracking-[0.12em] w-28 flex-shrink-0">
                    {label}
                  </span>
                  <span className="text-white font-sans text-sm md:text-base">{val}</span>
                </div>
              ))}
              {tags && tags.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-6 pt-3 border-t border-white/10">
                  <span className="text-white/50 font-sans text-xs uppercase tracking-[0.12em] w-28 flex-shrink-0">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-sans tracking-wide backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
);
ProjectInfo.displayName = "ProjectInfo";

// ⚡ Placeholder داكن لـ blur - يُعرض قبل تحميل الصورة (بدون طلب خادم إضافي)
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMTgxODIwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGEwYTBkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";

// ⚡ Component محسّن للصور - يدعم GIF + Progressive Loading
const ProjectImage = memo(
  ({ src, alt, index }: { src: string; alt: string; index: number }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(index < 2); // أول صورتين فقط فوراً
    const imgRef = useRef<HTMLDivElement>(null);
    const errorRetried = useRef(false);

    const cleanSrc = src.trim();
    const isGif = cleanSrc.toLowerCase().includes(".gif");

    useEffect(() => {
      if (!imgRef.current || isInView) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: "600px 0px", // ⚡ ابدأ التحميل قبل ما الصورة تظهر ب 600px
        }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }, [isInView]);

    if (!src) return null;

    return (
      <div
        ref={imgRef}
        className="relative w-full rounded-xl border border-white/[0.06] bg-[#0c0c0d] overflow-hidden"
      >
        {!isInView ? (
          // ⚡ Skeleton قبل دخول حيز العرض
          <div className="w-full aspect-video bg-gradient-to-br from-white/5 to-white/[0.02] animate-pulse flex items-center justify-center">
            <svg className="w-16 h-16 text-white/5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <>
            {isGif ? (
              // ⚡ GIF: <img> عادي للحفاظ على الحركة + Skeleton مطلق (بدون CLS)
              <>
                {!isLoaded && (
                  <div className="absolute inset-0 w-full aspect-video bg-gradient-to-br from-white/5 to-white/[0.02] flex flex-col items-center justify-center gap-3">
                    <svg className="w-10 h-10 text-white/20 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-white/30 text-xs font-sans">🎬 Loading GIF...</span>
                  </div>
                )}
                <img
                  src={cleanSrc}
                  alt={alt}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="relative w-full h-auto object-contain block"
                  onLoad={() => {
                    setIsLoaded(true);
                    console.log(`✅ GIF loaded: ${cleanSrc}`);
                  }}
                  onError={(e) => {
                    console.error(`❌ Failed to load GIF:`, cleanSrc);
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";

                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center p-12 text-white/20">
                        <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-sm mb-2">Failed to load GIF</p>
                        <a href="${cleanSrc}" target="_blank" class="text-xs text-accent hover:underline">View original</a>
                      </div>
                    `;
                    }
                  }}
                />
                {isLoaded && (
                  <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                    🎬 GIF
                  </div>
                )}
              </>
            ) : (
              // ⚡ صور عادية: Next Image + blur placeholder + srcset متجاوب
              <Image
                src={cleanSrc}
                alt={alt}
                width={1920}
                height={1080}
                sizes="(min-width: 1440px) 1392px, (min-width: 768px) 88vw, 92vw"
                quality={80}
                priority={index < 2}
                fetchPriority={index === 0 ? "high" : "auto"}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                decoding="async"
                // ⚡ في الـ dev: نتجاوز الـ optimizer (بيحول كل صورة على الطاير فبيبطأ)
                // في الإنتاج: التحسين شغال عادي
                unoptimized={process.env.NODE_ENV === "development"}
                className="relative w-full h-auto object-contain"
                onLoad={() => {
                  setIsLoaded(true);
                  console.log(`✅ Image loaded: ${cleanSrc}`);
                }}
                onError={(e) => {
                  console.error(`❌ Failed to load image:`, cleanSrc);
                  const target = e.target as HTMLImageElement;
                  // حاول مرة واحدة بالصورة الأصلية من الـ CDN، ثم اختفي لو فشلت
                  if (!errorRetried.current) {
                    errorRetried.current = true;
                    target.src = cleanSrc;
                  } else {
                    target.style.display = "none";
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    );
  }
);
ProjectImage.displayName = "ProjectImage";

const ProjectCard = memo(({ project }: { project: Project }) => {
  return (
    <div className="group flex flex-col">
      <Link href={`/work/${project.id}`} prefetch={true} className="block">
        <div className="relative w-full bg-[#0d0d0d] rounded-xl mb-5 border border-white/10 overflow-hidden aspect-[4/3]">
          <Image
            src={project.image}
            alt={project.name}
            width={800}
            height={600}
            loading="lazy"
            quality={85}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-black text-[0.65rem] font-sans tracking-widest uppercase rounded-full shadow-lg">
              {project.category}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-white text-xs font-sans tracking-widest uppercase flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
              View
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl font-bold font-display text-white group-hover:text-accent transition-colors tracking-tight mb-2 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
            {project.projectSummary || project.shortDescription}
          </p>
          <span className="text-white/25 font-sans text-xs">{project.year}</span>
        </div>
      </Link>
    </div>
  );
});
ProjectCard.displayName = "ProjectCard";

export default function CaseStudyContent({
  project,
  otherProjects = [],
}: {
  project: Project;
  otherProjects?: Project[];
}) {
  if (!project) return null;

  const displaySummary = project.projectSummary || project.shortDescription || project.description || "";
  const displayClient = project.client || project.name || "";
  const displayService = project.service || project.category || "";

  const allImages = (() => {
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      const validImages = project.images.filter((img) => img && img.trim());
      if (validImages.length > 0) {
        console.log(`✅ Found ${validImages.length} images for project ${project.id}`);
        return validImages;
      }
    }

    if (project.image) {
      console.log(`⚠️ No images array, using main image only for project ${project.id}`);
      return [project.image];
    }

    console.error(`❌ No images found for project ${project.id}`);
    return [];
  })();

  return (
    <div className="min-h-screen relative bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.017]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <BackNavigation />
      <ProjectInfo
        displaySummary={displaySummary}
        displayClient={displayClient}
        displayService={displayService}
        year={project.year}
        tags={project.tags}
      />

      <section className="pb-20 md:pb-28 lg:pb-32 relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 space-y-6 md:space-y-10 lg:space-y-14">
          {allImages.length > 0 ? (
            allImages.map((img, i) => <ProjectImage key={i} src={img} alt={`${project.name} – Visual ${i + 1}`} index={i} />)
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-white/30 text-sm">No images available</p>
            </div>
          )}
        </div>
      </section>

      {otherProjects.length > 0 && (
        <section className="py-20 md:py-28 lg:py-32 bg-black/50 backdrop-blur-sm relative z-10">
          <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 mb-12 md:mb-16 lg:mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent text-[11px] font-mono uppercase tracking-[0.15em]">02</span>
              <span className="text-white/15">•</span>
              <span className="text-white/30 text-[11px] font-mono uppercase tracking-[0.15em]">More Projects</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              Explore More Work
            </h2>
          </div>
          <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {otherProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}