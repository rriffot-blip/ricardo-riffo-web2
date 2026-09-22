"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify, randomSuffix } from "@/lib/slug";
import { compressImage } from "@/lib/imageCompress";
import { TYPES, STATUS_BY_OPERATION, ORIENTATIONS, FEATURES, COMMISSION_TYPES, DEPOSIT_TYPES, INSTALLMENTS, PROMOTION_TYPES } from "@/lib/propertyOptions";

const emptyForm = {
  title: "",
  type: "Departamento",
  operation: "Arriendo",
  commune: "",
  address: "",
  show_exact_address: true,

  price_amount: "",
  price_currency: "CLP",
  price_note: "",
  common_expenses: "",
  common_expenses_note: "",

  bedrooms: 0,
  bathrooms: 1,
  area: "",
  total_area: "",
  parking: 0,
  storage_count: 0,
  floor: "",
  floor_total: "",
  orientation: "",

  features: [],

  commission_type: "",
  commission_installments: "",
  deposit_type: "",
  deposit_installments: "",

  has_promotion: false,
  promotion_type: "",
  promotion_text: "",

  status: "Disponible",
  featured: false,
  is_new: false,

  video_url: "",
  description: "",
  internal_notes: "",
};

export default function PropertyForm({ initial = null }) {
  const router = useRouter();
  const isEditing = !!initial;
  const [form, setForm] = useState(() => (initial ? { ...emptyForm, ...initial } : emptyForm));
  const [existingPhotos, setExistingPhotos] = useState(initial?.photo_urls || []);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleFeature(feature) {
    setForm((f) => ({
      ...f,
      features: f.features.includes(feature) ? f.features.filter((x) => x !== feature) : [...f.features, feature],
    }));
  }

  function handleFileChange(e) {
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    e.target.value = "";
  }

  function removeExistingPhoto(url) {
    setExistingPhotos((photos) => photos.filter((p) => p !== url));
  }

  function removeNewFile(index) {
    setNewFiles((files) => files.filter((_, i) => i !== index));
  }

  function movePhoto(list, setList, index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;
    const copy = [...list];
    [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
    setList(copy);
  }

  async function uploadNewPhotos(slug) {
    const urls = [];
    for (const file of newFiles) {
      const compressed = await compressImage(file);
      const ext = compressed.name.split(".").pop();
      const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("property-photos").upload(path, compressed);
      if (uploadError) throw new Error("No se pudo subir una foto: " + uploadError.message);
      const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
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

  async function handleGenerateTitle() {
    setGeneratingTitle(true);
    setError("");
    try {
      const res = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar el título.");
      update("title", data.title);
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingTitle(false);
    }
  }

  async function handleGenerateDescription() {
    setGeneratingDesc(true);
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
      setGeneratingDesc(false);
    }
  }

  async function saveProperty(asDraft) {
    setError("");
    setSaving(true);

    try {
      const slug = isEditing ? initial.slug : await generateUniqueSlug(form.title || form.commune || "propiedad");
      const uploadedUrls = await uploadNewPhotos(slug);
      const photo_urls = [...existingPhotos, ...uploadedUrls];

      const { id, created_at, slug: _slug, storage, ...formFields } = form;

      const payload = {
        ...formFields,
        status: asDraft ? "Borrador" : form.status,
        price_amount: Number(form.price_amount) || 0,
        common_expenses: form.common_expenses ? Number(form.common_expenses) : null,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: form.area ? Number(form.area) : null,
        total_area: form.total_area ? Number(form.total_area) : null,
        parking: Number(form.parking) || 0,
        storage_count: Number(form.storage_count) || 0,
        floor: form.floor ? Number(form.floor) : null,
        floor_total: form.floor_total ? Number(form.floor_total) : null,
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

  const statusOptions = STATUS_BY_OPERATION[form.operation] || STATUS_BY_OPERATION.Arriendo;

  return (
    <form className="formcard" onSubmit={(e) => e.preventDefault()}>
      {/* 1. Información principal */}
      <div className="formgrid">
        <div className="field full">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Título</span>
            <button type="button" onClick={handleGenerateTitle} disabled={generatingTitle || !form.commune}
              style={{ fontSize: "0.82rem", color: "var(--accent)", background: "none", border: "1px solid var(--line)", borderRadius: 4, padding: "5px 10px", cursor: "pointer" }}>
              {generatingTitle ? "Generando..." : "✨ Generar título con IA"}
            </button>
          </label>
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
          <label>Comuna</label>
          <input value={form.commune} onChange={(e) => update("commune", e.target.value)} required />
        </div>

        <div className="field">
          <label>Dirección (opcional)</label>
          <input value={form.address} onChange={(e) => update("address", e.target.value)} />
        </div>

        <div className="checkfield full">
          <input type="checkbox" id="show_exact_address" checked={form.show_exact_address} onChange={(e) => update("show_exact_address", e.target.checked)} />
          <label htmlFor="show_exact_address" style={{ margin: 0 }}>Mostrar la dirección exacta en el sitio (si no, solo se muestra la comuna)</label>
        </div>
      </div>

      {/* 2. Precio */}
      <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Precio</h3>
      <div className="formgrid">
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
        <div className="field">
          <label>Gastos comunes (opcional)</label>
          <input type="number" value={form.common_expenses} onChange={(e) => update("common_expenses", e.target.value)} />
        </div>
        <div className="field">
          <label>Nota de gastos comunes (opcional)</label>
          <input value={form.common_expenses_note} onChange={(e) => update("common_expenses_note", e.target.value)} placeholder="Ej: aproximados, incluye agua" />
        </div>
        <div className="field full">
          <label>Nota del precio (opcional)</label>
          <input value={form.price_note} onChange={(e) => update("price_note", e.target.value)} placeholder="Ej: precio final, conversable" />
        </div>
      </div>

      {/* 3. Características de la propiedad */}
      <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Características de la propiedad</h3>
      <div className="formgrid">
        <div className="field">
          <label>Dormitorios</label>
          <input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
        </div>
        <div className="field">
          <label>Baños</label>
          <input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
        </div>
        <div className="field">
          <label>Superficie útil (m²)</label>
          <input type="number" min="0" value={form.area} onChange={(e) => update("area", e.target.value)} />
        </div>
        <div className="field">
          <label>Superficie total (m²)</label>
          <input type="number" min="0" value={form.total_area} onChange={(e) => update("total_area", e.target.value)} />
        </div>
        <div className="field">
          <label>Estacionamientos</label>
          <input type="number" min="0" value={form.parking} onChange={(e) => update("parking", e.target.value)} />
        </div>
        <div className="field">
          <label>Bodegas</label>
          <input type="number" min="0" value={form.storage_count} onChange={(e) => update("storage_count", e.target.value)} />
        </div>
        <div className="field">
          <label>Piso (opcional)</label>
          <input type="number" value={form.floor} onChange={(e) => update("floor", e.target.value)} />
        </div>
        <div className="field">
          <label>Total de pisos (opcional)</label>
          <input type="number" value={form.floor_total} onChange={(e) => update("floor_total", e.target.value)} />
        </div>
        <div className="field">
          <label>Orientación (opcional)</label>
          <select value={form.orientation} onChange={(e) => update("orientation", e.target.value)}>
            <option value="">Sin especificar</option>
            {ORIENTATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* 4. Características adicionales */}
      <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Características adicionales</h3>
      <div className="formgrid">
        <div className="field full" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px" }}>
          {FEATURES.map((feature) => (
            <label key={feature} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
              <input type="checkbox" checked={form.features.includes(feature)} onChange={() => toggleFeature(feature)} style={{ width: "auto" }} />
              {feature}
            </label>
          ))}
        </div>
      </div>

      {/* 5. Condiciones de arriendo — solo si operation === Arriendo */}
      {form.operation === "Arriendo" && (
        <>
          <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Condiciones de arriendo</h3>
          <div className="formgrid">
            <div className="field">
              <label>Comisión de corretaje</label>
              <select value={form.commission_type} onChange={(e) => update("commission_type", e.target.value)}>
                <option value="">Sin especificar</option>
                {COMMISSION_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Pago de comisión</label>
              <select value={form.commission_installments} onChange={(e) => update("commission_installments", e.target.value)}>
                <option value="">Sin especificar</option>
                {INSTALLMENTS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Garantía</label>
              <select value={form.deposit_type} onChange={(e) => update("deposit_type", e.target.value)}>
                <option value="">Sin especificar</option>
                {DEPOSIT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Pago de garantía</label>
              <select value={form.deposit_installments} onChange={(e) => update("deposit_installments", e.target.value)}>
                <option value="">Sin especificar</option>
                {INSTALLMENTS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </>
      )}

      {/* 6. Promoción */}
      <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Promoción</h3>
      <div className="formgrid">
        <div className="checkfield full" style={{ marginTop: 0 }}>
          <input type="checkbox" id="has_promotion" checked={form.has_promotion} onChange={(e) => update("has_promotion", e.target.checked)} />
          <label htmlFor="has_promotion" style={{ margin: 0 }}>¿Tiene promoción?</label>
        </div>
        {form.has_promotion && (
          <>
            <div className="field">
              <label>Tipo de promoción</label>
              <select value={form.promotion_type} onChange={(e) => update("promotion_type", e.target.value)}>
                <option value="">Sin especificar</option>
                {PROMOTION_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Texto de promoción (opcional)</label>
              <input value={form.promotion_text} onChange={(e) => update("promotion_text", e.target.value)} placeholder="Personaliza el texto si quieres" />
            </div>
          </>
        )}
      </div>

      {/* 7. Publicación / estado */}
      <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Publicación</h3>
      <div className="formgrid">
        <div className="field">
          <label>Estado</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="checkfield">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
          <label htmlFor="featured" style={{ margin: 0 }}>Destacada</label>
        </div>
        <div className="checkfield">
          <input type="checkbox" id="is_new" checked={form.is_new} onChange={(e) => update("is_new", e.target.checked)} />
          <label htmlFor="is_new" style={{ margin: 0 }}>Nueva</label>
        </div>
      </div>

      {/* 8. Video */}
      <div className="formgrid" style={{ marginTop: 20 }}>
        <div className="field full">
          <label>Link del video (TikTok, opcional)</label>
          <input value={form.video_url} onChange={(e) => update("video_url", e.target.value)} placeholder="https://tiktok.com/..." />
        </div>
      </div>

      {/* 9. Descripción */}
      <div className="formgrid">
        <div className="field full">
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Descripción</span>
            <button type="button" onClick={handleGenerateDescription} disabled={generatingDesc || !form.title || !form.commune}
              style={{ fontSize: "0.82rem", color: "var(--accent)", background: "none", border: "1px solid var(--line)", borderRadius: 4, padding: "5px 10px", cursor: "pointer" }}>
              {generatingDesc ? "Generando..." : "✨ Generar con IA"}
            </button>
          </label>
          <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
      </div>

      {/* 10. Fotografías */}
      <h3 style={{ fontSize: "1rem", margin: "28px 0 12px" }}>Fotografías</h3>
      <div className="formgrid">
        <div className="field full">
          {(existingPhotos.length > 0 || newFiles.length > 0) && (
            <div className="photogrid">
              {existingPhotos.map((url, i) => (
                <div key={url} className="thumb" style={{ backgroundImage: `url(${url})` }}>
                  {i === 0 && <span style={{ position: "absolute", bottom: 4, left: 4, fontSize: "0.65rem", background: "var(--accent)", color: "#fff", padding: "2px 6px", borderRadius: 3 }}>Portada</span>}
                  <button type="button" onClick={() => removeExistingPhoto(url)} title="Quitar foto" style={{ top: 4, right: 4 }}>✕</button>
                  {i > 0 && (
                    <button type="button" onClick={() => movePhoto(existingPhotos, setExistingPhotos, i, -1)} title="Mover antes" style={{ top: 4, left: 4, right: "auto" }}>←</button>
                  )}
                </div>
              ))}
              {newFiles.map((file, i) => (
                <div key={file.name + i} className="thumb" style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}>
                  <span style={{ position: "absolute", bottom: 4, left: 4, fontSize: "0.65rem", background: "var(--ink-soft)", color: "#fff", padding: "2px 6px", borderRadius: 3 }}>Nueva</span>
                  <button type="button" onClick={() => removeNewFile(i)} title="Quitar foto" style={{ top: 4, right: 4 }}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="filedrop">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <p style={{ margin: "8px 0 0" }}>
              Puedes seleccionar varias veces para ir agregando fotos. La primera foto de la lista se usa como portada
              — usa la flecha ← para reordenar las que ya tienes cargadas. Las fotos se comprimen automáticamente al guardar.
            </p>
          </div>
        </div>
      </div>

      {/* Notas internas */}
      <div className="formgrid">
        <div className="field full">
          <label>Notas internas (opcional — nunca se muestran en el sitio público)</label>
          <textarea rows={2} value={form.internal_notes} onChange={(e) => update("internal_notes", e.target.value)} placeholder="Ej: contacto del propietario, disponibilidad, observaciones..." />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {/* 11. Acciones */}
      <div className="formactions">
        <button type="button" className="btn accent" onClick={() => saveProperty(false)} disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar propiedad"}
        </button>
        <button type="button" className="btn ghost" onClick={() => saveProperty(true)} disabled={saving}>
          Guardar borrador
        </button>
        {isEditing && (
          <a href={`/admin/vista-previa/${initial.slug}`} target="_blank" rel="noopener noreferrer" className="btn ghost">
            Vista previa
          </a>
        )}
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
