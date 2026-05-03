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
  const { name, category, status, description, tags, startedAt, endedAt, links } = body;

  const project = await prisma.project.update({
    where: { id: parseInt(id) },
    data: {
      name,
      category,
      status,
      description,
      tags,
      startedAt: startedAt ? new Date(startedAt) : null,
      endedAt: endedAt ? new Date(endedAt) : null,
      links,
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
