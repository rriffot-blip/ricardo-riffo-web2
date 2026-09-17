import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PhotoGallery from "@/components/PhotoGallery";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/properties";
import { formatPrice, placeholderTheme } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property);
  const photos = property.photo_urls?.length ? property.photo_urls : [];
  const theme = placeholderTheme(property);

  return (
    <>
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

        <PhotoGallery photos={photos} theme={theme} />

        <div className="layout">
          <div>
            <div className="specs">
              <div><b>{property.area ?? "—"} m²</b><span>Superficie</span></div>
              <div><b>{property.bedrooms}</b><span>Dormitorios</span></div>
              <div><b>{property.bathrooms}</b><span>Baños</span></div>
              <div><b>{property.parking}</b><span>Estacionamiento</span></div>
            </div>

            {property.description && (
              <div className="block">
                <h2>Descripción</h2>
                <p>{property.description}</p>
              </div>
            )}

            {property.video_url && (
              <div className="block">
                <h2>Recorrido en video</h2>
                <a className="video" href={property.video_url} target="_blank" rel="noopener noreferrer">
                  <div className="play">▶</div>
                </a>
              </div>
            )}

            <div className="block">
              <h2>Ubicación</h2>
              <div className="mapbox" />
            </div>
          </div>

          <div className="sidebar">
            <div className="contactcard">
              <div className="broker">
                <div className="avatar" />
                <div><b>{property.broker_name || "Ricardo Riffo"}</b><span>Corredor a cargo</span></div>
              </div>
              <textarea rows={3} placeholder={`Hola Ricardo, me interesa "${property.title}"...`} />
              <a className="btn accent" href="#">Enviar por WhatsApp</a>
              <a className="btn ghost" href="#">Agendar visita</a>
            </div>
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
