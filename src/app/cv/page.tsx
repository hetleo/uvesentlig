export const dynamic = "force-dynamic";

import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import SectionLabel from "@/components/ui/SectionLabel";
import Tag from "@/components/ui/Tag";
import Hair from "@/components/ui/Hair";
import { prisma } from "@/lib/db";

function CVRow({ title, employer, period, description }: { title: string; employer: string; period: string; description: string }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "0.5px dashed var(--muted)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", fontWeight: 500 }}>
          {title}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)", flexShrink: 0, marginLeft: 16 }}>
          {period}
        </span>
      </div>
      {employer && (
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)", marginTop: 2 }}>
          {employer}
        </div>
      )}
      {description && (
        <p style={{ fontFamily: "var(--serif)", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.55, marginTop: 6, opacity: 0.85 }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default async function CVPage() {
  const entries = await prisma.cvEntry.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  }).catch(() => []);

  const erfaring = entries.filter((e) => e.type === "erfaring");
  const utdanning = entries.filter((e) => e.type === "utdanning");

  return (
    <PageShell>
      <TopNav active="cv" />

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ marginTop: 22 }}>
          <h1 style={{ fontFamily: "var(--hand)", fontSize: "1.8rem", fontWeight: 500, marginBottom: 4 }}>
            Leon
          </h1>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
            Mandal · leon@uvesentlig.no · uvesentlig.no
          </div>
        </div>

        <Hair style={{ marginTop: 16, marginBottom: 16 }} />

        <p style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink)", marginBottom: 24 }}>
          Tekno-nerd, bibliotekar, far til tre tenåringsgutter og gift med en kjøttmeis. Liker å lære nye ting, løse problemer og å lese bøker. Liker ikke båtlivet.
        </p>

        {erfaring.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Erfaring</SectionLabel>
            {erfaring.map((e) => <CVRow key={e.id} title={e.title} employer={e.employer} period={e.period} description={e.description} />)}
          </div>
        )}

        {utdanning.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Utdanning</SectionLabel>
            {utdanning.map((e) => <CVRow key={e.id} title={e.title} employer={e.employer} period={e.period} description={e.description} />)}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <SectionLabel>Ferdigheter</SectionLabel>
          <div style={{ marginTop: 8 }}>
            <Tag>Bibliotekutvikling</Tag>
            <Tag>Endringsledelse</Tag>
            <Tag>KI</Tag>
            <Tag>Sjakk</Tag>
            <Tag>Sci-fi</Tag>
            <Tag>kaffe</Tag>
          </div>
        </div>

        <div>
          <SectionLabel>Kontakt</SectionLabel>
          <div style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="mailto:leon@uvesentlig.no" style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--accent)" }}>
              leon@uvesentlig.no
            </a>
            <a href="https://github.com/hetleo" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--accent)" }}>
              github →
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
