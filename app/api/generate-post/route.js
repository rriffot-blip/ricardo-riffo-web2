import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor." }, { status: 500 });
  }

  const { title, category } = await request.json();
  if (!title) {
    return NextResponse.json({ error: "Falta el título del artículo." }, { status: 400 });
  }

  const prompt = `Eres Ricardo Riffo, corredor de propiedades chileno con más de 15 años de experiencia, escribiendo un artículo para el blog de tu sitio web. Tu tono es cercano, directo y práctico, sin jerga corporativa ni frases genéricas de marketing. Escribe en español de Chile.

Escribe un artículo con:
- Título: "${title}"
- Categoría: "${category || "Guías inmobiliarias"}"

El artículo debe:
- Tener entre 400 y 600 palabras.
- Estar en formato Markdown, usando ## para subtítulos donde tenga sentido.
- Ser práctico y útil, con información real y aplicable sobre el mercado inmobiliario chileno (no inventes cifras, leyes o porcentajes específicos si no estás seguro; habla en términos generales cuando corresponda).
- No prometer resultados garantizados ni hacer afirmaciones legales tajantes.

Responde EXACTAMENTE en este formato, sin nada más antes o después:

EXTRACTO: (una o dos oraciones que resuman el artículo, para usar como vista previa)

ARTICULO:
(el cuerpo del artículo en Markdown)`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    const match = text.match(/EXTRACTO:\s*([\s\S]*?)\n\s*ARTICULO:\s*([\s\S]*)/i);
    if (!match) {
      return NextResponse.json({ excerpt: "", body: text });
    }

    const excerpt = match[1].trim();
    const body = match[2].trim();

    return NextResponse.json({ excerpt, body });
  } catch (err) {
    console.error("Error generando artículo:", err);
    return NextResponse.json({ error: "No se pudo generar el artículo. Intenta de nuevo." }, { status: 500 });
  }
}
