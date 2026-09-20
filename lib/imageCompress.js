// Redimensiona y comprime una foto en el navegador antes de subirla,
// para no gastar tan rápido el espacio gratuito de almacenamiento.
// No usa librerías externas: usa <canvas>, que ya viene en cualquier navegador.
export async function compressImage(file, { maxDimension = 1600, quality = 0.8 } = {}) {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) return file; // si algo falla, subimos el archivo original

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
