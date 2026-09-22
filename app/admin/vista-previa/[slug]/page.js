"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import PhotoGallery from "@/components/PhotoGallery";
import ContactCard from "@/components/ContactCard";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/format";

function PreviewContent() {
  const { slug } = useParams();
  const [property, setProperty] = useState(undefined);

  useEffect(() => {
    supabase.from("properties").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      setProperty(data || null);
    });
  }, [slug]);

  if (property === undefined) return <div className="adminwrap"><p>Cargando...</p></div>;
  if (property === null) return <div className="adminwrap"><p>No se encontró esa propiedad.</p></div>;

  const photos = property.photo_urls?.length ? property.photo_urls : [];
  const addressLine = property.show_exact_address && property.address ? property.address : property.commune;

  return (
    <>
      <div style={{ background: "var(--accent)", color: "#fff", textAlign: "center", padding: "10px", fontSize: "0.9rem" }}>
        Vista previa — así se vería esta propiedad publicada. Estado actual: <b>{property.status}</b>
        {" · "}<Link href="/admin" style={{ color: "#fff", textDecoration: "underline" }}>Volver al panel</Link>
      </div>
      <main className="wrap">
        <div className="crumb">
          <span>Propiedades</span> / {property.commune} / {property.title}
        </div>

        <div className="titlebar">
          <div>
            <span className="status">{property.status}</span>
            <h1>{property.title}</h1>
            <div className="loc">{addressLine}</div>
          </div>
          <div className="pricebox">
            <div className="price">{formatPrice(property)}</div>
            <div className="sub">{property.price_note}</div>
          </div>
        </div>

        <PhotoGallery photos={photos} title={property.title} />

        <div className="layout">
          <div>
            <div className="specs">
              <div><b>{property.area ?? "—"} m²</b><span>Superficie</span></div>
              <div><b>{property.bedrooms}</b><span>Dormitorios</span></div>
              <div><b>{property.bathrooms}</b><span>Baños</span></div>
              <div><b>{property.parking}</b><span>Estacionamiento</span></div>
            </div>

            {property.has_promotion && (
              <p style={{ color: "var(--accent)", fontWeight: 500, marginTop: -16, marginBottom: 24 }}>
                🏷️ {property.promotion_text || property.promotion_type}
              </p>
            )}

            {property.description && (
              <div className="block">
                <h2>Descripción</h2>
                <p>{property.description}</p>
              </div>
            )}

            {property.features?.length > 0 && (
              <div className="block">
                <h2>Características</h2>
                <div className="amenities">
                  {property.features.map((f) => <div key={f}>{f}</div>)}
                </div>
              </div>
            )}

            {property.operation === "Arriendo" && (property.commission_type || property.deposit_type) && (
              <div className="block">
                <h2>Condiciones de arriendo</h2>
                <p>
                  {property.commission_type && <>Comisión: {property.commission_type}{property.commission_installments ? ` (${property.commission_installments})` : ""}<br /></>}
                  {property.deposit_type && <>Garantía: {property.deposit_type}{property.deposit_installments ? ` (${property.deposit_installments})` : ""}</>}
                </p>
              </div>
            )}
          </div>

          <div className="sidebar">
            <ContactCard property={property} />
          </div>
        </div>

        {property.internal_notes && (
          <div className="block" style={{ border: "1px dashed var(--accent)", padding: 16, borderRadius: 8 }}>
            <h2 style={{ fontSize: "1rem" }}>Notas internas (solo tú ves esto)</h2>
            <p>{property.internal_notes}</p>
          </div>
        )}
      </main>
    </>
  );
}

export default function VistaPreviaPage() {
  return (
    <AdminGuard>
      <PreviewContent />
    </AdminGuard>
  );
}
