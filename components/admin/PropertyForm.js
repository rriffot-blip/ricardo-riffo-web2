"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify, randomSuffix } from "@/lib/slug";

const TYPES = ["Departamento", "Casa", "Oficina", "Local", "Terreno"];
const STATUSES = ["Disponible", "Reservado", "Arrendado", "Vendido"];

const emptyForm = {
  title: "",
  type: "Departamento",
  operation: "Arriendo",
  price_amount: "",
  price_currency: "CLP",
  price_note: "",
  commune: "",
  address: "",
  bedrooms: 0,
  bathrooms: 1,
  area: "",
  parking: 0,
  storage: false,
  status: "Disponible",
  description: "",
  video_url: "",
};

export default function PropertyForm({ initial = null }) {
  const router = useRouter();
  const isEditing = !!initial;
  const [form, setForm] = useState(() => (initial ? { ...emptyForm, ...initial } : emptyForm));
  const [existingPhotos, setExistingPhotos] = useState(initial?.photo_urls || []);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerateDescription() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar la descripción.");
      update("description", data.description);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFileChange(e) {
    setNewFiles(Array.from(e.target.files || []));
  }

  function removeExistingPhoto(url) {
    setExistingPhotos((photos) => photos.filter((p) => p !== url));
  }

  async function uploadNewPhotos(slug) {
    const urls = [];
    for (const file of newFiles) {
      const ext = file.name.split(".").pop();
      const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("property-photos").upload(path, file);
      if (uploadError) {
        throw new Error("No se pudo subir una foto: " + uploadError.message);
      }
      const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const slug = isEditing ? initial.slug : await generateUniqueSlug(form.title);
      const uploadedUrls = await uploadNewPhotos(slug);
      const photo_urls = [...existingPhotos, ...uploadedUrls];

      const payload = {
        ...form,
        price_amount: Number(form.price_amount) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: form.area ? Number(form.area) : null,
        parking: Number(form.parking) || 0,
        photo_urls,
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from("properties").update(payload).eq("slug", slug);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase.from("properties").insert({ ...payload, slug });
        if (insertError) throw new Error(insertError.message);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar.");
      setSaving(false);
    }
  }

  async function generateUniqueSlug(title) {
    let base = slugify(title) || "propiedad";
    let candidate = base;
    for (let i = 0; i < 5; i++) {
      const { data } = await supabase.from("properties").select("slug").eq("slug", candidate).maybeSingle();
      if (!data) return candidate;
      candidate = `${base}-${randomSuffix()}`;
    }
    return `${base}-${randomSuffix()}`;
  }

  async function handleDelete() {
    if (!confirm("¿Seguro que quieres borrar esta propiedad? No se puede deshacer.")) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from("properties").delete().eq("slug", initial.slug);
    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }
    router.push("/admin");
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
          <label>Tipo</label>
          <select value={form.type} onChange={(e) => update("type", e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Operación</label>
          <select value={form.operation} onChange={(e) => update("operation", e.target.value)}>
            <option>Arriendo</option>
            <option>Venta</option>
          </select>
        </div>

        <div className="field">
          <label>Precio</label>
          <input type="number" value={form.price_amount} onChange={(e) => update("price_amount", e.target.value)} required />
        </div>

        <div className="field">
          <label>Moneda</label>
          <select value={form.price_currency} onChange={(e) => update("price_currency", e.target.value)}>
            <option>CLP</option>
            <option>UF</option>
          </select>
        </div>

        <div className="field full">
          <label>Nota del precio (opcional)</label>
          <input value={form.price_note} onChange={(e) => update("price_note", e.target.value)} placeholder="Ej: gastos comunes aparte" />
        </div>

        <div className="field">
          <label>Comuna</label>
          <input value={form.commune} onChange={(e) => update("commune", e.target.value)} required />
        </div>

        <div className="field">
          <label>Dirección (opcional)</label>
          <input value={form.address} onChange={(e) => update("address", e.target.value)} />
        </div>

        <div className="field">
          <label>Dormitorios</label>
          <input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
        </div>

        <div className="field">
          <label>Baños</label>
          <input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
        </div>

        <div className="field">
          <label>Superficie (m²)</label>
          <input type="number" min="0" value={form.area} onChange={(e) => update("area", e.target.value)} />
        </div>

        <div className="field">
          <label>Estacionamientos</label>
          <input type="number" min="0" value={form.parking} onChange={(e) => update("parking", e.target.value)} />
        </div>

        <div className="checkfield full">
          <input type="checkbox" id="storage" checked={form.storage} onChange={(e) => update("storage", e.target.checked)} />
          <label htmlFor="storage" style={{ margin: 0 }}>Tiene bodega</label>
        </div>

        <div className="field">
          <label>Estado</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Link del video (TikTok, opcional)</label>
          <input value={form.video_url} onChange={(e) => update("video_url", e.target.value)} placeholder="https://tiktok.com/..." />
        </div>

        <div className="field full">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Descripción</span>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generating || !form.title || !form.commune}
              style={{ fontSize: "0.82rem", color: "var(--accent)", background: "none", border: "1px solid var(--line)", borderRadius: 4, padding: "5px 10px", cursor: "pointer" }}
            >
              {generating ? "Generando..." : "✨ Generar con IA"}
            </button>
          </label>
          <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="field full">
          <label>Fotos</label>

          {existingPhotos.length > 0 && (
            <div className="photogrid">
              {existingPhotos.map((url) => (
                <div key={url} className="thumb" style={{ backgroundImage: `url(${url})` }}>
                  <button type="button" onClick={() => removeExistingPhoto(url)} title="Quitar foto">✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="filedrop">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <p style={{ margin: "8px 0 0" }}>
              {newFiles.length > 0 ? `${newFiles.length} foto(s) nueva(s) lista(s) para subir` : "Selecciona una o varias fotos desde tu celular o computador"}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="formactions">
        <button type="submit" className="btn accent" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar propiedad"}
        </button>
        <a href="/admin" className="btn ghost">Cancelar</a>
        {isEditing && (
          <button type="button" className="btn ghost danger" onClick={handleDelete} disabled={saving} style={{ marginLeft: "auto" }}>
            Borrar propiedad
          </button>
        )}
      </div>
    </form>
  );
}
