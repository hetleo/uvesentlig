"use client";

import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Slett «${name}»?`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "none",
        border: "none",
        color: "#4a423a",
        fontFamily: "var(--mono)",
        fontSize: "0.65rem",
        cursor: "pointer",
        padding: "0 4px",
      }}
      title="Slett"
    >
      ×
    </button>
  );
}
