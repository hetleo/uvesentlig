import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "../AdminShell";
import DeleteProjectButton from "./DeleteProjectButton";

const STATUS_ORDER = ["pågående", "pause", "ferdig", "idé", "forlatt"];

export default async function AdminProjectsList() {
  const [session, projects] = await Promise.all([
    getServerSession(authOptions),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <AdminShell active="prosjekter" session={session}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
          PROSJEKTER · {projects.length} TOTALT
        </div>
        <Link
          href="/admin/prosjekter/ny"
          style={{
            border: "0.6px solid var(--accent)",
            color: "var(--accent)",
            padding: "4px 12px",
            fontSize: "0.68rem",
          }}
        >
          + nytt prosjekt
        </Link>
      </div>

      {STATUS_ORDER.map((status) => {
        const group = projects.filter((p) => p.status === status);
        if (!group.length) return null;
        return (
          <div key={status} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.6rem", color: "#9a8f7a", letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>
              {status}
            </div>
            {group.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "0.4px solid #3d3630",
                }}
              >
                <Link href={`/admin/prosjekter/${p.id}`} style={{ color: "#e8e0d0", fontSize: "0.78rem" }}>
                  {p.name}
                </Link>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.62rem", color: "#6a6155" }}>{p.category}</span>
                  <Link href={`/admin/prosjekter/${p.id}`} style={{ fontSize: "0.65rem", color: "#9a8f7a" }}>
                    rediger →
                  </Link>
                  <DeleteProjectButton id={p.id} name={p.name} />
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {projects.length === 0 && (
        <div style={{ color: "#6a6155", fontSize: "0.78rem", marginTop: 20 }}>
          Ingen prosjekter ennå.
        </div>
      )}
    </AdminShell>
  );
}
