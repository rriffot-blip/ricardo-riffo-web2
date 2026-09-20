import Link from "next/link";
import { formatPrice, placeholderTheme } from "@/lib/format";

export default function PropertyCard({ property, className = "" }) {
  const photo = property.photo_urls?.[0];

  return (
    <div className={`card ${className}`}>
      <Link href={`/propiedades/${property.slug}`} className="cardlink">
        <div className={`img ${photo ? "" : placeholderTheme(property)}`}>
          {photo && (
            <img
              src={photo}
              alt={`${property.title} — ${property.type} en ${property.operation.toLowerCase()} en ${property.commune}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
          <span className="status">{property.status}</span>
        </div>
        <div className="body">
          <p className="price">
            {formatPrice(property)}
            {property.operation === "Arriendo" ? " / mes" : ""}
          </p>
          <p className="loc">
            {property.title.length > 40 ? `${property.type} — ${property.commune}` : property.title}
          </p>
          <div className="meta">
            {property.area && <span>{property.area} m²</span>}
            {property.bedrooms > 0 && <span>{property.bedrooms} dorm.</span>}
            <span>{property.bathrooms} baño{property.bathrooms !== 1 ? "s" : ""}</span>
            {property.parking > 0 && <span>Estac.</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
