import "dotenv/config";
import sharp from "sharp";
import { UTApi } from "uploadthing/server";
import { dbConnect } from "./src/lib/mongodb";
import Project from "./src/models/Project";

// شغّل بـ DRY_RUN=1 عشان تعرض الخطة من غير ما تغيّر حاجة
const DRY_RUN = process.env.DRY_RUN === "1";
const MAX_BYTES = 1 * 1024 * 1024; // هنضغط بس الصور اللي أكبر من 1MB
const TARGET_IDS = (process.env.TARGET_IDS || "").split(",").filter(Boolean); // فاضي = كل المشاريع

const utapi = new UTApi();

function extractUrl(res: any): string | null {
  if (res?._tag === "Right" && res?.value?.url) return res.value.url;
  if (res?.data?.url) return res.data.url;
  if (res?.url) return res.url;
  return null;
}

interface Processed {
  ok: boolean;
  newUrl?: string;
  reason: string;
}

async function processImage(url: string): Promise<Processed> {
  const isGifByUrl = url.toLowerCase().includes(".gif");
  if (isGifByUrl) return { ok: false, reason: "gif (skipped)" };

  let resp: Response;
  try {
    resp = await fetch(url, { signal: AbortSignal.timeout(90000) });
  } catch {
    return { ok: false, reason: "download failed" };
  }
  if (!resp.ok) return { ok: false, reason: `HTTP ${resp.status}` };

  const ct = (resp.headers.get("content-type") || "").toLowerCase();
  if (!ct.startsWith("image/")) return { ok: false, reason: `not image (${ct})` };
  if (ct.includes("gif")) return { ok: false, reason: "gif (skipped)" };

  const declared = Number(resp.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > 0 && declared <= MAX_BYTES) {
    return { ok: false, reason: `small (${(declared / 1024 / 1024).toFixed(2)}MB)` };
  }

  const buf = Buffer.from(await resp.arrayBuffer());
  if (buf.length <= MAX_BYTES) {
    return { ok: false, reason: `small (${(buf.length / 1024 / 1024).toFixed(2)}MB)` };
  }

  let out: Buffer;
  let outType: string;
  let outName: string;
  try {
    const meta = await sharp(buf).metadata();
    const pipeline = sharp(buf).rotate().resize(1920, 1920, {
      fit: "inside",
      withoutEnlargement: true,
    });
    if (meta.hasAlpha) {
      out = await pipeline.webp({ quality: 80 }).toBuffer();
      outType = "image/webp";
      outName = "img.webp";
    } else {
      out = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      outType = "image/jpeg";
      outName = "img.jpg";
    }
  } catch {
    return { ok: false, reason: "sharp failed" };
  }

  const before = (buf.length / 1024 / 1024).toFixed(2);
  const after = (out.length / 1024 / 1024).toFixed(2);

  if (DRY_RUN) return { ok: true, reason: `${before}MB -> ${after}MB` };

  const file = new File([new Uint8Array(out)], outName, { type: outType });
  let res: any;
  try {
    res = await utapi.uploadFiles(file);
  } catch (e: any) {
    return { ok: false, reason: `upload threw: ${e?.message}` };
  }
  const newUrl = extractUrl(res);
  if (!newUrl) {
    return { ok: false, reason: `no url in result: ${JSON.stringify(res).slice(0, 200)}` };
  }
  return { ok: true, newUrl, reason: `${before}MB -> ${after}MB` };
}

async function main() {
  await dbConnect();

  const query = TARGET_IDS.length ? { id: { $in: TARGET_IDS } } : {};
  const projects = await Project.find(query).sort({ order: 1 });

  // اجمع كل الروابط الفريدة مع مكانها
  const urlMap = new Map<string, { proj: any; field: "image" | "images"; index?: number }[]>();
  for (const p of projects) {
    if (p.image) {
      const arr = urlMap.get(p.image) || [];
      arr.push({ proj: p, field: "image" });
      urlMap.set(p.image, arr);
    }
    (p.images || []).forEach((u: string, i: number) => {
      if (!u) return;
      const arr = urlMap.get(u) || [];
      arr.push({ proj: p, field: "images", index: i });
      urlMap.set(u, arr);
    });
  }

  console.log(`\nFound ${urlMap.size} unique image URLs across ${projects.length} projects. DRY_RUN=${DRY_RUN}\n`);

  let compressed = 0;
  let saved = 0;
  let skipped = 0;
  const touchedProjects = new Set<any>();

  for (const [oldUrl, refs] of urlMap) {
    const res = await processImage(oldUrl);
    if (res.ok && res.newUrl) {
      compressed++;
      console.log(`✓ [${refs[0].proj.id}] ${res.reason}`);
      if (!DRY_RUN) {
        for (const ref of refs) {
          if (ref.field === "image") ref.proj.image = res.newUrl!;
          else ref.proj.images[ref.index!] = res.newUrl!;
          touchedProjects.add(ref.proj);
        }
        saved++;
      }
    } else {
      skipped++;
      console.log(`– [${refs[0].proj.id}] ${res.reason}`);
    }
  }

  if (!DRY_RUN && touchedProjects.size > 0) {
    await Promise.all([...touchedProjects].map((p: any) => p.save()));
    console.log(`\n💾 Saved ${touchedProjects.size} project(s) with updated URLs.`);
  }

  console.log(
    `\nDONE: ${compressed} compressed, ${saved} url-replacements, ${skipped} skipped (DRY_RUN=${DRY_RUN})`
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("FATAL", e?.message || e);
  process.exit(1);
});
