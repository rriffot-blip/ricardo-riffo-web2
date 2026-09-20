"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PostsDashboard() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    supabase.from("posts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setPosts(data || []);
    });
  }, []);

  return (
    <div className="adminwrap wide">
      <div className="adminbar">
        <h1>Blog</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/admin/blog/nueva" className="btn accent">+ Nuevo artículo</a>
          <a href="/admin" className="btn ghost">← Propiedades</a>
        </div>
      </div>

      {posts === null && <p>Cargando...</p>}

      {posts?.length === 0 && (
        <div className="empty">
          <p>Todavía no has escrito ningún artículo.</p>
        </div>
      )}

      {posts?.map((p) => (
        <div key={p.slug} className="adminrow">
          <div
            className="thumb"
            style={{ background: p.featured_image_url ? `url(${p.featured_image_url}) center/cover` : "linear-gradient(135deg,#4C6B60,#17302E)" }}
          />
          <div className="info">
            <b>{p.title}</b>
            <span>{p.category} · {p.status}</span>
          </div>
          <div className="actions">
            {p.status === "Publicado" && (
              <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">Ver</a>
            )}
            <a href={`/admin/blog/editar/${p.slug}`}>Editar</a>
          </div>
        </div>
      ))}
    </div>
  );
}
