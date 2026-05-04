"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookModel as Book } from "@/generated/prisma/models";

const STATUS_OPTIONS = ["leser", "lest", "utlånt", "forlatt", "ikke lest"];
const LOCATION_OPTIONS = ["kontor", "stue", "e-bok", "utlånt", "lagret"];

interface BooksAdminProps {
  initialBooks: Book[];
}

export default function BooksAdmin({ initialBooks }: BooksAdminProps) {
  const router = useRouter();
  const [books, setBooks] = useState(initialBooks);
  const [isbn, setIsbn] = useState("");
  const [isbnResult, setIsbnResult] = useState<{ title: string; author: string; year: string; coverUrl: string } | null>(null);
  const [isbnError, setIsbnError] = useState("");
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", author: "", year: "", isbn: "", status: "ikke lest", location: "", progress: 0, coverUrl: "", notes: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function lookupISBN() {
    if (!isbn.trim()) return;
    setIsbnLoading(true);
    setIsbnError("");
    setIsbnResult(null);
    const res = await fetch(`/api/isbn?isbn=${encodeURIComponent(isbn.trim())}`);
    const json = await res.json();
    setIsbnLoading(false);
    if (!res.ok) { setIsbnError(json.error ?? "Ikke funnet"); return; }
    setIsbnResult(json);
    setForm((f) => ({ ...f, title: json.title, author: json.author, year: json.year, isbn: isbn.trim(), coverUrl: json.coverUrl }));
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Feil"); return; }
    setBooks((prev) => [...prev, json]);
    setForm({ title: "", author: "", year: "", isbn: "", status: "ikke lest", location: "", progress: 0, coverUrl: "", notes: "" });
    setIsbn("");
    setIsbnResult(null);
    setShowForm(false);
    router.refresh();
  }

  async function deleteBook(id: number) {
    if (!confirm("Slett boken?")) return;
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    }
  }

  async function updateBookStatus(book: Book, status: string) {
    const res = await fetch(`/api/books/${book.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...book, status }),
    });
    if (res.ok) {
      setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, status } : b));
    }
  }

  const inputStyle = {
    background: "#15110e",
    border: "0.6px solid #3d3630",
    color: "#e8e0d0",
    fontFamily: "var(--mono)",
    fontSize: "0.75rem",
    padding: "5px 8px",
    outline: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
          BØKER · {books.length} TOTALT
        </div>
        <button
          onClick={() => setShowForm((f) => !f)}
          style={{ border: "0.6px solid var(--accent)", color: "var(--accent)", background: "none", fontFamily: "var(--mono)", fontSize: "0.68rem", padding: "4px 12px", cursor: "pointer" }}
        >
          + legg til bok
        </button>
      </div>

      {/* ISBN lookup */}
      <div style={{ background: "#15110e", border: "0.6px solid #3d3630", padding: 14, marginBottom: 20 }} id="isbn">
        <div style={{ fontSize: "0.65rem", color: "#9a8f7a", marginBottom: 10, letterSpacing: "0.05em" }}>
          ISBN-OPPSLAG
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookupISBN()}
            placeholder="ISBN: 9781234567890"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={lookupISBN}
            disabled={isbnLoading}
            style={{ ...inputStyle, cursor: "pointer", whiteSpace: "nowrap", padding: "5px 12px" }}
          >
            {isbnLoading ? "søker…" : "hent fra Google Books →"}
          </button>
        </div>
        {isbnError && (
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)", marginTop: 6 }}>
            {isbnError}
          </div>
        )}
        {isbnResult && (
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "#9a8f7a", marginTop: 6 }}>
            ↳ {isbnResult.title} · {isbnResult.author} · {isbnResult.year} {isbnResult.coverUrl ? "· omslag funnet ✓" : ""}
          </div>
        )}
      </div>

      {/* Add book form */}
      {showForm && (
        <div style={{ background: "#15110e", border: "0.6px solid #3d3630", padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: "0.65rem", color: "#9a8f7a", marginBottom: 12, letterSpacing: "0.05em" }}>NY BOK</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>TITTEL</div>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>FORFATTER</div>
              <input type="text" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>ÅR</div>
              <input type="text" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>STATUS</div>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, width: "100%" }}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>PLASSERING</div>
              <select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} style={{ ...inputStyle, width: "100%" }}>
                <option value="">—</option>
                {LOCATION_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.58rem", color: "#6a6155", marginBottom: 3 }}>FREMDRIFT %</div>
              <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm((f) => ({ ...f, progress: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: "100%" }} />
            </div>
          </div>
          {error && <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)", marginBottom: 8 }}>{error}</div>}
          <button onClick={handleSave} disabled={saving} style={{ border: "0.6px solid var(--accent)", color: "var(--accent)", background: "none", fontFamily: "var(--mono)", fontSize: "0.68rem", padding: "5px 14px", cursor: "pointer" }}>
            {saving ? "lagrer…" : "legg til bok"}
          </button>
        </div>
      )}

      {/* Books list */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.5fr 0.8fr 0.8fr auto", columnGap: 12, paddingBottom: 6, borderBottom: "0.6px solid #4a423a", fontSize: "0.58rem", color: "#6a6155", letterSpacing: "0.05em" }}>
          <span>TITTEL</span><span>FORFATTER</span><span>ÅR</span><span>STATUS</span><span>PLASSERING</span><span />
        </div>
        {books.map((b) => (
          <div key={b.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.5fr 0.8fr 0.8fr auto", columnGap: 12, padding: "5px 0", borderBottom: "0.4px solid #2a2520", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "#e8e0d0" }}>{b.title}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#9a8f7a" }}>{b.author}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#6a6155" }}>{b.year}</span>
            <select
              value={b.status}
              onChange={(e) => updateBookStatus(b, e.target.value)}
              style={{ background: "transparent", border: "none", color: b.status === "leser" ? "var(--accent)" : "#9a8f7a", fontFamily: "var(--mono)", fontSize: "0.65rem", cursor: "pointer", outline: "none", padding: 0 }}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#6a6155" }}>{b.location}</span>
            <button
              onClick={() => deleteBook(b.id)}
              style={{ background: "none", border: "none", color: "#4a423a", fontFamily: "var(--mono)", fontSize: "0.65rem", cursor: "pointer", padding: "0 4px" }}
              title="Slett"
            >
              ×
            </button>
          </div>
        ))}
        {books.length === 0 && (
          <div style={{ color: "#6a6155", fontSize: "0.78rem", padding: "20px 0" }}>Ingen bøker ennå.</div>
        )}
      </div>
    </div>
  );
}
