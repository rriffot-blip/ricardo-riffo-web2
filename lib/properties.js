// Datos de prueba. En la Fase 5 esto se reemplaza por consultas reales a Supabase,
// pero el resto del sitio (páginas, componentes) no debería tener que cambiar
// porque ya consume esta misma forma de datos.

export const properties = [
  {
    slug: "depto-2d1b-nunoa",
    title: "Departamento 2D/1B a pasos del metro Ñuñoa",
    type: "Departamento",
    operation: "Arriendo",
    price: "$520.000",
    priceSub: "por mes, gastos comunes aparte",
    commune: "Ñuñoa",
    address: "Av. Irarrázaval 3200, Ñuñoa, Santiago",
    bedrooms: 2,
    bathrooms: 1,
    area: 52,
    parking: 1,
    storage: false,
    status: "Disponible",
    description:
      "Departamento luminoso en segundo piso, orientación oriente, a 4 cuadras del metro Ñuñoa. Living-comedor separado de la cocina, ambos dormitorios con clóset empotrado. Edificio con conserjería 24 horas y sala multiuso.",
    amenities: ["Estacionamiento subterráneo", "Conserjería 24 horas", "Sala multiuso", "Clósets empotrados", "Cocina con encimera"],
    photoTheme: "grad1",
    broker: "Ricardo Riffo",
  },
  {
    slug: "casa-3d2b-lareina",
    title: "Casa 3D/2B con patio en La Reina",
    type: "Casa",
    operation: "Venta",
    price: "UF 4.200",
    priceSub: "precio final",
    commune: "La Reina",
    address: "Príncipe de Gales 1500, La Reina, Santiago",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    parking: 2,
    storage: true,
    status: "Disponible",
    description:
      "Casa de un piso con patio amplio, ideal para familia. Cocina remodelada, living con salida directa al patio. Sector residencial tranquilo, cerca de colegios y áreas verdes.",
    amenities: ["Patio privado", "Bodega", "Cocina remodelada", "2 estacionamientos", "Calefacción central"],
    photoTheme: "grad2",
    broker: "Ricardo Riffo",
  },
  {
    slug: "studio-providencia",
    title: "Studio amoblado en Providencia",
    type: "Departamento",
    operation: "Arriendo",
    price: "$380.000",
    priceSub: "por mes, gastos comunes incluidos",
    commune: "Providencia",
    address: "Manuel Montt 800, Providencia, Santiago",
    bedrooms: 1,
    bathrooms: 1,
    area: 28,
    parking: 0,
    storage: false,
    status: "Reservado",
    description:
      "Studio compacto y funcional, ideal para una persona. A pasos del metro Manuel Montt y de restaurantes y cafés del sector.",
    amenities: ["Amoblado", "Gastos comunes incluidos", "Cerca del metro"],
    photoTheme: "grad3",
    broker: "Ricardo Riffo",
  },
  {
    slug: "depto-3d2b-macul",
    title: "Departamento 3D/2B en Macul",
    type: "Departamento",
    operation: "Arriendo",
    price: "$610.000",
    priceSub: "por mes, gastos comunes aparte",
    commune: "Macul",
    address: "Av. Quilín 1200, Macul, Santiago",
    bedrooms: 3,
    bathrooms: 2,
    area: 78,
    parking: 1,
    storage: true,
    status: "Disponible",
    description:
      "Departamento amplio en piso alto, buena vista, cerca de la Universidad de Chile sede Macul. Ideal para familia o para compartir.",
    amenities: ["Bodega", "Estacionamiento", "Piscina del edificio", "Quincho"],
    photoTheme: "grad1",
    broker: "Ricardo Riffo",
  },
  {
    slug: "oficina-providencia",
    title: "Oficina 45 m² en Providencia",
    type: "Oficina",
    operation: "Venta",
    price: "UF 3.100",
    priceSub: "precio final",
    commune: "Providencia",
    address: "Av. Providencia 2000, Providencia, Santiago",
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    parking: 2,
    storage: false,
    status: "Disponible",
    description:
      "Oficina en edificio corporativo, dos estacionamientos incluidos, planta libre lista para personalizar.",
    amenities: ["2 estacionamientos", "Planta libre", "Edificio corporativo"],
    photoTheme: "grad2",
    broker: "Ricardo Riffo",
  },
  {
    slug: "depto-1d1b-nunoa",
    title: "Departamento 1D/1B en Ñuñoa",
    type: "Departamento",
    operation: "Arriendo",
    price: "$480.000",
    priceSub: "por mes, gastos comunes aparte",
    commune: "Ñuñoa",
    address: "Grecia 550, Ñuñoa, Santiago",
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    parking: 0,
    storage: false,
    status: "Disponible",
    description: "Departamento ideal para una persona, cerca de Plaza Ñuñoa y del comercio del sector.",
    amenities: ["Cerca del metro", "Balcón"],
    photoTheme: "grad3",
    broker: "Ricardo Riffo",
  },
];

export function getPropertyBySlug(slug) {
  return properties.find((p) => p.slug === slug);
}

export function getSimilarProperties(current, limit = 3) {
  return properties
    .filter((p) => p.slug !== current.slug && p.commune === current.commune)
    .slice(0, limit)
    .concat(
      properties.filter((p) => p.slug !== current.slug && p.commune !== current.commune)
    )
    .slice(0, limit);
}
