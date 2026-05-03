import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import AdminShell from "../AdminShell";
import BooksAdmin from "./BooksAdmin";

export default async function AdminBooksPage() {
  const [session, books] = await Promise.all([
    getServerSession(authOptions),
    prisma.book.findMany({ orderBy: [{ status: "asc" }, { title: "asc" }] }),
  ]);

  return (
    <AdminShell active="boker" session={session}>
      <BooksAdmin initialBooks={books} />
    </AdminShell>
  );
}
