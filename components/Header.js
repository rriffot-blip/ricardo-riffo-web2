"use client";

import Link from "next/link";
import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site">
      <div className="headerbar">
        <Link href="/" className="word" onClick={() => setOpen(false)}>
          Ricardo Riffo <span>Propiedades</span>
        </Link>

        <nav className={`mainnav ${open ? "open" : ""}`}>
          <Link href="/propiedades" onClick={() => setOpen(false)}>Propiedades</Link>
          <Link href="/sobre-mi" onClick={() => setOpen(false)}>Sobre mí</Link>
          <Link href="/#consejos" onClick={() => setOpen(false)}>Consejos</Link>
          <Link href="/contacto" onClick={() => setOpen(false)}>Contacto</Link>
        </nav>

        <a
          className="btn accent"
          href={whatsappLink("Hola Ricardo, quiero consultar por una propiedad.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hablemos por WhatsApp
        </a>

        <button className="navtoggle" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
