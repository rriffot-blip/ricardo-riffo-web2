const WHATSAPP_NUMBER = "56974983628"; // Chile, sin +, sin espacios

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappLinkForProperty(property) {
  const message = `Hola Ricardo, me interesa la propiedad "${property.title}" (${property.commune}). ¿Podrías darme más información?`;
  return whatsappLink(message);
}
