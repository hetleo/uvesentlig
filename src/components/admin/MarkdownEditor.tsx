"use client";

import { useState, useCallback } from "react";
import { renderMarkdown } from "@/lib/markdown";

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialIngress?: string;
  initialTags?: string;
  initialPublished?: boolean;
  onSave: (data: {
    title: string;
    content: string;
    ingress: string;
    tags: string;
    published: boolean;
  }) => Promise<{ error?: string }>;
  submitLabel?: string;
}

export default function MarkdownEditor({
  initialTitle = "",
  initialContent = "",
  initialIngress = "",
  initialTags = "",
  initialPublished = false,
  onSave,
  submitLabel = "Lagre",
}: MarkdownEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [ingress, setIngress] = useState(initialIngress);
  const [tags, setTags] = useState(initialTags);
  const [published, setPublished] = useState(initialPublished);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [tab, setTab] = useState<"editor" | "preview">("editor");

  const preview = renderMarkdown(content);

  const handleSave = useCallback(
    async (pub: boolean) => {
      setSaving(true);
      setError("");
      const result = await onSave({ title, content, ingress, tags, published: pub });
      setSaving(false);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(`Lagret ${new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}`);
        setPublished(pub);
        setTimeout(() => setSaved(""), 4000);
      }
    },
    [title, content, ingress, tags, onSave]
  );

  const inputStyle = {
    background: "#15110e",
    border: "0.6px solid #3d3630",
    color: "#e8e0d0",
    fontFamily: "var(--mono)",
    fontSize: "0.8rem",
    padding: "6px 10px",
    width: "100%",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tittel"
        style={{ ...inputStyle, fontSize: "0.95rem", padding: "8px 10px" }}
      />

      <input
        type="text"
        value={ingress}
        onChange={(e) => setIngress(e.target.value)}
        placeholder="Ingress (kort sammendrag)"
        style={inputStyle}
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (kommaseparert: fugl, hage, kode)"
        style={inputStyle}
      />

      {/* Editor / Preview tabs */}
      <div>
        <div style={{ display: "flex", borderBottom: "0.6px solid #3d3630", marginBottom: 0 }}>
          {(["editor", "preview"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                padding: "5px 12px",
                fontFamily: "var(--mono)",
                fontSize: "0.65rem",
                color: tab === t ? "#e8e0d0" : "#6a6155",
                cursor: "pointer",
                borderBottom: tab === t ? "1px solid var(--accent)" : "1px solid transparent",
                letterSpacing: "0.05em",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "editor" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"# Overskrift\n\nSkriv Markdown her…"}
            rows={22}
            style={{
              ...inputStyle,
              fontFamily: "var(--mono)",
              fontSize: "0.8rem",
              lineHeight: 1.6,
              resize: "vertical",
              display: "block",
              borderTop: "none",
            }}
          />
        ) : (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: preview }}
            style={{
              background: "var(--paper)",
              color: "var(--ink)",
              padding: "14px 16px",
              minHeight: 300,
              border: "0.6px solid #3d3630",
              borderTop: "none",
            }}
          />
        )}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          style={{
            background: "none",
            border: "0.6px solid #5a5048",
            color: "#e8e0d0",
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            padding: "5px 12px",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          lagre kladd
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          style={{
            background: "none",
            border: "0.6px solid var(--accent)",
            color: "var(--accent)",
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            padding: "5px 12px",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          {published ? "oppdater (publisert)" : "publiser"}
        </button>
        {saving && (
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#6a6155" }}>
            lagrer…
          </span>
        )}
        {saved && (
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#9a8f7a" }}>
            {saved}
          </span>
        )}
        {error && (
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)" }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
