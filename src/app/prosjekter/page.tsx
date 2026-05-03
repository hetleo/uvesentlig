import Link from "next/link";
import { prisma } from "@/lib/db";
import type { ProjectModel as Project } from "@/generated/prisma/models";
import TopNav from "@/components/layout/TopNav";
import PageShell from "@/components/layout/PageShell";
import Hair from "@/components/ui/Hair";

const STATUS_ORDER = ["pågående", "pause", "ferdig", "idé", "forlatt"];

function statusColor(s: string): string {
  return s === "pågående" ? "var(--accent)" : "var(--muted)";
}

function formatPeriod(p: Project): string {
  const start = p.startedAt
    ? new Date(p.startedAt).toLocaleDateString("nb-NO", { month: "short", year: "numeric" })
    : "";
  const end = p.endedAt
    ? new Date(p.endedAt).toLocaleDateString("nb-NO", { month: "short", year: "numeric" })
    : "–";
  return start ? `${start} ${end}` : end;
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  const grouped = STATUS_ORDER.reduce<Record<string, Project[]>>((acc, s) => {
    acc[s] = projects.filter((p) => p.status === s);
    return acc;
  }, {});

  return (
    <PageShell>
      <TopNav active="prosjekter" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 22,
        }}
      >
        <h1 style={{ fontFamily: "var(--hand)", fontSize: "1.7rem", fontWeight: 500 }}>
          Prosjekter
        </h1>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
          {projects.length} totalt
        </span>
      </div>

      <Hair style={{ marginTop: 10, marginBottom: 22 }} />

      {STATUS_ORDER.map((status) => {
        const group = grouped[status];
        if (!group || group.length === 0) return null;
        return (
          <div key={status} style={{ marginBottom: 26 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--hand)",
                  fontSize: "1.2rem",
                  color: statusColor(status),
                  textTransform: "capitalize",
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                {group.length}
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--hair)", opacity: 0.18 }} />
            </div>

            {group.map((p) => (
              <Link key={p.id} href={`/prosjekter/${p.slug}`} style={{ display: "block" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 0.6fr 0.8fr",
                    columnGap: 16,
                    padding: "6px 0",
                    borderBottom: "0.5px dashed var(--muted)",
                  }}
                >
                  <span style={{ fontFamily: "var(--serif)", fontSize: "0.9rem", fontWeight: 500 }}>
                    {p.name}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                    {p.category}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                    {formatPeriod(p)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        );
      })}

      {projects.length === 0 && (
        <p style={{ color: "var(--muted)", fontFamily: "var(--serif)", fontSize: "0.95rem" }}>
          Ingen prosjekter ennå.
        </p>
      )}
    </PageShell>
  );
}
