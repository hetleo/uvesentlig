import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, author, year, isbn, status, location, progress, coverUrl, notes } = body;

  const book = await prisma.book.update({
    where: { id: parseInt(id) },
    data: { title, author, year, isbn, status, location, progress, coverUrl, notes },
  });

  return NextResponse.json(book);
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.book.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
