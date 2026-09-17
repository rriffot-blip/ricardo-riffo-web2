import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
            <form>
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" placeholder="Tu nombre" />

              <label htmlFor="telefono">Teléfono o correo</label>
              <input id="telefono" type="text" placeholder="+56 9 ... o [email protected]" />

              <label htmlFor="interes">¿Qué buscas?</label>
              <select id="interes" defaultValue="">
                <option value="" disabled>Selecciona una opción</option>
                <option>Arrendar una propiedad</option>
                <option>Comprar una propiedad</option>
                <option>Vender o arrendar la mía</option>
                <option>Otra consulta</option>
              </select>

              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" rows={4} placeholder="Cuéntame en qué te puedo ayudar..." />

              <button type="submit" className="btn accent">Enviar mensaje</button>
            </form>
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
            <a className="btn accent" href="#" style={{ marginTop: 20 }}>Escribir por WhatsApp ahora</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
