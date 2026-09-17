import { supabase } from "./supabaseClient";

export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando propiedades:", error.message);
    return [];
  }
  return data || [];
}

export async function getPropertyBySlug(slug) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error cargando la propiedad:", error.message);
    return null;
  }
  return data;
}

export async function getSimilarProperties(current, limit = 3) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .neq("slug", current.slug)
    .limit(limit * 2);

  if (error || !data) return [];

  const sameCommune = data.filter((p) => p.commune === current.commune);
  const rest = data.filter((p) => p.commune !== current.commune);
  return [...sameCommune, ...rest].slice(0, limit);
}
