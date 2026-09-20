"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify, randomSuffix } from "@/lib/slug";
import { compressImage } from "@/lib/imageCompress";

const CATEGORIES = ["Arriendos", "Compras", "Ventas", "Propietarios", "Guías inmobiliarias"];
const STATUSES = ["Borrador", "Publicado"];

const emptyForm = {
  title: "",
  excerpt: "",
  body: "",
  category: "Guías inmobiliarias",
  status: "Borrador",
  meta_title: "",
  meta_description: "",
};

export default function PostForm({ initial = null }) {
  const router = useRouter();
  const isEditing = !!initial;
  const [form, setForm] = useState(() => (initial ? { ...emptyForm, ...initial } : emptyForm));
  const [featuredImage, setFeaturedImage] = useState(initial?.featured_image_url || null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, category: form.category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar el artículo.");
      update("body", data.body);
      if (data.excerpt) update("excerpt", data.excerpt);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const slug = isEditing ? initial.slug : await generateUniqueSlug(form.title);

      let featured_image_url = featuredImage;
      if (newImageFile) {
        const compressed = await compressImage(newImageFile);
        const ext = compressed.name.split(".").pop();
        const path = `blog/${slug}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("property-photos").upload(path, compressed);
        if (uploadError) throw new Error("No se pudo subir la imagen: " + uploadError.message);
        const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
        featured_image_url = data.publicUrl;
      }

      const wasPublished = initial?.status === "Publicado";
      const willBePublished = form.status === "Publicado";

      const { id, created_at, slug: _slug, ...formFields } = form;

      const payload = {
        ...formFields,
        featured_image_url,
        published_at: willBePublished && !wasPublished ? new Date().toISOString() : initial?.published_at || null,
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from("posts").update(payload).eq("slug", slug);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase.from("posts").insert({ ...payload, slug });
        if (insertError) throw new Error(insertError.message);
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar.");
      setSaving(false);
    }
  }

  async function generateUniqueSlug(title) {
    let base = slugify(title) || "articulo";
    let candidate = base;
    for (let i = 0; i < 5; i++) {
      const { data } = await supabase.from("posts").select("slug").eq("slug", candidate).maybeSingle();
      if (!data) return candidate;
      candidate = `${base}-${randomSuffix()}`;
    }
    return `${base}-${randomSuffix()}`;
  }

  async function handleDelete() {
    if (!confirm("¿Seguro que quieres borrar este artículo? No se puede deshacer.")) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from("posts").delete().eq("slug", initial.slug);
    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form className="formcard" onSubmit={handleSubmit}>
      <div className="formgrid">
        <div className="field full">
          <label>Título</label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </div>

        <div className="field">
          <label>Categoría</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Estado</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field full">
          <label>Extracto (aparece en las tarjetas de vista previa)</label>
          <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </div>

        <div className="field full">
          <label>Imagen destacada</label>
          {featuredImage && (
            <div className="photogrid" style={{ gridTemplateColumns: "repeat(2, 120px)" }}>
              <div className="thumb" style={{ backgroundImage: `url(${featuredImage})` }}>
                <button type="button" onClick={() => setFeaturedImage(null)}>✕</button>
              </div>
            </div>
          )}
          <div className="filedrop">
            <input type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="field full">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Contenido — puedes usar **negrita**, [texto](https://link.com) para links, y ![descripción](https://url-de-imagen.jpg) para insertar una imagen</span>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !form.title}
              style={{ fontSize: "0.82rem", color: "var(--accent)", background: "none", border: "1px solid var(--line)", borderRadius: 4, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap", marginLeft: 12 }}
            >
              {generating ? "Generando..." : "✨ Generar con IA"}
            </button>
          </label>
          <textarea rows={14} value={form.body} onChange={(e) => update("body", e.target.value)} required style={{ fontFamily: "monospace", fontSize: "0.9rem" }} />
        </div>

        <details className="full" style={{ marginTop: 4 }}>
          <summary>SEO avanzado (opcional)</summary>
          <div className="field" style={{ marginTop: 16 }}>
            <label>Título SEO (si lo dejas vacío, se usa el título normal)</label>
            <input value={form.meta_title} onChange={(e) => update("meta_title", e.target.value)} />
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Meta descripción</label>
            <textarea rows={2} value={form.meta_description} onChange={(e) => update("meta_description", e.target.value)} />
          </div>
        </details>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="formactions">
        <button type="submit" className="btn accent" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear artículo"}
        </button>
        <a href="/admin/blog" className="btn ghost">Cancelar</a>
        {isEditing && (
          <button type="button" className="btn ghost danger" onClick={handleDelete} disabled={saving} style={{ marginLeft: "auto" }}>
            Borrar artículo
          </button>
        )}
      </div>
    </form>
  );
}
