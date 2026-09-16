import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties, getPropertyBySlug, getSimilarProperties } from "@/lib/properties";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = getSimilarProperties(property);

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="crumb">
          <Link href="/#propiedades">Propiedades</Link> / {property.commune} / {property.title}
        </div>

        <div className="titlebar">
          <div>
            <span className="status">{property.status}</span>
            <h1>{property.title}</h1>
            <div className="loc">{property.address}</div>
          </div>
          <div className="pricebox">
            <div className="price">{property.price}</div>
            <div className="sub">{property.priceSub}</div>
          </div>
        </div>

        <div className="gallery">
          <div className={`main ${property.photoTheme}`} />
          <div className="side">
            <div className="grad2" />
            <div className="grad3 more" />
          </div>
        </div>

        <div className="layout">
          <div>
            <div className="specs">
              <div><b>{property.area} m²</b><span>Superficie</span></div>
              <div><b>{property.bedrooms}</b><span>Dormitorios</span></div>
              <div><b>{property.bathrooms}</b><span>Baños</span></div>
              <div><b>{property.parking}</b><span>Estacionamiento</span></div>
            </div>

            <div className="block">
              <h2>Descripción</h2>
              <p>{property.description}</p>
            </div>

            <div className="block">
              <h2>Recorrido en video</h2>
              <div className="video"><div className="play">▶</div></div>
            </div>

            <div className="block">
              <h2>Qué incluye</h2>
              <div className="amenities">
                {property.amenities.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </div>

            <div className="block">
              <h2>Ubicación</h2>
              <div className="mapbox" />
            </div>
          </div>

          <div className="sidebar">
            <div className="contactcard">
              <div className="broker">
                <div className="avatar" />
                <div><b>{property.broker}</b><span>Corredor a cargo</span></div>
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
