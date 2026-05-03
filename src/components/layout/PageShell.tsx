import type { CSSProperties } from "react";

interface PageShellProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

export default function PageShell({ children, style }: PageShellProps) {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "2.5rem 1.5rem 4rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
