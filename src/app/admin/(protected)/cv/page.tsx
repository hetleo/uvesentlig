import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminShell from "../AdminShell";
import CvAdmin from "./CvAdmin";

export default async function AdminCvPage() {
  const session = await getServerSession(authOptions);
  const entries = await prisma.cvEntry.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return (
    <AdminShell active="cv" session={session}>
      <CvAdmin initialEntries={entries} />
    </AdminShell>
  );
}
