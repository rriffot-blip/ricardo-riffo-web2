import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog inmobiliario",
  description: "Información útil para arrendar, comprar y vender propiedades en Santiago.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="listheader">
          <h1>Blog inmobiliario</h1>
          <p>Información útil para arrendar, comprar y vender propiedades en Santiago.</p>
        </div>

        {posts.length === 0 ? (
          <div className="empty" style={{ marginTop: 40 }}>
            <p>Todavía no hay artículos publicados. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="posts" style={{ marginTop: 32 }}>
            {posts.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="post" style={{ textDecoration: "none" }}>
                {post.featured_image_url && (
                  <div style={{ aspectRatio: "16/9", borderRadius: "var(--radius-m)", overflow: "hidden", marginBottom: 14, border: "1px solid var(--line)" }}>
                    <img src={post.featured_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                )}
                <span className="tag">{post.category}</span>
                <h3>{post.title}</h3>
                {post.excerpt && <p>{post.excerpt}</p>}
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
