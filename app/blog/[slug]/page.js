import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "Publicado") return {};

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : undefined,
      type: "article",
    },
    twitter: {
      card: post.featured_image_url ? "summary_large_image" : "summary",
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "Publicado") notFound();

  const html = markdownToHtml(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.featured_image_url || undefined,
    datePublished: post.published_at || post.created_at,
    author: { "@type": "Person", name: "Ricardo Riffo" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="wrap">
        <div className="crumb">
          <Link href="/blog">Blog</Link> / {post.category}
        </div>

        <div className="pagehero" style={{ paddingBottom: 0 }}>
          <span className="tag" style={{ color: "var(--moss)", fontSize: "0.85rem", display: "block", marginBottom: 10 }}>{post.category}</span>
          <h1>{post.title}</h1>
        </div>

        {post.featured_image_url && (
          <div style={{ aspectRatio: "16/9", borderRadius: "var(--radius-m)", overflow: "hidden", margin: "28px 0", border: "1px solid var(--line)" }}>
            <img src={post.featured_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}

        <div className="article-body" style={{ paddingBottom: 90 }} dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <Footer />
    </>
  );
}
