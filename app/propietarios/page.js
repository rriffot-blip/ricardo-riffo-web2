import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OwnerContactForm from "@/components/OwnerContactForm";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Propietarios — Arrienda o vende tu propiedad",
  description: "¿Tienes una propiedad en Santiago? Te ayudo a arrendarla o venderla, con visitas y recorridos reales, atención directa y sin intermediarios.",
};

export default function PropietariosPage() {
  return (
    <>
      <Header />
      <main className="wrap">
        <div className="pagehero">
          <h1>¿Tienes una propiedad para arrendar o vender?</h1>
          <p className="lede">
            Me encargo de todo el proceso: fotos, video del recorrido, publicación, atención a interesados
            y seguimiento — con contacto directo conmigo, no con un call center.
          </p>
          <div className="hero-cta" style={{ marginTop: 24 }}>
            <a
              className="btn accent"
              href={whatsappLink("Hola Ricardo, tengo una propiedad y quiero conversar contigo.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversar por WhatsApp
            </a>
            <a className="btn ghost" href="#formulario">Dejar mis datos</a>
          </div>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <h3>Arriendo</h3>
            <p>Gestiono la publicación y el proceso completo hasta encontrar un arrendatario adecuado.</p>
            <ul>
              <li>Fotos y video del recorrido</li>
              <li>Publicación y difusión</li>
              <li>Atención a consultas y coordinación de visitas</li>
              <li>Revisión de documentación de postulantes</li>
              <li>Seguimiento hasta la firma</li>
            </ul>
          </div>
          <div className="service-card">
            <h3>Venta</h3>
            <p>Acompaño el proceso de venta con atención directa y visitas coordinadas contigo.</p>
            <ul>
              <li>Fotos y video del recorrido</li>
              <li>Publicación y difusión</li>
              <li>Coordinación de visitas con interesados</li>
              <li>Seguimiento de ofertas</li>
              <li>Acompañamiento hasta el cierre</li>
            </ul>
          </div>
        </div>

        <section>
          <h2 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Cómo trabajo</h2>
          <div className="timeline">
            <div>
              <b>1. Conversamos y visito la propiedad</b>
              <span>Reviso el estado, tomo fotos y grabo el recorrido en video</span>
            </div>
            <div>
              <b>2. Publico y difundo</b>
              <span>En el sitio y en mis redes, con la información real de tu propiedad</span>
            </div>
            <div>
              <b>3. Gestiono los interesados</b>
              <span>Respondo consultas, coordino visitas y reviso documentación cuando corresponde</span>
            </div>
            <div>
              <b>4. Te mantengo al tanto</b>
              <span>Seguimiento del proceso hasta cerrar el arriendo o la venta</span>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Preguntas frecuentes</h2>
          <div className="faq">
            <details>
              <summary>¿Debo estar presente en las visitas?</summary>
              <p>No es necesario. Yo coordino y realizo las visitas directamente, y te mantengo al tanto de cómo va cada una.</p>
            </details>
            <details>
              <summary>¿En qué comunas trabajas?</summary>
              <p>Principalmente en Ñuñoa, La Reina, Providencia, Macul y comunas cercanas. Si tu propiedad está en otra zona, escríbeme igual y lo conversamos.</p>
            </details>
            <details>
              <summary>¿Qué necesito para publicar mi propiedad?</summary>
              <p>Para partir, solo necesito coordinar una visita. Ahí conversamos los detalles y documentación según si es arriendo o venta.</p>
            </details>
            <details>
              <summary>¿Cuánto se demora en arrendarse o venderse?</summary>
              <p>Depende de cada propiedad, comuna y las condiciones del mercado — no puedo prometer un plazo fijo, pero te mantengo informado durante todo el proceso.</p>
            </details>
          </div>
        </section>

        <section id="formulario" style={{ paddingBottom: 90 }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: 18 }}>Déjame tus datos</h2>
          <div className="formcard" style={{ maxWidth: 560 }}>
            <OwnerContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
