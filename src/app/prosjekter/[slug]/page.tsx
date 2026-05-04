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
  const p = await prisma.project.findUnique({ where: { slug } }).catch(() => null);
  if (!p) return { title: "Ikke funnet" };
  return { title: `${p.name} — Uvesentlig` };
}

function statusColor(s: string): string {
  return s === "pågående" ? "var(--accent)" : "var(--muted)";
}

function formatDate(d: Date | null): string {
  if (!d) return "–";
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } }).catch(() => null);
  if (!project) notFound();

  const tags = parseTags(project.tags);
  const html = project.description ? renderMarkdown(project.description) : "";

  const relatedPosts = tags.length > 0
    ? await prisma.post.findMany({
        where: {
          published: true,
          OR: tags.map((t) => ({ tags: { contains: t } })),
        },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }).catch(() => [])
    : [];

  const links = project.links
    ? project.links
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [label, url] = l.split("=");
          return { label: label?.trim(), url: url?.trim() };
        })
        .filter((l) => l.label && l.url)
    : [];

  return (
    <PageShell>
      <TopNav active="prosjekter" />

      <div style={{ marginTop: 22 }}>
        <Link href="/prosjekter" style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
          ← prosjekter
        </Link>
        {project.category && (
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
            {" "}/ {project.category}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginTop: 8,
          gap: 16,
        }}
      >
        <h1 style={{ fontFamily: "var(--hand)", fontSize: "2rem", fontWeight: 500, lineHeight: 1.2 }}>
          {project.name}
        </h1>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            color: statusColor(project.status),
            letterSpacing: "0.05em",
            flexShrink: 0,
          }}
        >
          ● {project.status.toUpperCase()}
        </span>
      </div>

      <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)", marginTop: 6 }}>
        startet {formatDate(project.startedAt)}
        {project.endedAt && ` · avsluttet ${formatDate(project.endedAt)}`}
      </div>

      <Hair style={{ marginTop: 16, marginBottom: 20 }} />

      {html && (
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} style={{ marginBottom: 24 }} />
      )}

      {relatedPosts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.06em",
            }}
          >
            RELATERTE INNLEGG
          </span>
          <div style={{ marginTop: 8 }}>
            {relatedPosts.map((p) => (
              <Link key={p.id} href={`/blogg/${p.slug}`} style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "6px 0",
                    borderBottom: "0.6px dashed var(--muted)",
                  }}
                >
                  <span style={{ fontFamily: "var(--serif)", fontSize: "0.88rem", fontWeight: 500 }}>
                    {p.title}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)", flexShrink: 0, marginLeft: 12 }}>
                    {p.publishedAt?.toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {tags.map((t) => <Tag key={t}>#{t}</Tag>)}
        </div>
      )}

      {links.length > 0 && (
        <div>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
            lenker:
          </span>
          <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {links.map(({ label, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--accent)" }}
              >
                {label} →
              </a>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
