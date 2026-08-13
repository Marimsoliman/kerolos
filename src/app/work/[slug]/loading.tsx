// src/app/work/[slug]/loading.tsx
export default function CaseStudyLoading() {
  return (
    <div className="bg-white min-h-screen pt-28 px-5 md:px-8 lg:px-12 max-w-[1440px] mx-auto animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5">
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-full aspect-video bg-[#F2F2F0] rounded-lg" />
    </div>
  );
}