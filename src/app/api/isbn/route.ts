import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isbn = request.nextUrl.searchParams.get("isbn");
  if (!isbn) return NextResponse.json({ error: "ISBN required" }, { status: 400 });

  try {
    const key = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1${key ? `&key=${key}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });

    const info = item.volumeInfo;
    return NextResponse.json({
      title: info.title ?? "",
      author: (info.authors ?? []).join(", "),
      year: info.publishedDate?.slice(0, 4) ?? "",
      coverUrl: info.imageLinks?.thumbnail ?? "",
      isbn,
    });
  } catch {
    return NextResponse.json({ error: "Feil ved oppslag" }, { status: 500 });
  }
}
