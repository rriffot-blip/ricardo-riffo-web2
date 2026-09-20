import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/properties";
import { getPublishedPosts } from "@/lib/posts";
import { getTiktokEmbedId } from "@/lib/tiktok";
import { placeholderTheme } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const properties = await getProperties();
  const featured = properties.slice(0, 5);
  const cardClasses = ["c1", "c2", "c3", "c4", "c5"];
  const videoProperties = properties.filter((p) => p.video_url).slice(0, 4);
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
            <h1>Propiedades que conozco de verdad, no solo de foto.</h1>
            <p className="lede">
              Visito cada propiedad personalmente, grabo el recorrido y te cuento lo bueno y lo que no lo es
              tanto. Arriendo y venta en Santiago.
            </p>
            <div className="hero-cta">
              <a className="btn accent" href="#propiedades">Ver propiedades disponibles</a>
              <a className="btn ghost" href="/sobre-mi">Conóceme</a>
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
          <div className="fact"><b>{properties.length}</b><span>propiedades cargadas hoy</span></div>
          <div className="fact"><b>7</b><span>comunas con cobertura</span></div>
          <div className="fact"><b>100%</b><span>visitadas y grabadas por mí</span></div>
          <div className="fact"><b>24h</b><span>tiempo promedio de respuesta</span></div>
        </div>

        <section id="propiedades">
          <div className="sectionhead">
            <div>
              <h2>Disponibles esta semana</h2>
              <div className="sub">{properties.length} propiedades cargadas</div>
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
              Llevo años recorriendo Santiago propiedad por propiedad. No trabajo con fotos de catálogo: cada
              publicación que ves acá la grabé yo mismo, el mismo día que la visité.
            </p>
            <p>
              Hoy administro más de 60 propiedades en arriendo y estoy creciendo en ventas. Si buscas algo
              específico, escríbeme directo — te respondo yo, no un sistema automático.
            </p>
            <a className="btn accent" href="/contacto">Escribir a Ricardo</a>
          </div>
        </section>

        {videoProperties.length > 0 && (
          <section className="clips">
            <div className="sectionhead">
              <div>
                <h2>Recorridos en video</h2>
                <div className="sub">Los mismos videos que subo a TikTok e Instagram</div>
              </div>
              <a href="/propiedades">Ver todas →</a>
            </div>
            <div className="cliprow">
              {videoProperties.map((p) => {
                const id = getTiktokEmbedId(p.video_url);
                return (
                  <Link key={p.slug} href={`/propiedades/${p.slug}`} className="clip">
                    {id ? (
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${id}`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="lazy"
                        title={p.title}
                      />
                    ) : (
                      <div className={placeholderTheme(p)} style={{ width: "100%", height: "100%" }}>
                        <div className="play">▶</div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

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
            <h2>¿Buscas propiedad o quieres vender la tuya?</h2>
            <p>Escríbeme directo por WhatsApp y te respondo con opciones reales, no un formulario genérico.</p>
          </div>
          <a className="btn accent" href="/contacto">Ir a contacto</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
