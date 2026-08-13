# Kerolos Portfolio — Complete Roadmap

> Scope: full codebase audit (Next.js 16 / React 19 / Tailwind 4 / MongoDB CMS / NextAuth / UploadThing, plus the GSAP + Framer Motion animation layers).
> Audit date: 2026-08-04. No code was changed to produce this document — it is a planning deliverable.
> Complexity scale: **S** ≤ 1 day · **M** 1–3 days · **L** 3–5 days · **XL** 1–2 weeks.

---

## 1. Where the project stands

The site is well past scaffolding: it has a full homepage (Hero, Marquee, scroll-reveal statement, Selected Work timeline, Services, Logo wall, Philosophy, About), a `/work` grid, case-study pages, a `/contact` page, an `/about` page, and a working admin CMS (login, project CRUD with drag-to-reorder, publish toggles, logo management) backed by MongoDB with NextAuth credentials auth and UploadThing image upload.

The visual work already in place is genuinely strong — the Selected Work timeline, the cursor-tracked editorial scroll text, and the layered hero portrait lighting are above typical portfolio level. That foundation is worth protecting.

But the project is **not deployable today** in its current state. A typecheck fails with build-blocking JSX errors, the contact form does not actually send anything, several API routes are unauthenticated, and the data model doesn't match the content the design clearly intends to show. The phases below are ordered so the project is green and safe first, then functional, then fast, then polished.

---

## 2. Critical findings — fix first

| # | Finding | Severity | Why it matters |
|---|---------|----------|----------------|
| 1 | `HeroSection.tsx` has **3 JSX duplicate `style` attributes** (~lines 257, 271, 436). `npx tsc --noEmit` fails; a production build will fail. | 🔴 Blocking | The site cannot be deployed until this is fixed. |
| 2 | Stray root files (`fix-project-ids.ts`, duplicate `page.tsx`/`layout.tsx`/`globals.css`/`AboutPageContent.tsx`/`EditForm.tsx` outside `src/`) break typecheck and pollute the repo. | 🔴 Blocking | `fix-project-ids.ts` has broken imports and is picked up by `tsconfig` include globs. |
| 3 | **Contact form is fake** — `ContactPageContent.tsx` submit handler only `console.log`s the data, then shows a simulated "Message Sent" screen. | 🟠 High | Every inquiry is silently lost. This is the single most business-critical functional gap. |
| 4 | **Unauthenticated write routes**: `PUT`/`DELETE /api/projects/[id]`, all `/api/logos/*` (add, reorder, delete), plus `/api/projects` POST and `/api/seed` which check *a* session but not the **admin role**. | 🟠 High | Anyone who finds the endpoints can delete projects, wipe the logo wall, or create content. |
| 5 | **Schema/data mismatch**: `src/lib/data.ts` and the seed route carry rich case-study fields (overview, challenge, concept, strategy, colors, typography, gradientClass, initial) that the Mongoose `Project` schema doesn't define — Mongoose silently drops them, and the case-study UI never renders them. | 🟠 High | The designed storytelling pages can't work as intended; case studies are shallow shells. |
| 6 | **Branding conflict**: `PROJECT_RULES.md` says Orange/White/Black; `globals.css`, Navigation, SelectedWork use **red** (#DC2626) with orange only in the hero; the Footer uses a different red (#FF3B3B). | 🟠 High | Inconsistent brand identity across the site; rules and implementation disagree. Needs an owner decision. |
| 7 | **Motion stack mismatch**: rules mandate GSAP + ScrollTrigger + Lenis + SplitType; the actual stack is Framer Motion. Lenis (`SmoothScroller.tsx`) and the session `Providers` are defined but **never mounted** in `layout.tsx`. SplitType isn't installed. | 🟡 Medium | Two animation philosophies; the smooth-scroll experience the design calls for isn't active. |
| 8 | **Missing image assets**: `data.ts` references `/images/projects/urban-studios/*` which don't exist on disk (only the `stellar-coffee` set exists). | 🟡 Medium | Broken images on the work page / case study for that project. |
| 9 | **Dead code & unconfigured deps**: `public/videos/hero.mp4` (3.3 MB, unused), `/prmpt` scratch page (719 lines, external URLs), `cloudinary` + `@upstash/*` installed but never configured/used, `rate-limit.ts` never invoked. | 🟡 Medium | Bundle/runtime bloat and a false sense that rate limiting exists. |
| 10 | **No version control** — the folder has no git repo. | 🟡 Medium | No history, no rollback, high risk during any refactor. |

---

## 3. Weak areas by domain

**Brand & design system**
- No single source of truth for accent color (red vs orange; hardcoded hexes across components).
- Typography is inconsistent: `next/font` loads Inter; the CSS `@theme` declares Satoshi and "Inter Tight" via a render-blocking Fontshare `@import`; "Inter Tight" is never actually loaded. Fonts should be decided and self-hosted.
- A global `* { background-color: transparent }` override in `layout.tsx` (anti-white-flash hack) is fragile and fights component backgrounds.

**Data & content architecture**
- Two sources of truth for projects: static `src/lib/data.ts` and MongoDB. The DB is the live source for the homepage/work page, but the seed/static data holds the richer fields the schema drops.
- Services, process steps, about-page copy (~40 KB hardcoded), socials, and contact details are all hardcoded in components — not editable through the CMS.
- Logos are stored as **base64 data-URLs in MongoDB** (from the logos admin) — document bloat and slow queries as the wall grows.

**Security & auth**
- Missing admin-role enforcement on most write routes (finding #4).
- NextAuth **v4** on Next 16 / React 19 — an old auth stack on a new runtime; works today but is a known upgrade risk point (v5 beta is the supported path forward).
- Admin users can only be created via one-off scripts (`scripts/createAdmin.ts`, env `ADMIN_SETUP_KEY`); no UI or documented first-run flow.
- `dangerouslyAllowSVG: true` in next.config is enabled without a real need.

**Performance**
- Homepage is `force-dynamic` — every visit queries MongoDB; case-study pages use `revalidate = 3600` ISR. Inconsistent and, for a portfolio that changes rarely, needlessly slow. On-demand revalidation from the CMS is the right model.
- `SmartImage` hardcodes `unoptimized`, bypassing the Next image optimizer even in production (the next.config comment says optimization should be on in prod — the component contradicts it).
- Case-study gallery sets `priority` on **every** image (18 images eager-loaded).
- Multiple full-viewport film-grain SVG overlay layers (fixed, blend-mode) across sections — real paint cost on low-end devices.
- `LogoWall` fetches `/api/logos` client-side on every page load with no cache.
- Fontshare `@import` is an external render-blocking request.

**Motion & experience**
- No route/page transitions; navigation is a hard swap.
- GSAP is only used in the scratch `/prmpt` page. The headline reveals are Framer-Motion word masks — nice, but not the SplitType-driven typography the rules call for.
- `prefers-reduced-motion` is handled in some spots (hero) but not globally.
- No error/loading states for the logo wall; work-page cards animate on mount rather than on scroll in.

**SEO, a11y, i18n**
- Minimal metadata: no Open Graph/Twitter cards, no sitemap, no robots, no JSON-LD, weak per-page metadata beyond title/description.
- No skip links, partial focus management in the mobile menu, decorative overlays sometimes lack `aria-hidden`.
- `lang="en"` hardcoded; the agency is Egyptian/Arabic. No i18n story.

**Engineering & ops**
- No git, no CI, no tests, no lint gate, no monitoring, no analytics.
- Two parallel upload systems: UploadThing (used by the CMS) and `/api/upload` (writes to server disk, won't persist on serverless/Vercel).
- The Logo schema is duplicated inline in three API files instead of importing the shared model — drift risk.
- Loose TypeScript (`allowJs: true`, `any` scattered), mixed English/Arabic comments/logs.
- Env vars undocumented (no `.env.example`); secrets management is manual.

**What's already strong (keep it)**
- Section-level composition and storytelling (Selected Work timeline, editorial scroll text, hero lighting layers).
- Memoized components, RAF-throttled scroll handlers, passive listeners, and `will-change` discipline in the polished sections.
- Client-side image compression (400 KB target) before upload.
- Careful filename sanitization in the upload route; generic login errors; bcrypt + email validation.
- `React.cache` + ISR + `generateStaticParams` on case-study pages.
- Clean folder separation (`app` / `components` / `lib` / `models`).

---

## 4. Phased roadmap

### Phase 0 — Stabilize the build  🟢 (S, ~0.5–1 day)
**Goal:** green typecheck and build; clean, versioned baseline.
- Merge the three duplicate `style` props in `HeroSection.tsx`.
- Move/delete stray root files (remove `fix-project-ids.ts`, root duplicates, `/prmpt` page, `convert-image.js`; keep utility scripts in `/scripts` with correct paths).
- `git init`, first commit, add `typecheck`/`build`/`lint` npm scripts.
- Document env vars in `.env.example` (MONGODB_URI, NEXTAUTH_SECRET/URL, UPLOADTHING_TOKEN, ADMIN_*).
- **Exit criteria:** `npx tsc --noEmit` and `npm run build` pass; git history exists.

### Phase 1 — Security & data integrity  🟠 (M, ~2–3 days)
**Goal:** no unauthenticated writes; DB schema matches the content model.
- Add a single `requireAdmin()` guard and apply it to every mutating route (projects PUT/DELETE, logos POST/DELETE/reorder, seed, uploadthing middleware, projects POST).
- Extend the `Project` schema with the case-study fields (overview, challenge, concept, strategy, colors, typography, gradientClass, initial) + migration for existing docs.
- Decide DB-as-source-of-truth; keep `data.ts` only as seed input; make the seed command explicit (`npm run seed`).
- Fix or remove the `urban-studios` image references; add a missing-asset check.
- Remove unconfigured deps (cloudinary, upstash) or wire them up; unblock `rate-limit.ts` if it's to be used.
- **Exit criteria:** no write route works without an admin session; project documents carry the full field set.

### Phase 2 — Real contact flow  🟠 (S/M, ~1–2 days)
**Goal:** inquiries actually reach you.
- Add a contact submission API (email via a provider like Resend, or storage to Mongo with an admin inbox view).
- Server-side validation, honeypot, rate limiting (Upstash once configured, or a DB-backed throttle).
- Honest success/error UX; wire the existing form.
- **Exit criteria:** submitting the form delivers a message you can read; spam is throttled.

### Phase 3 — Performance & rendering strategy  🟡 (M, ~2–4 days)
**Goal:** fast first paint and scroll on all devices.
- Replace homepage `force-dynamic` with ISR + **on-demand revalidation** triggered by CMS mutations.
- Let the Next image optimizer do its job: remove hardcoded `unoptimized`, fix `SmartImage`, set first-image-only `priority` in case-study galleries, correct `sizes`.
- Self-host the chosen display font; remove the Fontshare `@import`; align font tokens.
- Defer below-fold sections and reduce redundant grain-overlay layers; cache the logo-wall fetch.
- Establish a Lighthouse / Web-Vitals baseline before and after.
- **Exit criteria:** measurable Core Web Vitals improvement; no render-blocking external font request.

### Phase 4 — Motion & experience refinement  🎨 (M/L, ~3–5 days)
**Goal:** the smooth, cinematic feel the rules promise — done right.
- Decide the motion stack: formally adopt GSAP + ScrollTrigger (per PROJECT_RULES) or commit fully to Framer Motion. Mixed stacks cause jank and drift. If GSAP: add SplitType for headline reveals and **mount Lenis** (the component already exists, unused) with ScrollTrigger scrub wiring.
- Add route-level page transitions and scroll-aware reveals on the work grid.
- Build the rich case-study sections the data model now supports (overview → challenge → concept → strategy, color system, typography) with purpose-driven animations.
- Global `prefers-reduced-motion` handling.
- **Exit criteria:** smooth-scroll active everywhere; case studies tell the full story; motion respects reduced-motion settings.

### Phase 5 — CMS completeness  🟡 (M, ~3–5 days)
**Goal:** you can run the whole site from the admin, no code edits.
- Extend the project create/edit forms with the case-study fields (colors, typography, challenge, concept…).
- Add admin user management UI and a documented first-run setup (replace script-only admin creation).
- Site settings model (socials, contact email, about copy, services/process text) or move about/services content into the CMS.
- Replace base64-in-DB logos with UploadThing/Cloudinary URLs; consolidate upload paths (retire `/api/upload` if serverless is the target).
- **Exit criteria:** new projects ship with full case studies; logos, services, and about copy are CMS-editable.

### Phase 6 — SEO, accessibility, i18n  🟡 (M, ~2–4 days)
**Goal:** findable, usable, and correctly branded for the audience.
- Metadata + Open Graph/Twitter images, `sitemap.xml`, `robots.txt`, JSON-LD, canonical URLs.
- Accessibility pass: skip links, focus states, keyboard nav, `aria` on decorative layers, reduced motion.
- Decide the Arabic scope (`lang`/i18n) and, if in, an approach (Next.js i18n or a lightweight locale switch).
- **Exit criteria:** Lighthouse a11y/SEO scores green; Arabic decision made (either implemented or explicitly deferred).

### Phase 7 — Hardening & launch  🟢 (S/M, ~2–3 days)
**Goal:** safe to ship and iterate on.
- CI pipeline: lint → typecheck → build → preview; basic unit tests for auth, validation, and rate limiting.
- Error monitoring (Sentry) and lightweight analytics.
- Deploy docs, Mongo backup strategy, secret management.
- Cross-device QA + final performance budget check against the Phase 3 baseline.
- **Exit criteria:** a tagged v1 deploy with monitoring, backups, and a green CI.

---

## 5. Prioritized backlog

| Priority | Item | Phase | Complexity |
|----------|------|-------|------------|
| P0 | Fix build-breaking JSX errors + stray files | 0 | S |
| P0 | Git init + commit baseline | 0 | S |
| P0 | Authenticate all write routes (admin role) | 1 | S |
| P0 | Wire the contact form to a real backend | 2 | S–M |
| P1 | Align Project schema + seed with the case-study fields | 1 | M |
| P1 | Homepage ISR + on-demand revalidation | 3 | M |
| P1 | Restore image optimization (`SmartImage`, priority, sizes) | 3 | M |
| P1 | Resolve brand color (orange vs red) & centralize tokens | 4 | S–M |
| P1 | Mount Lenis + settle motion stack | 4 | M |
| P2 | Rich case-study sections in the UI | 4–5 | M |
| P2 | CMS: case-study fields in admin forms | 5 | M |
| P2 | Admin user management + first-run setup | 5 | M |
| P2 | Fonts: self-host one family, drop Fontshare import | 3 | S |
| P2 | Logo storage: URLs instead of base64 in DB | 5 | M |
| P3 | SEO/OG/sitemap/JSON-LD | 6 | M |
| P3 | Accessibility pass + reduced-motion global | 6 | M |
| P3 | Arabic/i18n decision | 6 | L |
| P3 | CI, tests, monitoring, backups | 7 | M |
| P3 | Remove dead code (hero.mp4, /prmpt, unconfigured deps) | 0/7 | S |

---

## 6. Execution summary

- **Order matters:** the first three phases (Stabilize → Secure → Contact) are the only things between the site and "safe to show the world." Everything after that is polish, depth, and scale.
- **Estimated total effort:** roughly **4–6 weeks of focused work** end-to-end, or ~2–3 weeks if Phases 6–7 are deferred until after launch.
- **Parallelizable:** Phases 3 and 5 are largely independent once Phase 1 lands; Phase 6 depends on Phase 4 (reduced-motion) and Phase 5 (metadata from settings).
- **Do first after this doc:** Phase 0 (it's ~half a day and unblocks everything), then Phase 1 security before anyone else sees the URL.

---

## 7. Decisions needed from you

1. **Brand accent — orange or red?** `PROJECT_RULES.md` says orange; the implemented theme is red. This one decision affects every token and component.
2. **Motion stack — commit to GSAP (per the rules) or Framer Motion?** Recommendation: keep Framer Motion where it's already excellent, add GSAP + ScrollTrigger for scroll-scrubbed storytelling and Lenis for smooth scroll — but set the boundary explicitly so the two don't fight.
3. **Contact channel — email provider (e.g., Resend) or an admin inbox in the CMS?** Email is fastest to ship; an inbox keeps everything in one place.
4. **Arabic content — in scope for launch, or English-only first?**
5. **Deployment target — Vercel/serverless?** It determines whether `/api/upload` (disk-based) should be retired in favor of UploadThing/Cloudinary only.
