import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "./AdminShell";

export default async function AdminDashboard() {
  const [session, postCount, projectCount, bookCount] = await Promise.all([
    getServerSession(authOptions),
    prisma.post.count(),
    prisma.project.count(),
    prisma.book.count(),
  ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return (
    <AdminShell active="dashboard" session={session}>
      <div style={{ color: "#9a8f7a", fontSize: "0.68rem", fontFamily: "var(--mono)", marginBottom: 16, letterSpacing: "0.05em" }}>
        DASHBOARD
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "Blogginnlegg", count: postCount, href: "/admin/blogg" },
          { label: "Prosjekter", count: projectCount, href: "/admin/prosjekter" },
          { label: "Bøker", count: bookCount, href: "/admin/boker" },
        ].map(({ label, count, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              display: "block",
              background: "#15110e",
              border: "0.6px solid #3d3630",
              padding: "14px 18px",
              minWidth: 120,
            }}
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", color: "#e8e0d0" }}>
              {count}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#9a8f7a", marginTop: 4 }}>
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ borderTop: "0.6px solid #3d3630", paddingTop: 16 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#9a8f7a", marginBottom: 10, letterSpacing: "0.05em" }}>
          SISTE INNLEGG
        </div>
        {recentPosts.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "5px 0",
              borderBottom: "0.4px solid #3d3630",
            }}
          >
            <Link
              href={`/admin/blogg/${p.id}`}
              style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "#e8e0d0" }}
            >
              {p.title}
            </Link>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: p.published ? "var(--accent)" : "#6a6155" }}>
                {p.published ? "publisert" : "kladd"}
              </span>
              <Link
                href={`/admin/blogg/${p.id}`}
                style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#9a8f7a" }}
              >
                rediger →
              </Link>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 14 }}>
          <Link
            href="/admin/blogg/ny"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.72rem",
              border: "0.6px solid var(--accent)",
              color: "var(--accent)",
              padding: "5px 12px",
              display: "inline-block",
            }}
          >
            + nytt innlegg
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
