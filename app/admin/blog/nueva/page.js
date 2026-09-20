"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import PostForm from "@/components/admin/PostForm";

export default function NuevoArticuloPage() {
  return (
    <AdminGuard>
      <div className="adminwrap wide">
        <div className="adminbar">
          <h1>Nuevo artículo</h1>
        </div>
        <PostForm />
      </div>
    </AdminGuard>
  );
}
