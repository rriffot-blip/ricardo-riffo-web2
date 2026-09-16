import Link from "next/link";

export default function PropertyCard({ property, className = "" }) {
  return (
    <div className={`card ${className}`}>
      <Link href={`/propiedades/${property.slug}`} className="cardlink">
        <div className={`img ${property.photoTheme}`}>
          <span className="status">{property.status}</span>
        </div>
        <div className="body">
          <p className="price">
            {property.price}
            {property.operation === "Arriendo" ? " / mes" : ""}
          </p>
          <p className="loc">
            {property.title.length > 40 ? `${property.type} — ${property.commune}` : property.title}
          </p>
          <div className="meta">
            <span>{property.area} m²</span>
            {property.bedrooms > 0 && <span>{property.bedrooms} dorm.</span>}
            <span>{property.bathrooms} baño{property.bathrooms !== 1 ? "s" : ""}</span>
            {property.parking > 0 && <span>Estac.</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
