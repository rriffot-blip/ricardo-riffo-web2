export function formatPrice(property) {
  const amount = Number(property.price_amount);
  const formatted = amount.toLocaleString("es-CL");
  if (property.price_currency === "UF") {
    return `UF ${formatted}`;
  }
  return `$${formatted}`;
}

// Elige un color de respaldo determinístico cuando la propiedad
// todavía no tiene fotos cargadas.
const THEMES = ["grad1", "grad2", "grad3"];
export function placeholderTheme(property) {
  const key = property.slug || property.id || "";
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return THEMES[sum % THEMES.length];
}
