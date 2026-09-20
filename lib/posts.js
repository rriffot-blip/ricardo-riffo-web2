import { supabase } from "./supabaseClient";

export async function getPublishedPosts(limit) {
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "Publicado")
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("Error cargando artículos:", error.message);
    return [];
  }
  return data || [];
}

export async function getAllPosts() {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error cargando artículos:", error.message);
    return [];
  }
  return data || [];
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("Error cargando el artículo:", error.message);
    return null;
  }
  return data;
}
