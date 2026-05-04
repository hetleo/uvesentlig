export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import Tag from "@/components/ui/Tag";
import Hair from "@/components/ui/Hair";
import { parseTags } from "@/lib/markdown";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  }).catch(() => []);

  const allTags = Array.from(
    new Set(posts.flatMap((p) => parseTags(p.tags)))
  ).sort();

  return (
    <PageShell>
      <TopNav active="blogg" />

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginTop: 22,
          marginBottom: 6,
        }}
      >
        <h1 style={{ fontFamily: "var(--hand)", fontSize: "1.7rem", fontWeight: 500 }}>
          Blogg
        </h1>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
          {posts.length} innlegg
        </span>
      </div>

      {allTags.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)", marginRight: 6 }}>
            tags:
          </span>
          {allTags.map((t) => (
            <Tag key={t}>#{t}</Tag>
          ))}
        </div>
      )}

      <Hair />

      <div style={{ marginTop: 8 }}>
        {posts.length === 0 && (
          <p style={{ color: "var(--muted)", fontFamily: "var(--serif)", fontSize: "0.95rem", marginTop: 24 }}>
            Ingen innlegg publisert ennå.
          </p>
        )}
        {posts.map((p) => {
          const tags = parseTags(p.tags);
          return (
            <Link key={p.id} href={`/blogg/${p.slug}`} style={{ display: "block" }}>
              <div style={{ padding: "14px 0", borderBottom: "0.6px dashed var(--muted)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", fontWeight: 500 }}>
                    {p.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.65rem",
                      color: "var(--muted)",
                      flexShrink: 0,
                      marginLeft: 16,
                    }}
                  >
                    {formatDate(p.publishedAt)}
                  </span>
                </div>
                {p.ingress && (
                  <p
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "0.88rem",
                      color: "var(--muted)",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.ingress}
                  </p>
                )}
                {tags.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {tags.map((t) => <Tag key={t}>#{t}</Tag>)}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
