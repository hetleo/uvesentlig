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
  const { title, content, ingress, tags, published } = body;

  const existing = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });

  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
      ingress,
      tags,
      published,
      publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
