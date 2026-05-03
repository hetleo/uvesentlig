import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import SectionLabel from "@/components/ui/SectionLabel";
import Tag from "@/components/ui/Tag";
import Hair from "@/components/ui/Hair";

function CVRow({ title, period }: { title: string; period: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "5px 0",
        borderBottom: "0.5px dashed var(--muted)",
      }}
    >
      <span style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", fontWeight: 500 }}>
        {title}
      </span>
      <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)", flexShrink: 0, marginLeft: 16 }}>
        {period}
      </span>
    </div>
  );
}

export default function CVPage() {
  return (
    <PageShell>
      <TopNav active="cv" />

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ marginTop: 22 }}>
          <h1 style={{ fontFamily: "var(--hand)", fontSize: "1.8rem", fontWeight: 500, marginBottom: 4 }}>
            Leon
          </h1>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
            oslo · leon@uvesentlig.no · uvesentlig.no
          </div>
        </div>

        <Hair style={{ marginTop: 16, marginBottom: 16 }} />

        <p style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink)", marginBottom: 24 }}>
          Utvikler med lange interesser utenfor skjermen — fugler, bøker, hager, og det som ikke helt lar seg kategorisere. Lager ting som varer litt.
        </p>

        <div style={{ marginBottom: 20 }}>
          <SectionLabel>Erfaring</SectionLabel>
          <CVRow title="Senior utvikler · Et lite konsulentsted" period="2021 – nå" />
          <CVRow title="Utvikler · Større byrå AS" period="2017 – 2021" />
          <CVRow title="Frilans · diverse" period="2014 – 2017" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <SectionLabel>Utdanning</SectionLabel>
          <CVRow title="MSc Informatikk · UiO" period="2012 – 2014" />
          <CVRow title="BSc Informatikk · UiO" period="2009 – 2012" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <SectionLabel>Ferdigheter</SectionLabel>
          <div style={{ marginTop: 8 }}>
            <Tag>Python</Tag>
            <Tag>TypeScript</Tag>
            <Tag>PostgreSQL</Tag>
            <Tag>React</Tag>
            <Tag>CSS</Tag>
            <Tag>fugler</Tag>
            <Tag>kaffe</Tag>
          </div>
        </div>

        <div>
          <SectionLabel>Kontakt</SectionLabel>
          <div style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href="mailto:leon@uvesentlig.no"
              style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--accent)" }}
            >
              leon@uvesentlig.no
            </a>
            <a
              href="https://github.com/leon"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--accent)" }}
            >
              github →
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
