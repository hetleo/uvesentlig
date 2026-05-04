import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/markdown";
import AdminShell from "../../AdminShell";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  return (
    <AdminShell active="blogg" session={session}>
      <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em", marginBottom: 16 }}>
        BLOGG / NYTT INNLEGG
      </div>
      <NewPostForm />
    </AdminShell>
  );
}
