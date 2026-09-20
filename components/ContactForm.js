"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

const emptyForm = { nombre: "", contacto: "", interes: "", mensaje: "" };

export default function ContactForm() {
  const [form, setForm] = useState(emptyForm);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const lines = [
      "Hola Ricardo, te escribo desde el sitio.",
      form.nombre && `Nombre: ${form.nombre}`,
      form.contacto && `Contacto: ${form.contacto}`,
      form.interes && `Interés: ${form.interes}`,
      form.mensaje && `Mensaje: ${form.mensaje}`,
    ].filter(Boolean);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" type="text" placeholder="Tu nombre" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required />

      <label htmlFor="telefono">Teléfono o correo</label>
      <input
        id="telefono"
        type="text"
        placeholder="+56 9 ... o [email protected]"
        value={form.contacto}
        onChange={(e) => update("contacto", e.target.value)}
        required
      />

      <label htmlFor="interes">¿Qué buscas?</label>
      <select id="interes" value={form.interes} onChange={(e) => update("interes", e.target.value)} required>
        <option value="" disabled>Selecciona una opción</option>
        <option>Arrendar una propiedad</option>
        <option>Comprar una propiedad</option>
        <option>Vender o arrendar la mía</option>
        <option>Otra consulta</option>
      </select>

      <label htmlFor="mensaje">Mensaje</label>
      <textarea
        id="mensaje"
        rows={4}
        placeholder="Cuéntame en qué te puedo ayudar..."
        value={form.mensaje}
        onChange={(e) => update("mensaje", e.target.value)}
      />

      <button type="submit" className="btn accent">Enviar por WhatsApp</button>
    </form>
  );
}
