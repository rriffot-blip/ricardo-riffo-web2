import Link from "next/link";
import { notFound } from "next/navigation";
import { Ruler, BedDouble, Bath, Car, Warehouse } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ContactCard from "@/components/ContactCard";
import PhotoGallery from "@/components/PhotoGallery";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/properties";
import { formatPrice, placeholderTheme } from "@/lib/format";
import { getTiktokEmbedId } from "@/lib/tiktok";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};

  const title = property.title;
  const description = property.description
    ? property.description.slice(0, 155)
    : `${property.type} en ${property.operation.toLowerCase()} en ${property.commune}. ${formatPrice(property)}${property.operation === "Arriendo" ? " al mes" : ""}.`;
  const image = property.photo_urls?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property);
  const photos = property.photo_urls?.length ? property.photo_urls : [];
  const theme = placeholderTheme(property);
  const tiktokId = getTiktokEmbedId(property.video_url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || undefined,
    url: `https://ricardoriffo.cl/propiedades/${property.slug}`,
    image: photos.length ? photos : undefined,
    datePosted: property.created_at,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.commune,
      streetAddress: property.address || undefined,
      addressCountry: "CL",
    },
    offers: {
      "@type": "Offer",
      price: property.price_amount,
      priceCurrency: property.price_currency,
      availability: property.status === "Disponible" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.area ? { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="wrap">
        <div className="crumb">
          <Link href="/propiedades">Propiedades</Link> / {property.commune} / {property.title}
        </div>

        <div className="titlebar">
          <div>
            <span className="status">{property.status}</span>
            <h1>{property.title}</h1>
            <div className="loc">{property.address || property.commune}</div>
          </div>
          <div className="pricebox">
            <div className="price">{formatPrice(property)}</div>
            <div className="sub">{property.price_note}</div>
          </div>
        </div>

        <PhotoGallery photos={photos} theme={theme} title={property.title} />

        <div className="layout">
          <div>
            <div className="specs">
              <div><Ruler size={20} strokeWidth={1.5} /><b>{property.area ?? "—"} m²</b><span>Superficie</span></div>
              <div><BedDouble size={20} strokeWidth={1.5} /><b>{property.bedrooms}</b><span>Dormitorios</span></div>
              <div><Bath size={20} strokeWidth={1.5} /><b>{property.bathrooms}</b><span>Baños</span></div>
              <div><Car size={20} strokeWidth={1.5} /><b>{property.parking}</b><span>Estacionamiento</span></div>
            </div>

            {property.storage && (
              <p style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-soft)", fontSize: "0.88rem", margin: "-20px 0 32px" }}>
                <Warehouse size={16} strokeWidth={1.75} /> Incluye bodega
              </p>
            )}

            {property.description && (
              <div className="block">
                <h2>Descripción</h2>
                <p>{property.description}</p>
              </div>
            )}

            {property.video_url && (
              <div className="block">
                <h2>Recorrido en video</h2>
                {tiktokId ? (
                  <div className="tiktok-embed-wrap">
                    <iframe
                      src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      title="Recorrido en video"
                    />
                  </div>
                ) : (
                  <a className="video" href={property.video_url} target="_blank" rel="noopener noreferrer">
                    <div className="play">▶</div>
                  </a>
                )}
              </div>
            )}

            <div className="block">
              <h2>Ubicación</h2>
              <div className="mapbox" />
            </div>
          </div>

          <div className="sidebar">
            <ContactCard property={property} />
          </div>
        </div>

        {similar.length > 0 && (
          <div className="similar">
            <h2>Propiedades similares</h2>
            <div className="simgrid">
              {similar.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
