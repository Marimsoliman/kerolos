// src/lib/imageHealthCheck.ts
export async function checkMultipleImages(
  urls: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: "HEAD",
          cache: "no-store",
        });
        results.set(url, response.ok);
        
        if (!response.ok) {
          console.warn(`⚠️ Image health check failed: ${url} (${response.status})`);
        }
      } catch (error) {
        console.error(`❌ Image health check error: ${url}`, error);
        results.set(url, false);
      }
    })
  );

  return results;
}