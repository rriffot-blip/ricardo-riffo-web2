"use client";

import { useMemo, useState } from "react";
import PropertyCard from "@/components/PropertyCard";

export default function ListingClient({ properties }) {
  const [commune, setCommune] = useState("");
  const [type, setType] = useState("");
  const [operation, setOperation] = useState("");

  const communes = useMemo(() => [...new Set(properties.map((p) => p.commune))].sort(), [properties]);
  const types = useMemo(() => [...new Set(properties.map((p) => p.type))].sort(), [properties]);

  const filtered = properties.filter((p) => {
    if (commune && p.commune !== commune) return false;
    if (type && p.type !== type) return false;
    if (operation && p.operation !== operation) return false;
    return true;
  });

  const hasFilters = commune || type || operation;

  return (
    <>
      <div className="filters">
        <select value={commune} onChange={(e) => setCommune(e.target.value)}>
          <option value="">Todas las comunas</option>
          {communes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Todos los tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="">Arriendo o venta</option>
          <option value="Arriendo">Arriendo</option>
          <option value="Venta">Venta</option>
        </select>
        {hasFilters && (
          <button className="clear" onClick={() => { setCommune(""); setType(""); setOperation(""); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="resultcount">
        {filtered.length} propiedad{filtered.length !== 1 ? "es" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="listgrid">
          {filtered.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>No hay propiedades que calcen con esos filtros. Prueba quitando alguno.</p>
        </div>
      )}
    </>
  );
}
