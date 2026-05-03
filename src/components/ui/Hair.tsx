import type { CSSProperties } from "react";

export default function Hair({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      width="100%"
      height="6"
      viewBox="0 0 800 6"
      preserveAspectRatio="none"
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <path
        d="M2 3 Q 80 2.2, 160 3 T 320 3 T 480 3 T 640 3 T 798 3"
        fill="none"
        stroke="var(--hair)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
