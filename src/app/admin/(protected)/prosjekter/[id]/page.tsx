import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import AdminShell from "../../AdminShell";
import ProjectForm from "../ProjectForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const [session, project] = await Promise.all([
    getServerSession(authOptions),
    prisma.project.findUnique({ where: { id: parseInt(id) } }),
  ]);
  if (!project) notFound();

  return (
    <AdminShell active="prosjekter" session={session}>
      <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em", marginBottom: 16 }}>
        PROSJEKTER / REDIGER
      </div>
      <ProjectForm project={project} />
    </AdminShell>
  );
}
