import { prisma } from "@/lib/db";
import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import Hair from "@/components/ui/Hair";

function statusColor(s: string): string {
  return s === "leser" ? "var(--accent)" : "var(--muted)";
}

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";

  const [reading, allBooks] = await Promise.all([
    prisma.book.findMany({ where: { status: "leser" }, orderBy: { updatedAt: "desc" } }).catch(() => []),
    prisma.book.findMany({ orderBy: [{ status: "asc" }, { title: "asc" }] }).catch(() => []),
  ]);

  const filtered = query
    ? allBooks.filter((b) =>
        b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
      )
    : allBooks;

  return (
    <PageShell>
      <TopNav active="bibliotek" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 22,
        }}
      >
        <h1 style={{ fontFamily: "var(--hand)", fontSize: "1.7rem", fontWeight: 500 }}>
          Bibliotek
        </h1>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
          {allBooks.length} bøker
        </span>
      </div>

      <Hair style={{ marginTop: 10, marginBottom: 18 }} />

      {/* Reading now — covers */}
      {reading.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.06em",
            }}
          >
            LESER NÅ — {reading.length}
          </span>
          <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            {reading.map((b) => {
              const short = b.title.split(" ")[0];
              const lastName = b.author.split(" ").pop() ?? b.author;
              const patId = `lib-${b.id}`;
              const imgSrc = b.coverUrl ? b.coverUrl.replace(/^http:\/\//, "https://") : null;
              return (
                <div key={b.id} style={{ width: 80 }}>
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc} alt={b.title} width={64} height={96} style={{ display: "block", objectFit: "cover", border: "0.6px solid var(--hair)", opacity: 0.92 }} />
                  ) : (
                  <svg width={64} height={96} style={{ display: "block" }}>
                    <defs>
                      <pattern id={patId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(40)">
                        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--muted)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect x="0.5" y="0.5" width={63} height={95} fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.9" />
                    <text x={32} y={42} textAnchor="middle" fontFamily="var(--hand)" fontSize="10" fill="var(--ink)">{short}</text>
                    <text x={32} y={80} textAnchor="middle" fontFamily="var(--mono)" fontSize="6.5" fill="var(--muted)">{lastName}</text>
                  </svg>
                  )}
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "0.8rem", fontWeight: 500, lineHeight: 1.3 }}>
                      {b.title}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--muted)", marginTop: 2 }}>
                      {b.author}
                    </div>
                    <div style={{ marginTop: 4, height: 2, background: "rgba(0,0,0,0.1)", position: "relative", borderRadius: 1 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: `${b.progress}%`, background: "var(--accent)", borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full catalogue */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.06em" }}>
            HELE KATALOGEN
          </span>
          <form method="get">
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="søk…"
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "0.6px solid var(--muted)",
                color: "var(--ink)",
                fontFamily: "var(--mono)",
                fontSize: "0.68rem",
                padding: "2px 4px",
                outline: "none",
                width: 140,
              }}
            />
          </form>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.1fr 0.4fr 0.65fr 0.65fr",
            columnGap: 12,
            paddingBottom: 5,
            borderBottom: "0.8px solid var(--hair)",
            marginTop: 8,
          }}
        >
          {["TITTEL", "FORFATTER", "ÅR", "STATUS", "PLASSERING"].map((h) => (
            <span key={h} style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.05em" }}>
              {h}
            </span>
          ))}
        </div>
        {filtered.map((b) => (
          <div
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.1fr 0.4fr 0.65fr 0.65fr",
              columnGap: 12,
              padding: "5px 0",
              borderBottom: "0.4px dashed var(--muted)",
            }}
          >
            <span style={{ fontFamily: "var(--serif)", fontSize: "0.85rem" }}>{b.title}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>{b.author}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>{b.year}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: statusColor(b.status) }}>{b.status}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>{b.location}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "var(--muted)", fontFamily: "var(--serif)", fontSize: "0.95rem", marginTop: 24 }}>
            Ingen bøker ennå.
          </p>
        )}
      </div>
    </PageShell>
  );
}
