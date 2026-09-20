"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

export default function ContactCard({ property }) {
  const defaultMessage = `Hola Ricardo, me interesa la propiedad "${property.title}" (${property.commune}). ¿Podrías darme más información?`;
  const [message, setMessage] = useState(defaultMessage);

  const visitMessage = `Hola Ricardo, quiero agendar una visita para "${property.title}" (${property.commune}).`;

  return (
    <div className="contactcard">
      <div className="broker">
        <div className="avatar" />
        <div><b>{property.broker_name || "Ricardo Riffo"}</b><span>Corredor a cargo</span></div>
      </div>
      <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      <a className="btn accent" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
        Enviar por WhatsApp
      </a>
      <a className="btn ghost" href={whatsappLink(visitMessage)} target="_blank" rel="noopener noreferrer">
        Agendar visita
      </a>
    </div>
  );
}
