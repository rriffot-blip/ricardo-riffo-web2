import { getProperties } from "@/lib/properties";

const SITE_URL = "https://ricardoriffo.cl";

export default async function sitemap() {
  const properties = await getProperties();

  const staticRoutes = ["", "/propiedades", "/sobre-mi", "/contacto"].map((path) => ({
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

  return [...staticRoutes, ...propertyRoutes];
}
