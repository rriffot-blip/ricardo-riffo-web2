import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor." }, { status: 500 });
  }

  const body = await request.json();
  const { type, operation, commune, bedrooms, bathrooms, area, features } = body;

  const details = `
Tipo: ${type}
Operación: ${operation}
Comuna: ${commune}
Dormitorios: ${bedrooms}
Baños: ${bathrooms}
Superficie: ${area ? `${area} m²` : "no especificada"}
Características: ${features?.length ? features.join(", ") : "ninguna especificada"}
`.trim();

  const prompt = `Eres un corredor de propiedades chileno. Basándote SOLO en estos datos, escribe un título corto y atractivo (máximo 60 caracteres) para la ficha de una propiedad, en español de Chile. No inventes datos que no están aquí. No uses comillas. Responde ÚNICAMENTE con el título, nada más:

${details}`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 60,
      messages: [{ role: "user", content: prompt }],
    });

    const title = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()
      .replace(/^["']|["']$/g, "");

    return NextResponse.json({ title });
  } catch (err) {
    console.error("Error generando título:", err);
    return NextResponse.json({ error: "No se pudo generar el título. Intenta de nuevo." }, { status: 500 });
  }
}
