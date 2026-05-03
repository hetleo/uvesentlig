import Link from "next/link";
import Hair from "@/components/ui/Hair";

interface TopNavProps {
  active?: string;
}

const items = [
  { href: "/blogg", label: "blogg" },
  { href: "/prosjekter", label: "prosjekter" },
  { href: "/bibliotek", label: "bibliotek" },
  { href: "/cv", label: "cv" },
];

export default function TopNav({ active }: TopNavProps) {
  return (
    <nav style={{ marginBottom: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--hand)",
            fontSize: "1.5rem",
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          Uvesentlig
        </Link>
        <div style={{ display: "flex", gap: 18 }}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.04em",
                color: active === item.label ? "var(--ink)" : "var(--muted)",
                borderBottom:
                  active === item.label
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
                paddingBottom: 1,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <Hair />
    </nav>
  );
}
