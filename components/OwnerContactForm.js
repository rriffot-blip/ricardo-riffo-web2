"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

const emptyForm = { nombre: "", contacto: "", servicio: "", tipo: "", comuna: "", mensaje: "" };

export default function OwnerContactForm() {
  const [form, setForm] = useState(emptyForm);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const lines = [
      "Hola Ricardo, tengo una propiedad y quiero conversar contigo.",
      form.nombre && `Nombre: ${form.nombre}`,
      form.contacto && `Contacto: ${form.contacto}`,
      form.servicio && `Quiero: ${form.servicio}`,
      form.tipo && `Tipo de propiedad: ${form.tipo}`,
      form.comuna && `Comuna: ${form.comuna}`,
      form.mensaje && `Mensaje: ${form.mensaje}`,
    ].filter(Boolean);

    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="o-nombre">Nombre</label>
      <input id="o-nombre" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required />

      <label htmlFor="o-contacto">Teléfono o correo</label>
      <input id="o-contacto" value={form.contacto} onChange={(e) => update("contacto", e.target.value)} required />

      <label htmlFor="o-servicio">¿Qué necesitas?</label>
      <select id="o-servicio" value={form.servicio} onChange={(e) => update("servicio", e.target.value)} required>
        <option value="" disabled>Selecciona una opción</option>
        <option>Arrendar mi propiedad</option>
        <option>Vender mi propiedad</option>
        <option>Aún no estoy seguro, quiero conversar</option>
      </select>

      <label htmlFor="o-tipo">Tipo de propiedad</label>
      <select id="o-tipo" value={form.tipo} onChange={(e) => update("tipo", e.target.value)}>
        <option value="">Selecciona una opción</option>
        <option>Departamento</option>
        <option>Casa</option>
        <option>Oficina</option>
        <option>Local</option>
        <option>Terreno</option>
      </select>

      <label htmlFor="o-comuna">Comuna</label>
      <input id="o-comuna" value={form.comuna} onChange={(e) => update("comuna", e.target.value)} />

      <label htmlFor="o-mensaje">Cuéntame más</label>
      <textarea id="o-mensaje" rows={4} value={form.mensaje} onChange={(e) => update("mensaje", e.target.value)} placeholder="Dirección aproximada, plazo, cualquier detalle que ayude..." />

      <button type="submit" className="btn accent">Enviar por WhatsApp</button>
    </form>
  );
}
