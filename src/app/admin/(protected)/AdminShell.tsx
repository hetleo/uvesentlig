"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface AdminShellProps {
  children: React.ReactNode;
  active?: string;
  session: Session | null;
}

const navItems = [
  { id: "dashboard", label: "dashboard", href: "/admin" },
  { id: "blogg", label: "blogg", href: "/admin/blogg", count: null },
  { id: "prosjekter", label: "prosjekter", href: "/admin/prosjekter" },
  { id: "boker", label: "bøker", href: "/admin/boker" },
  { id: "isbn", label: "isbn-oppslag", href: "/admin/boker#isbn" },
  { id: "cv", label: "cv", href: "/admin/cv" },
];

export default function AdminShell({ children, active, session }: AdminShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1c1815",
        color: "#e8e0d0",
        fontFamily: "var(--mono)",
        fontSize: "0.8rem",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "0.8px solid #4a423a",
          padding: "10px 24px",
        }}
      >
        <span style={{ fontSize: "0.72rem", letterSpacing: "0.05em", color: "#e8e0d0" }}>
          ADMIN · LEON
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link
            href="/"
            style={{ fontSize: "0.65rem", color: "#9a8f7a" }}
            target="_blank"
          >
            vis nettsted →
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/logg-inn" })}
            style={{
              background: "none",
              border: "none",
              color: "#9a8f7a",
              fontSize: "0.65rem",
              cursor: "pointer",
              fontFamily: "var(--mono)",
            }}
          >
            logg ut
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", minHeight: "calc(100vh - 42px)" }}>
        {/* Sidebar */}
        <div style={{ borderRight: "0.6px solid #3d3630", padding: "20px 0" }}>
          <div style={{ fontSize: "0.6rem", color: "#9a8f7a", letterSpacing: "0.06em", padding: "0 16px", marginBottom: 6 }}>
            NAVIGASJON
          </div>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: "block",
                padding: "4px 16px",
                fontSize: "0.72rem",
                color: active === item.id ? "#e8e0d0" : "#9a8f7a",
                borderLeft: active === item.id ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              · {item.label}
            </Link>
          ))}
        </div>

        {/* Main */}
        <div style={{ padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
