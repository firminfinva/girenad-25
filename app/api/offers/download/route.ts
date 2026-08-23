import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const offer = await prisma.jobOffer.findUnique({ where: { id } });
    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!offer.pdfUrl) return NextResponse.json({ error: "No PDF available" }, { status: 404 });

    // Try to increment download count. If Prisma client/schema isn't in sync
    // this may throw — log and continue.
    try {
      await prisma.jobOffer.update({ where: { id }, data: { downloadCount: (offer as any).downloadCount ? (offer as any).downloadCount + 1 : 1 } as any });
    } catch (err) {
      console.error("Failed to increment downloadCount (continuing):", err);
    }

    // Fetch the remote PDF and stream it back with a Content-Disposition header
    try {
      const fetched = await fetch(offer.pdfUrl as string);
      if (!fetched.ok) {
        console.error("Failed to fetch remote PDF", fetched.status);
        return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 502 });
      }

      // Build a safe filename: use title if available, fall back to id
      const rawTitle = (offer.title as string) || id;
      const safeTitle = rawTitle.replace(/[^a-z0-9\-_ ]+/gi, "").replace(/\s+/g, "_").slice(0, 120) || id;
      const filename = `${safeTitle}.pdf`;

      const headers: Record<string, string> = {
        "Content-Type": fetched.headers.get("content-type") || "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      };

      const body = fetched.body;
      return new NextResponse(body, { headers });
    } catch (err) {
      console.error("Error proxying PDF:", err);
      // As a fallback, redirect to the original URL
      return NextResponse.redirect(offer.pdfUrl as string);
    }
  } catch (err) {
    console.error("Error in download endpoint:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
