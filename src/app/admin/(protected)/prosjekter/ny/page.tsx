import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "../../AdminShell";
import ProjectForm from "../ProjectForm";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  return (
    <AdminShell active="prosjekter" session={session}>
      <div style={{ color: "#9a8f7a", fontSize: "0.68rem", letterSpacing: "0.05em", marginBottom: 16 }}>
        PROSJEKTER / NYTT PROSJEKT
      </div>
      <ProjectForm />
    </AdminShell>
  );
}
