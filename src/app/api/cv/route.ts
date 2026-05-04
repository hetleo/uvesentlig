import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.cvEntry.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { type, title, employer, period, description, sortOrder } = body;
  if (!type || !title || !period) return NextResponse.json({ error: "type, title og period er påkrevd" }, { status: 400 });

  const entry = await prisma.cvEntry.create({ data: { type, title, employer: employer ?? "", period, description: description ?? "", sortOrder: sortOrder ?? 0 } });
  return NextResponse.json(entry, { status: 201 });
}
