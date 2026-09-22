import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/properties";
import { getPublishedPosts } from "@/lib/posts";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const properties = await getProperties();
  const featured = properties.slice(0, 5);
  const cardClasses = ["c1", "c2", "c3", "c4", "c5"];
  const recentPosts = await getPublishedPosts(3);

  const heroCandidates = properties.filter((p) => p.photo_urls?.length);
  const heroPhotos = [
    heroCandidates[0] ? { url: heroCandidates[0].photo_urls[0], label: `${heroCandidates[0].type} · ${heroCandidates[0].commune}` } : null,
    heroCandidates[1] ? { url: heroCandidates[1].photo_urls[0], label: `${heroCandidates[1].type} · ${heroCandidates[1].commune}` } : null,
    heroCandidates[2] ? { url: heroCandidates[2].photo_urls[0], label: null } : null,
  ];

  return (
    <>
      <Header />
      <main className="wrap">
        <section className="hero">
          <div>
            <h1>Propiedades que conozco de verdad. No solo de foto.</h1>
            <p className="lede">
              Visito personalmente cada propiedad, la recorro, la grabo y te cuento lo que realmente necesitas
              saber antes de visitarla.
            </p>
            <p className="lede">
              Arriendos y ventas en Santiago. Sin vueltas y con información real.
            </p>
            <div className="hero-cta">
              <a className="btn accent" href="#propiedades">Ver propiedades disponibles</a>
              <a className="btn ghost" href="/sobre-mi">Conocerme</a>
            </div>
            <div className="searchbar">
              <select defaultValue=""><option value="" disabled>Comuna</option><option>Ñuñoa</option><option>La Reina</option><option>Providencia</option><option>Macul</option></select>
              <select defaultValue=""><option value="" disabled>Tipo</option><option>Departamento</option><option>Casa</option><option>Oficina</option></select>
              <select defaultValue=""><option value="" disabled>Arriendo o venta</option><option>Arriendo</option><option>Venta</option></select>
              <a className="btn" href="/propiedades">Buscar</a>
            </div>
          </div>
          <div className="hero-collage">
            <div className={`ph p1 ${heroPhotos[0] ? "" : "grad1"}`}>
              {heroPhotos[0] ? (
                <>
                  <img src={heroPhotos[0].url} alt={heroPhotos[0].label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div className="tag">{heroPhotos[0].label}</div>
                </>
              ) : (
                <div className="tag">Depto 2D/1B · Ñuñoa</div>
              )}
            </div>
            <div className={`ph p2 ${heroPhotos[1] ? "" : "grad2"}`}>
              {heroPhotos[1] ? (
                <>
                  <img src={heroPhotos[1].url} alt={heroPhotos[1].label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div className="tag">{heroPhotos[1].label}</div>
                </>
              ) : (
                <div className="tag">Casa 3D/2B · La Reina</div>
              )}
            </div>
            <div className={`ph p3 ${heroPhotos[2] ? "" : "grad3"}`}>
              {heroPhotos[2] && (
                <img src={heroPhotos[2].url} alt="Propiedad publicada por Ricardo Riffo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>
          </div>
        </section>

        <div className="facts">
          <div className="fact"><b>15+ años</b><span>Experiencia inmobiliaria</span></div>
          <div className="fact"><b>Visita personal</b><span>Conozco las propiedades que publico</span></div>
          <div className="fact"><b>Información real</b><span>Fotos y videos propios</span></div>
          <div className="fact"><b>Respuesta directa</b><span>Hablas directamente conmigo</span></div>
        </div>

        <section id="propiedades">
          <div className="sectionhead">
            <div>
              <h2>Propiedades que puedes visitar</h2>
              <div className="sub">Departamentos y propiedades disponibles en Santiago.</div>
            </div>
            <a href="/propiedades">Ver todas las propiedades →</a>
          </div>

          {featured.length > 0 ? (
            <div className="plist">
              {featured.map((property, i) => (
                <PropertyCard key={property.slug} property={property} className={cardClasses[i]} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>Todavía no hay propiedades cargadas. En cuanto Ricardo agregue la primera desde el panel de administración, va a aparecer acá.</p>
            </div>
          )}
        </section>

        <section id="nosotros" className="about">
          <div className="photo" style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="/images/ricardo-riffo.jpg"
              alt="Ricardo Riffo, corredor de propiedades"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
            />
          </div>
          <div>
            <h2>Hola, soy Ricardo</h2>
            <p>
              No trabajo detrás de un escritorio publicando propiedades que no conozco.
            </p>
            <p>
              Visito personalmente los departamentos, los recorro, los grabo y te muestro tanto lo bueno como
              lo que deberías saber antes de ir a visitarlos.
            </p>
            <p>
              Llevo años trabajando en el rubro inmobiliario y hoy mi objetivo es simple: ayudarte a encontrar
              una propiedad y hacer que el proceso sea mucho más fácil.
            </p>
            <a className="btn accent" href="/contacto">Hablar con Ricardo</a>
          </div>
        </section>

        <section className="whyme">
          <div className="sectionhead">
            <div>
              <h2>¿Por qué buscar una propiedad conmigo?</h2>
            </div>
          </div>
          <div className="whyme-grid">
            <div>
              <b>Las visito personalmente</b>
              <span>No publico propiedades que no conozco.</span>
            </div>
            <div>
              <b>Te las muestro como son</b>
              <span>Fotos y videos reales, sin depender solo de imágenes de catálogo.</span>
            </div>
            <div>
              <b>Conozco Santiago</b>
              <span>Trabajo con propiedades en distintas comunas de Santiago.</span>
            </div>
            <div>
              <b>Hablas directamente conmigo</b>
              <span>Sin formularios interminables ni intermediarios.</span>
            </div>
          </div>
        </section>

        {recentPosts.length > 0 && (
          <section id="blog">
            <div className="sectionhead">
              <div><h2>Blog inmobiliario</h2></div>
              <a href="/blog">Ver todos →</a>
            </div>
            <div className="posts">
              {recentPosts.map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}`} className="post" style={{ textDecoration: "none" }}>
                  <span className="tag">{post.category}</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </a>
              ))}
            </div>
          </section>
        )}

        <section id="contacto" className="ctaband">
          <div>
            <h2>¿Buscas una propiedad o quieres vender la tuya?</h2>
            <p>Cuéntame qué estás buscando. Te responderé personalmente y veremos juntos cuál es la mejor alternativa.</p>
            <p style={{ opacity: 0.7, fontSize: "0.88rem", marginTop: 10 }}>
              También puedes escribirme directamente por{" "}
              <a href={whatsappLink("Hola Ricardo, quiero consultar por una propiedad.")} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                WhatsApp
              </a>.
            </p>
          </div>
          <a className="btn accent" href="/contacto">Hablar con Ricardo</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
