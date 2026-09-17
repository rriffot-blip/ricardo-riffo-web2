"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const [properties, setProperties] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    setProperties(data || []);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="adminwrap wide">
      <div className="adminbar">
        <h1>Tus propiedades</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/admin/nueva" className="btn accent">+ Agregar propiedad</a>
          <button onClick={handleLogout} className="btn ghost">Cerrar sesión</button>
        </div>
      </div>

      {properties === null && <p>Cargando...</p>}

      {properties?.length === 0 && (
        <div className="empty">
          <p>Todavía no has agregado ninguna propiedad. Haz clic en "+ Agregar propiedad" para empezar.</p>
        </div>
      )}

      {properties?.map((p) => (
        <div key={p.slug} className="adminrow">
          <div
            className="thumb"
            style={{ background: p.photo_urls?.[0] ? `url(${p.photo_urls[0]}) center/cover` : "linear-gradient(135deg,#4C6B60,#17302E)" }}
          />
          <div className="info">
            <b>{p.title}</b>
            <span>{formatPrice(p)} · {p.commune} · {p.status}</span>
          </div>
          <div className="actions">
            <a href={`/propiedades/${p.slug}`} target="_blank" rel="noopener noreferrer">Ver</a>
            <a href={`/admin/editar/${p.slug}`}>Editar</a>
          </div>
        </div>
      ))}
    </div>
  );
}
