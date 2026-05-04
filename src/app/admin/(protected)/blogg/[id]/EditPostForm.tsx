"use client";

import { useRouter } from "next/navigation";
import type { PostModel as Post } from "@/generated/prisma/models";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();

  async function handleSave(data: {
    title: string;
    content: string;
    ingress: string;
    tags: string;
    published: boolean;
  }) {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error ?? "Feil ved lagring" };
    router.refresh();
    return {};
  }

  return (
    <MarkdownEditor
      initialTitle={post.title}
      initialContent={post.content}
      initialIngress={post.ingress}
      initialTags={post.tags}
      initialPublished={post.published}
      onSave={handleSave}
    />
  );
}
