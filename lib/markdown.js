import { marked } from "marked";

marked.setOptions({ breaks: true });

// El contenido solo puede crearlo Ricardo (protegido con su login), así que
// no agregamos una librería de sanitizado aparte — no es contenido de terceros.
export function markdownToHtml(markdown) {
  if (!markdown) return "";
  return marked.parse(markdown);
}
