"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CvEntryModel as CvEntry } from "@/generated/prisma/models";

const TYPE_OPTIONS = ["erfaring", "utdanning"];

interface CvAdminProps {
  initialEntries: CvEntry[];
}

export default function CvAdmin({ initialEntries }: CvAdminProps) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState({ type: "erfaring", title: "", employer: "", period: "", description: "", sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    background: "#15110e",
    border: "0.6px solid #3d3630",
    color: "#e8e0d0",
    fontFamily: "var(--mono)",
    fontSize: "0.75rem",
    padding: "5px 8px",
    outline: "none",
  };

  const inlineInput = {
    background: "transparent",
    border: "none",
    borderBottom: "0.6px solid transparent",
    outline: "none",
    fontFamily: "var(--mono)",
    padding: "2px 0",
    color: "#e8e0d0",
    width: "100%",
  };

  async function handleAdd() {
    if (!form.title.trim() || !form.period.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Feil"); return; }
    setEntries((prev) => [...prev, json]);
    setForm({ type: form.type, title: "", employer: "", period: "", description: "", sortOrder: 0 });
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Slett oppføringen?")) return;
    const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
    if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  async function patch(id: number, data: Partial<CvEntry>) {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, ...data } : e));
    await fetch(`/api/cv/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function move(type: string, index: number, dir: -1 | 1) {
    const group = entries
      .filter((e) => e.type === type)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= group.length) return;

    const reordered = [...group];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const updated = reordered.map((e, i) => ({ ...e, sortOrder: i }));

    setEntries((prev) => {
      const others = prev.filter((e) => e.type !== type);
      return [...others, ...updated];
    });

    await Promise.all(
      updated.map((e) =>
        fetch(`/api/cv/${e.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: e.sortOrder }),
        })
      )
    );
  }

  const sections = TYPE_OPTIONS.map((type) => ({
    type,
    label: type === "erfaring" ? "ERFARING" : "UTDANNING",
    items: entries.filter((e) => e.type === type).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
  }));

  return (
    <div>
      <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em", marginBottom: 20 }}>
        CV · {entries.length} OPPFØRINGER
      </div>

      {/* Add form */}
      <div style={{ background: "#15110e", border: "0.6px solid #3d3630", padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: "0.65rem", color: "#9a8f7a", marginBottom: 12, letterSpacing: "0.05em" }}>NY OPPFØRING</div>
        <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.2fr 1.2fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>TYPE</div>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, width: "100%" }}>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>STILLING / GRAD</div>
            <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Senior utvikler" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>ARBEIDSGIVER / INSTITUSJON</div>
            <input type="text" value={form.employer} onChange={(e) => setForm((f) => ({ ...f, employer: e.target.value }))} placeholder="Firma AS" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>PERIODE</div>
            <input type="text" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="2020 – nå" style={{ ...inputStyle, width: "100%" }} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>BESKRIVELSE</div>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Oppgaver, ansvar og resultater…" style={{ ...inputStyle, width: "100%", resize: "vertical" }} />
        </div>
        {error && <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)", marginBottom: 8 }}>{error}</div>}
        <button onClick={handleAdd} disabled={saving} style={{ border: "0.6px solid var(--accent)", color: "var(--accent)", background: "none", fontFamily: "var(--mono)", fontSize: "0.68rem", padding: "5px 14px", cursor: "pointer" }}>
          {saving ? "legger til…" : "legg til"}
        </button>
      </div>

      {/* Sections */}
      {sections.map(({ type, label, items }) => (
        <div key={type} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</div>
          {items.length === 0 && <div style={{ color: "#4a423a", fontSize: "0.72rem" }}>Ingen oppføringer ennå.</div>}
          {items.map((e, idx) => (
            <div key={e.id} style={{ borderBottom: "0.6px solid #2a2520", padding: "10px 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", columnGap: 10, alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: "0.55rem", color: "#4a423a", marginBottom: 2 }}>STILLING / GRAD</div>
                  <input
                    defaultValue={e.title}
                    onBlur={(ev) => ev.target.value !== e.title && patch(e.id, { title: ev.target.value })}
                    style={{ ...inlineInput, fontSize: "0.72rem" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.55rem", color: "#4a423a", marginBottom: 2 }}>ARBEIDSGIVER</div>
                  <input
                    defaultValue={e.employer}
                    onBlur={(ev) => ev.target.value !== e.employer && patch(e.id, { employer: ev.target.value })}
                    style={{ ...inlineInput, fontSize: "0.65rem", color: "#9a8f7a" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.55rem", color: "#4a423a", marginBottom: 2 }}>PERIODE</div>
                  <input
                    defaultValue={e.period}
                    onBlur={(ev) => ev.target.value !== e.period && patch(e.id, { period: ev.target.value })}
                    style={{ ...inlineInput, fontSize: "0.65rem", color: "#9a8f7a" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 12 }}>
                  <button onClick={() => move(type, idx, -1)} disabled={idx === 0} style={{ background: "none", border: "none", color: idx === 0 ? "#2a2520" : "#6a6155", fontFamily: "var(--mono)", fontSize: "0.6rem", cursor: idx === 0 ? "default" : "pointer", padding: "0 4px", lineHeight: 1 }} title="Flytt opp">↑</button>
                  <button onClick={() => move(type, idx, 1)} disabled={idx === items.length - 1} style={{ background: "none", border: "none", color: idx === items.length - 1 ? "#2a2520" : "#6a6155", fontFamily: "var(--mono)", fontSize: "0.6rem", cursor: idx === items.length - 1 ? "default" : "pointer", padding: "0 4px", lineHeight: 1 }} title="Flytt ned">↓</button>
                  <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: "none", color: "#4a423a", fontFamily: "var(--mono)", fontSize: "0.65rem", cursor: "pointer", padding: "0 4px", marginTop: 2 }} title="Slett">×</button>
                </div>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: "0.55rem", color: "#4a423a", marginBottom: 2 }}>BESKRIVELSE</div>
                <textarea
                  defaultValue={e.description}
                  onBlur={(ev) => ev.target.value !== e.description && patch(e.id, { description: ev.target.value })}
                  rows={2}
                  placeholder="Oppgaver, ansvar og resultater…"
                  style={{ ...inlineInput, resize: "vertical", fontSize: "0.68rem", color: "#9a8f7a", width: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
