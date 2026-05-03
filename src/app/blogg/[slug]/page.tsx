import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import Tag from "@/components/ui/Tag";
import Hair from "@/components/ui/Hair";
import { renderMarkdown, parseTags } from "@/lib/markdown";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Ikke funnet" };
  return { title: `${post.title} — Uvesentlig`, description: post.ingress };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  const tags = parseTags(post.tags);
  const html = renderMarkdown(post.content);

  const relatedProjects = tags.length > 0
    ? await prisma.project.findMany({
        where: {
          OR: tags.map((t) => ({ tags: { contains: t } })),
        },
        take: 3,
      })
    : [];

  const dateStr = post.publishedAt
    ? post.publishedAt.toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <PageShell>
      <TopNav active="blogg" />

      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ marginTop: 22 }}>
          <Link
            href="/blogg"
            style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}
          >
            ← blogg
          </Link>
          {tags.length > 0 && (
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
              {" "}
              / {tags.join(", ")}
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--hand)",
            fontSize: "2rem",
            fontWeight: 500,
            lineHeight: 1.2,
            margin: "10px 0 6px",
          }}
        >
          {post.title}
        </h1>

        <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)", marginBottom: 24 }}>
          {dateStr}
        </div>

        <Hair />

        <div
          className="prose"
          style={{ marginTop: 24 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div style={{ marginTop: 32, paddingTop: 14, borderTop: "0.6px solid var(--hair)", opacity: 0.4 }} />

        {tags.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {tags.map((t) => <Tag key={t}>#{t}</Tag>)}
          </div>
        )}

        {relatedProjects.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
              relaterte prosjekter:
            </span>
            <div style={{ marginTop: 6 }}>
              {relatedProjects.map((p) => (
                <Link key={p.id} href={`/prosjekter/${p.slug}`}>
                  <Tag color="var(--accent)" style={{ cursor: "pointer" }}>
                    {p.name} →
                  </Tag>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
