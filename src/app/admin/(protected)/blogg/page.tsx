import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "../AdminShell";

export default async function AdminBlogList() {
  const [session, posts] = await Promise.all([
    getServerSession(authOptions),
    prisma.post.findMany({ orderBy: { updatedAt: "desc" } }),
  ]);

  return (
    <AdminShell active="blogg" session={session}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
          BLOGG · {posts.length} INNLEGG
        </div>
        <Link
          href="/admin/blogg/ny"
          style={{
            border: "0.6px solid var(--accent)",
            color: "var(--accent)",
            padding: "4px 12px",
            fontSize: "0.68rem",
          }}
        >
          + nytt innlegg
        </Link>
      </div>

      {posts.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "0.4px solid #3d3630",
          }}
        >
          <div>
            <Link
              href={`/admin/blogg/${p.id}`}
              style={{ color: "#e8e0d0", fontSize: "0.8rem" }}
            >
              {p.title}
            </Link>
            <div style={{ fontSize: "0.62rem", color: "#6a6155", marginTop: 2 }}>
              {p.slug}
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0, marginLeft: 16 }}>
            <span
              style={{
                fontSize: "0.65rem",
                color: p.published ? "var(--accent)" : "#6a6155",
              }}
            >
              {p.published ? "publisert" : "kladd"}
            </span>
            <Link
              href={`/admin/blogg/${p.id}`}
              style={{ fontSize: "0.65rem", color: "#9a8f7a" }}
            >
              rediger →
            </Link>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div style={{ color: "#6a6155", fontSize: "0.78rem", marginTop: 20 }}>
          Ingen innlegg ennå.
        </div>
      )}
    </AdminShell>
  );
}
