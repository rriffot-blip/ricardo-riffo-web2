"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import PostForm from "@/components/admin/PostForm";
import { supabase } from "@/lib/supabaseClient";

export default function EditarArticuloPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    supabase.from("posts").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      setPost(data || null);
    });
  }, [slug]);

  return (
    <AdminGuard>
      <div className="adminwrap wide">
        <div className="adminbar">
          <h1>Editar artículo</h1>
        </div>
        {post === undefined && <p>Cargando...</p>}
        {post === null && <p>No se encontró ese artículo.</p>}
        {post && <PostForm initial={post} />}
      </div>
    </AdminGuard>
  );
}
