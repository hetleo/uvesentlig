import type { CSSProperties } from "react";

interface TagProps {
  children: React.ReactNode;
  color?: string;
  style?: CSSProperties;
}

export default function Tag({ children, color, style }: TagProps) {
  const c = color ?? "var(--muted)";
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.04em",
        color: c,
        border: `0.8px solid ${c}`,
        padding: "1px 7px",
        borderRadius: 999,
        marginRight: 4,
        whiteSpace: "nowrap" as const,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
