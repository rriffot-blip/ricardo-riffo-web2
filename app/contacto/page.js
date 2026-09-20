import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Contacto — Ricardo Riffo Propiedades",
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="wrap">
        <div className="pagehero">
          <h1>Hablemos</h1>
          <p className="lede">
            Cuéntame qué estás buscando (comuna, presupuesto, tipo de propiedad) y te respondo directo,
            normalmente el mismo día.
          </p>
        </div>

        <div className="contactgrid">
          <div className="formcard">
            <h2>Escríbeme</h2>
            <ContactForm />
          </div>

          <div>
            <h2>Otras formas de contacto</h2>
            <div className="contactinfo">
              <div>
                <b>WhatsApp</b>
                <span>Respuesta más rápida — normalmente en menos de 24 horas</span>
              </div>
              <div>
                <b>Correo</b>
                <span>[email protected]</span>
              </div>
              <div>
                <b>Zona de cobertura</b>
                <span>Ñuñoa, La Reina, Providencia, Macul y comunas cercanas</span>
              </div>
              <div>
                <b>Redes sociales</b>
                <span>TikTok e Instagram — recorridos en video de cada propiedad</span>
              </div>
            </div>
            <a
              className="btn accent"
              href={whatsappLink("Hola Ricardo, quiero consultar por una propiedad.")}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: 20 }}
            >
              Escribir por WhatsApp ahora
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
