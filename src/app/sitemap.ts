import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/katalog",
    "/podbor-vin",
    "/uslugi",
    "/o-kompanii",
    "/blog",
    "/kontakty",
    "/faq",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
