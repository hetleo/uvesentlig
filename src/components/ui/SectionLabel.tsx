export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.07em",
          color: "var(--accent)",
          textTransform: "uppercase" as const,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "var(--hair)",
          opacity: 0.2,
        }}
      />
    </div>
  );
}
