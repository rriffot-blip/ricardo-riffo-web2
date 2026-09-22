import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor." }, { status: 500 });
  }

  const body = await request.json();
  const {
    title, type, operation, price_amount, price_currency, price_note,
    common_expenses, common_expenses_note,
    commune, address, bedrooms, bathrooms, area, total_area, parking, storage_count, status,
    floor, floor_total, orientation, features,
    commission_type, commission_installments, deposit_type, deposit_installments,
    has_promotion, promotion_type, promotion_text,
  } = body;

  const details = `
Título: ${title || "(sin título)"}
Tipo: ${type}
Operación: ${operation}
Precio: ${price_amount} ${price_currency} ${price_note ? `(${price_note})` : ""}
Gastos comunes: ${common_expenses ? `${common_expenses} ${common_expenses_note ? `(${common_expenses_note})` : ""}` : "no especificados"}
Comuna: ${commune}
Dirección: ${address || "(no especificada)"}
Dormitorios: ${bedrooms}
Baños: ${bathrooms}
Superficie útil: ${area ? `${area} m²` : "(no especificada)"}
Superficie total: ${total_area ? `${total_area} m²` : "(no especificada)"}
Estacionamientos: ${parking}
Bodegas: ${storage_count || 0}
Piso: ${floor || "(no especificado)"}${floor_total ? ` de ${floor_total}` : ""}
Orientación: ${orientation || "(no especificada)"}
Características: ${features?.length ? features.join(", ") : "(ninguna especificada)"}
Estado: ${status}
${operation === "Arriendo" ? `Comisión: ${commission_type || "no especificada"}${commission_installments ? ` (${commission_installments})` : ""}
Garantía: ${deposit_type || "no especificada"}${deposit_installments ? ` (${deposit_installments})` : ""}` : ""}
${has_promotion ? `Promoción: ${promotion_text || promotion_type}` : ""}
`.trim();

  const prompt = `Eres un corredor de propiedades chileno escribiendo la descripción de una propiedad para su ficha en un sitio web. Usa un tono cercano, directo y profesional, sin frases genéricas de marketing ni exageraciones. Escribe en español de Chile, en un solo párrafo de 3 a 5 oraciones. No inventes detalles que no están en los datos (por ejemplo, no menciones vista, luminosidad, o remodelaciones si no se especificaron). Basándote SOLO en estos datos, escribe la descripción:

${details}

Responde ÚNICAMENTE con el párrafo de la descripción, sin título ni comillas ni texto adicional.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ description: text });
  } catch (err) {
    console.error("Error generando descripción:", err);
    return NextResponse.json({ error: "No se pudo generar la descripción. Intenta de nuevo." }, { status: 500 });
  }
}
