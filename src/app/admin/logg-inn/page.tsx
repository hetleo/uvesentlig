"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Feil passord.");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1c1815",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#15110e",
          border: "0.6px solid #3d3630",
          padding: "2rem",
          width: 320,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.75rem",
            color: "#9a8f7a",
            letterSpacing: "0.06em",
            marginBottom: 20,
          }}
        >
          ADMIN · LEON
        </div>

        <label
          style={{
            display: "block",
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            color: "#9a8f7a",
            marginBottom: 6,
          }}
        >
          PASSORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            background: "#1c1815",
            border: "0.6px solid #3d3630",
            color: "#e8e0d0",
            fontFamily: "var(--mono)",
            fontSize: "0.85rem",
            padding: "8px 10px",
            marginBottom: 14,
            outline: "none",
          }}
        />

        {error && (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.68rem",
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: "transparent",
            border: `0.6px solid ${loading ? "#3d3630" : "var(--accent)"}`,
            color: loading ? "#6a6155" : "var(--accent)",
            fontFamily: "var(--mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            padding: "8px",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "LOGGER INN…" : "LOGG INN"}
        </button>
      </form>
    </div>
  );
}
