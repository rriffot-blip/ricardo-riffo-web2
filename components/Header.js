import Link from "next/link";

export default function Header() {
  return (
    <header className="site">
      <div className="headerbar">
        <Link href="/" className="word">
          Ricardo Riffo <span>Propiedades</span>
        </Link>
        <nav className="mainnav">
          <Link href="/#propiedades">Propiedades</Link>
          <Link href="/#nosotros">Sobre mí</Link>
          <Link href="/#consejos">Consejos</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <a className="btn accent" href="#contacto">
          Hablemos por WhatsApp
        </a>
      </div>
    </header>
  );
}
