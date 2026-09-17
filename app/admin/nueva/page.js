"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import PropertyForm from "@/components/admin/PropertyForm";

export default function NuevaPropiedadPage() {
  return (
    <AdminGuard>
      <div className="adminwrap wide">
        <div className="adminbar">
          <h1>Agregar propiedad</h1>
        </div>
        <PropertyForm />
      </div>
    </AdminGuard>
  );
}
