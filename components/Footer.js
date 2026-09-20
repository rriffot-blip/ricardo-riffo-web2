import { whatsappLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap footgrid">
        <div>
          <span className="word">
            Ricardo Riffo <span style={{ color: "var(--accent)" }}>Propiedades</span>
          </span>
          <p>Arriendo y venta de propiedades en Santiago, visitadas y grabadas personalmente.</p>
        </div>
        <div>
          <h4>Sitio</h4>
          <ul>
            <li><a href="/propiedades">Propiedades</a></li>
            <li><a href="/sobre-mi">Sobre mí</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul>
            <li><a href={whatsappLink("Hola Ricardo, quiero consultar por una propiedad.")} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="#">[email protected]</a></li>
          </ul>
        </div>
        <div>
          <h4>Redes</h4>
          <ul>
            <li><a href="https://www.tiktok.com/@ricardoriffot" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap footbottom">
        <span>© 2026 Ricardo Riffo Propiedades</span>
        <span>ricardoriffo.cl</span>
      </div>
    </footer>
  );
}
