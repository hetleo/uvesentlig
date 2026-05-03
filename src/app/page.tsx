import Link from "next/link";
import { prisma } from "@/lib/db";
import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import SectionLabel from "@/components/ui/SectionLabel";
import Tag from "@/components/ui/Tag";
import { parseTags } from "@/lib/markdown";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

function statusColor(status: string): string {
  return status === "pågående" ? "var(--accent)" : "var(--muted)";
}

export default async function HomePage() {
  const [posts, projects, books] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    prisma.project.findMany({
      where: { status: { in: ["pågående", "pause"] } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.book.findMany({
      where: { status: "leser" },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <PageShell>
      <TopNav active="leon" />

      <div style={{ marginTop: 28 }}>
        <h1
          style={{
            fontFamily: "var(--hand)",
            fontSize: "1.9rem",
            fontWeight: 500,
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          Hei, jeg er Leon.
        </h1>
        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1rem",
            color: "var(--ink)",
            maxWidth: 460,
            lineHeight: 1.65,
          }}
        >
          Helt uvesentlig siden 1980. Dette er stedet mitt på nettet — en
          rolig hage for det jeg leser, lager og ser etter.
        </p>
      </div>

      {books.length > 0 && (
        <div style={{ marginTop: 34 }}>
          <SectionLabel>Leser nå</SectionLabel>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
            {books.map((b) => (
              <BookCoverDisplay key={b.id} title={b.title} author={b.author} progress={b.progress} />
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <SectionLabel>Holder på med</SectionLabel>
          {projects.map((p) => (
            <Link key={p.id} href={`/prosjekter/${p.slug}`} style={{ display: "block" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "6px 0",
                  borderBottom: "0.6px dashed var(--muted)",
                }}
              >
                <span style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", fontWeight: 500 }}>
                  {p.name}
                </span>
                <div style={{ display: "flex", gap: 12, flexShrink: 0, marginLeft: 12 }}>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "0.65rem",
                      color: statusColor(p.status),
                      letterSpacing: "0.03em",
                    }}
                  >
                    {p.status}
                  </span>
                  {p.startedAt && (
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                      {new Date(p.startedAt).toLocaleDateString("nb-NO", { month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <SectionLabel>Siste fra bloggen</SectionLabel>
          {posts.map((p) => {
            const tags = parseTags(p.tags);
            return (
              <Link key={p.id} href={`/blogg/${p.slug}`} style={{ display: "block" }}>
                <div style={{ padding: "8px 0", borderBottom: "0.6px dashed var(--muted)" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", fontWeight: 500 }}>
                      {p.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.65rem",
                        color: "var(--muted)",
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {formatDate(p.publishedAt)}
                    </span>
                  </div>
                  {tags.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      {tags.map((t) => <Tag key={t}>#{t}</Tag>)}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
          <div style={{ marginTop: 14 }}>
            <Link
              href="/blogg"
              style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.04em" }}
            >
              alle innlegg →
            </Link>
          </div>
        </div>
      )}

      {posts.length === 0 && projects.length === 0 && books.length === 0 && (
        <div style={{ marginTop: 40 }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", color: "var(--muted)" }}>
            Ingenting her ennå —{" "}
            <Link href="/admin" style={{ color: "var(--accent)" }}>
              legg til innhold via admin
            </Link>
            .
          </p>
        </div>
      )}
    </PageShell>
  );
}

function BookCoverDisplay({ title, author, progress }: { title: string; author: string; progress: number }) {
  const short = title.split(" ")[0];
  const lastName = author.split(" ").pop() ?? author;
  const patId = `bk-${short.replace(/\W/g, "")}`;
  return (
    <div style={{ width: 60 }}>
      <svg width={56} height={84} style={{ display: "block" }}>
        <defs>
          <pattern id={patId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(40)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--muted)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0.5" y="0.5" width={55} height={83} fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.9" />
        <text x={28} y={36} textAnchor="middle" fontFamily="var(--hand)" fontSize="9" fill="var(--ink)">{short}</text>
        <text x={28} y={70} textAnchor="middle" fontFamily="var(--mono)" fontSize="6" fill="var(--muted)">{lastName}</text>
      </svg>
      <div style={{ marginTop: 4, height: 2, background: "rgba(0,0,0,0.1)", position: "relative", borderRadius: 1 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: `${progress}%`, background: "var(--accent)", borderRadius: 1 }} />
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--muted)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {short}
      </div>
    </div>
  );
}
