"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import PostsDashboard from "@/components/admin/PostsDashboard";

export default function AdminBlogPage() {
  return (
    <AdminGuard>
      <PostsDashboard />
    </AdminGuard>
  );
}
