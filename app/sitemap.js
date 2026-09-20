import { getProperties } from "@/lib/properties";
import { getPublishedPosts } from "@/lib/posts";

const SITE_URL = "https://ricardoriffo.cl";

export default async function sitemap() {
  const properties = await getProperties();
  const posts = await getPublishedPosts();

  const staticRoutes = ["", "/propiedades", "/propietarios", "/blog", "/sobre-mi", "/contacto"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/propiedades" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const propertyRoutes = properties.map((p) => ({
    url: `${SITE_URL}/propiedades/${p.slug}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...propertyRoutes, ...postRoutes];
}
