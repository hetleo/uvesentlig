import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, content, ingress, tags, published } = body;

  if (!title) return NextResponse.json({ error: "Tittel er påkrevd" }, { status: 400 });

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content: content ?? "",
      ingress: ingress ?? "",
      tags: tags ?? "",
      published: published ?? false,
      publishedAt: published ? new Date() : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
