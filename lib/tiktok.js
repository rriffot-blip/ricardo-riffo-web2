// Reconoce links del formato https://www.tiktok.com/@usuario/video/1234567890123456789
// (el que se obtiene con "Compartir → Copiar link" en TikTok). Links cortos (vm.tiktok.com)
// no se pueden resolver sin hacer una petición aparte, así que en ese caso mostramos
// un link normal en vez del video incrustado.
export function getTiktokEmbedId(url) {
  if (!url) return null;
  const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  return match ? match[1] : null;
}
