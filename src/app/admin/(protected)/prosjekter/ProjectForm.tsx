"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectModel as Project } from "@/generated/prisma/models";

const STATUS_OPTIONS = ["pågående", "pause", "ferdig", "idé", "forlatt"];

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState(project?.name ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [status, setStatus] = useState(project?.status ?? "idé");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tags, setTags] = useState(project?.tags ?? "");
  const [startedAt, setStartedAt] = useState(
    project?.startedAt ? new Date(project.startedAt).toISOString().slice(0, 10) : ""
  );
  const [endedAt, setEndedAt] = useState(
    project?.endedAt ? new Date(project.endedAt).toISOString().slice(0, 10) : ""
  );
  const [links, setLinks] = useState(project?.links ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    background: "#15110e",
    border: "0.6px solid #3d3630",
    color: "#e8e0d0",
    fontFamily: "var(--mono)",
    fontSize: "0.8rem",
    padding: "6px 10px",
    width: "100%",
    outline: "none",
    marginBottom: 10,
  };

  async function handleSave() {
    setSaving(true);
    setError("");
    const body = { name, category, status, description, tags, startedAt: startedAt || null, endedAt: endedAt || null, links };
    const res = project
      ? await fetch(`/api/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Feil"); return; }
    if (!project) router.push(`/admin/prosjekter/${json.id}`);
    else router.refresh();
  }

  const label = (t: string) => (
    <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "#9a8f7a", marginBottom: 4, letterSpacing: "0.05em" }}>
      {t}
    </div>
  );

  return (
    <div style={{ maxWidth: 540 }}>
      {label("NAVN")}
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 0 }}>
        <div>
          {label("KATEGORI")}
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
        <div>
          {label("STATUS")}
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ height: 10 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          {label("STARTET")}
          <input type="date" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
        <div>
          {label("AVSLUTTET")}
          <input type="date" value={endedAt} onChange={(e) => setEndedAt(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
      </div>

      <div style={{ height: 10 }} />

      {label("TAGS (kommaseparert)")}
      <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />

      {label("LENKER (format: label=url, kommaseparert)")}
      <input type="text" value={links} onChange={(e) => setLinks(e.target.value)} placeholder="GitHub=https://..." style={inputStyle} />

      {label("BESKRIVELSE (Markdown)")}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={8}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      {error && <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--accent)", marginBottom: 10 }}>{error}</div>}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          border: "0.6px solid var(--accent)",
          color: "var(--accent)",
          background: "none",
          fontFamily: "var(--mono)",
          fontSize: "0.68rem",
          padding: "6px 16px",
          cursor: "pointer",
        }}
      >
        {saving ? "lagrer…" : project ? "oppdater" : "opprett prosjekt"}
      </button>
    </div>
  );
}
