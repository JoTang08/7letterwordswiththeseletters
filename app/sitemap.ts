import type { MetadataRoute } from "next";
import { PAGE_CONFIGS } from "@/lib/config";

export const dynamic = "force-static";

const BASE = "https://7letterwordswiththeseletters.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_CONFIGS.map(({ n, slug }) => ({
    url: n === 7 ? `${BASE}/` : `${BASE}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: n === 7 ? 1.0 : 0.8,
  }));
}
