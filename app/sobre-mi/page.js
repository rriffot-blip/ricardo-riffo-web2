import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sobre mí — Ricardo Riffo Propiedades",
};

export default function SobreMiPage() {
  return (
    <>
      <Header />
      <main className="wrap">
        <div className="pagehero">
          <h1>Corredor de propiedades, no vendedor de catálogo.</h1>
          <p className="lede">
            Llevo años recorriendo Santiago propiedad por propiedad. Cada publicación que ves en este sitio
            la visité y grabé yo mismo — no son fotos de stock ni descripciones genéricas.
          </p>
        </div>

        <section className="about" style={{ marginTop: 56 }}>
          <div className="photo" />
          <div>
            <h2>Cómo trabajo</h2>
            <p>
              Cuando me escribes por una propiedad, te respondo yo — no un sistema automático ni un call
              center. Si algo no calza con lo que buscas, te lo digo directo, aunque signifique no cerrar
              ese arriendo.
            </p>
            <p>
              Grabo un recorrido en video de cada propiedad el mismo día que la visito, para que puedas
              ver el estado real antes de agendar una visita presencial.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Trayectoria</h2>
          <div className="timeline">
            <div>
              <b>60+ propiedades en arriendo activas</b>
              <span>Administradas y actualizadas semanalmente</span>
            </div>
            <div>
              <b>7 comunas con cobertura</b>
              <span>Ñuñoa, La Reina, Providencia, Macul y alrededores</span>
            </div>
            <div>
              <b>Creciendo en ventas</b>
              <span>Ampliando el servicio más allá del arriendo</span>
            </div>
          </div>
        </section>

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
