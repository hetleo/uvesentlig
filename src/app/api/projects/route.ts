import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, category, status, description, tags, startedAt, endedAt, links } = body;

  if (!name) return NextResponse.json({ error: "Navn er påkrevd" }, { status: 400 });

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const project = await prisma.project.create({
    data: {
      name,
      slug,
      category: category ?? "",
      status: status ?? "idé",
      description: description ?? "",
      tags: tags ?? "",
      startedAt: startedAt ? new Date(startedAt) : null,
      endedAt: endedAt ? new Date(endedAt) : null,
      links: links ?? "",
    },
  });

  return NextResponse.json(project, { status: 201 });
}
