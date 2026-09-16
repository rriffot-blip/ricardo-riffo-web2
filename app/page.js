import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/properties";

export default function HomePage() {
  const featured = properties.slice(0, 5);
  const cardClasses = ["c1", "c2", "c3", "c4", "c5"];

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
              <a className="btn ghost" href="#nosotros">Conóceme</a>
            </div>
            <div className="searchbar">
              <select defaultValue=""><option value="" disabled>Comuna</option><option>Ñuñoa</option><option>La Reina</option><option>Providencia</option><option>Macul</option></select>
              <select defaultValue=""><option value="" disabled>Tipo</option><option>Departamento</option><option>Casa</option><option>Oficina</option></select>
              <select defaultValue=""><option value="" disabled>Arriendo o venta</option><option>Arriendo</option><option>Venta</option></select>
              <button className="btn">Buscar</button>
            </div>
          </div>
          <div className="hero-collage">
            <div className="ph grad1 p1"><div className="tag">Depto 2D/1B · Ñuñoa</div></div>
            <div className="ph grad2 p2"><div className="tag">Casa 3D/2B · La Reina</div></div>
            <div className="ph grad3 p3" />
          </div>
        </section>

        <div className="facts">
          <div className="fact"><b>60+</b><span>propiedades en arriendo activas</span></div>
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
            <a href="#">Ver todas las propiedades →</a>
          </div>
          <div className="plist">
            {featured.map((property, i) => (
              <PropertyCard key={property.slug} property={property} className={cardClasses[i]} />
            ))}
          </div>
        </section>

        <section id="nosotros" className="about">
          <div className="photo" />
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
            <a className="btn accent" href="#contacto">Escribir a Ricardo</a>
          </div>
        </section>

        <section className="clips">
          <div className="sectionhead">
            <div>
              <h2>Recorridos en video</h2>
              <div className="sub">Los mismos videos que subo a TikTok e Instagram</div>
            </div>
            <a href="#">Ver todos →</a>
          </div>
          <div className="cliprow">
            <div className="clip grad1"><div className="play">▶</div></div>
            <div className="clip grad2"><div className="play">▶</div></div>
            <div className="clip grad3"><div className="play">▶</div></div>
            <div className="clip grad1"><div className="play">▶</div></div>
          </div>
        </section>

        <section id="consejos">
          <div className="sectionhead">
            <div><h2>Consejos para arrendar y vender</h2></div>
            <a href="#">Ver todos →</a>
          </div>
          <div className="posts">
            <div className="post">
              <span className="tag">Arriendo</span>
              <h3>Qué documentos pedir antes de firmar un contrato</h3>
              <p>Una checklist corta para evitar problemas después de mudarte.</p>
            </div>
            <div className="post">
              <span className="tag">Venta</span>
              <h3>Cómo se define el precio de tasación en Santiago</h3>
              <p>Los factores que más influyen, explicados sin tecnicismos.</p>
            </div>
            <div className="post">
              <span className="tag">Comunas</span>
              <h3>Ñuñoa vs. La Reina: diferencias para arrendar</h3>
              <p>Precios, conectividad y tipo de propiedad disponible en cada una.</p>
            </div>
          </div>
        </section>

        <section id="contacto" className="ctaband">
          <div>
            <h2>¿Buscas propiedad o quieres vender la tuya?</h2>
            <p>Escríbeme directo por WhatsApp y te respondo con opciones reales, no un formulario genérico.</p>
          </div>
          <a className="btn accent" href="#">Escribir por WhatsApp</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
