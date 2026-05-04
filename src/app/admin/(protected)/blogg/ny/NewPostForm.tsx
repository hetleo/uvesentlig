"use client";

import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export default function NewPostForm() {
  const router = useRouter();

  async function handleSave(data: {
    title: string;
    content: string;
    ingress: string;
    tags: string;
    published: boolean;
  }) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error ?? "Feil ved lagring" };
    router.push(`/admin/blogg/${json.id}`);
    return {};
  }

  return <MarkdownEditor onSave={handleSave} submitLabel="Publiser" />;
}
