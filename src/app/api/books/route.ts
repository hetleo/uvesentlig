import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, author, year, isbn, status, location, progress, coverUrl, notes } = body;

  if (!title || !author) return NextResponse.json({ error: "Tittel og forfatter er påkrevd" }, { status: 400 });

  const book = await prisma.book.create({
    data: {
      title,
      author,
      year: year ?? "",
      isbn: isbn ?? "",
      status: status ?? "ikke lest",
      location: location ?? "",
      progress: progress ?? 0,
      coverUrl: coverUrl ?? "",
      notes: notes ?? "",
    },
  });

  return NextResponse.json(book, { status: 201 });
}
