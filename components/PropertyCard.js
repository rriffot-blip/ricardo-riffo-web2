import Link from "next/link";
import { Ruler, BedDouble, Bath, Car } from "lucide-react";
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
            {property.area && <span><Ruler size={14} strokeWidth={1.75} />{property.area} m²</span>}
            {property.bedrooms > 0 && <span><BedDouble size={14} strokeWidth={1.75} />{property.bedrooms}</span>}
            <span><Bath size={14} strokeWidth={1.75} />{property.bathrooms}</span>
            {property.parking > 0 && <span><Car size={14} strokeWidth={1.75} /></span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
