import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import AdminShell from "../../AdminShell";
import EditPostForm from "./EditPostForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [session, post] = await Promise.all([
    getServerSession(authOptions),
    prisma.post.findUnique({ where: { id: parseInt(id) } }),
  ]);
  if (!post) notFound();

  return (
    <AdminShell active="blogg" session={session}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
          BLOGG / REDIGER INNLEGG
        </div>
        {post.published && (
          <Link
            href={`/blogg/${post.slug}`}
            target="_blank"
            style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#9a8f7a" }}
          >
            vis publisert →
          </Link>
        )}
      </div>
      <EditPostForm post={post} />
    </AdminShell>
  );
}
