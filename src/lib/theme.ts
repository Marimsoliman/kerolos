// Single source of truth for the Kerolos color system.
// Palette inspired by heynesh.com — violet primary + blue secondary on near-black.
export const COLORS = {
  accent: "#8B5CF6",
  accentLight: "#A78BFA",
  accentDark: "#7C3AED",
  accentDarker: "#6D28D9",
  secondary: "#3B82F6",
  secondaryLight: "#60A5FA",
  secondaryDark: "#2563EB",
  bg: "#0A0A0A",
  bgDeep: "#000000",
} as const;

// Shared cinematic page background — replaces the duplicated orange/red
// gradient stacks in layout.tsx, ServicesSection, and the work/contact/about pages.
export const CINEMATIC_BG = `
  radial-gradient(ellipse 140% 85% at -25% -35%, rgba(139,92,246,0.40) 0%, rgba(124,58,237,0.20) 25%, rgba(109,40,217,0.08) 48%, transparent 70%),
  radial-gradient(ellipse 65% 110% at -5% 28%, rgba(139,92,246,0.12) 0%, rgba(124,58,237,0.05) 38%, transparent 65%),
  radial-gradient(ellipse 48% 35% at 50% 52%, rgba(59,130,246,0.05) 0%, transparent 62%),
  radial-gradient(ellipse 52% 38% at 102% -8%, rgba(59,130,246,0.07) 0%, transparent 58%)
`;
