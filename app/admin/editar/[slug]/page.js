"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import PropertyForm from "@/components/admin/PropertyForm";
import { supabase } from "@/lib/supabaseClient";

export default function EditarPropiedadPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState(undefined);

  useEffect(() => {
    supabase.from("properties").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      setProperty(data || null);
    });
  }, [slug]);

  return (
    <AdminGuard>
      <div className="adminwrap wide">
        <div className="adminbar">
          <h1>Editar propiedad</h1>
        </div>
        {property === undefined && <p>Cargando...</p>}
        {property === null && <p>No se encontró esa propiedad.</p>}
        {property && <PropertyForm initial={property} />}
      </div>
    </AdminGuard>
  );
}
