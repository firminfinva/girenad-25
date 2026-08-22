import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = await request.json();

    const data = {
      title: body.title,
      referenceNumber: body.referenceNumber || null,
      contractType: body.contractType || null,
      vacanciesCount: body.vacanciesCount ? Number(body.vacanciesCount) : null,
      location: body.location || null,
      duration: body.duration || null,
      recruitmentType: body.recruitmentType || null,
      startDate: body.startDate || null,
      organizationDescription: body.organizationDescription || null,
      projectDescription: body.projectDescription || null,
      positionObjective: body.positionObjective || null,
      responsibilities: body.responsibilities || null,
      requirements: body.requirements || null,
      applicationDocuments: body.applicationDocuments || null,
      submissionDeadline: body.submissionDeadline
        ? new Date(body.submissionDeadline)
        : null,
      submissionEmail: body.submissionEmail || null,
      emailSubjectFormat: body.emailSubjectFormat || null,
      pdfUrl: body.pdfUrl || null,
    };

    const created = await prisma.jobOffer.create({ data });

    return NextResponse.json({ offer: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const offer = await prisma.jobOffer.findUnique({ where: { id } });
      if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ offer });
    }

    const offers = await prisma.jobOffer.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = await request.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const data: any = {};
    // Only copy fields that exist in the body (simple permissive update)
    const updatable = [
      "title",
      "referenceNumber",
      "contractType",
      "vacanciesCount",
      "location",
      "duration",
      "recruitmentType",
      "startDate",
      "organizationDescription",
      "projectDescription",
      "positionObjective",
      "responsibilities",
      "requirements",
      "applicationDocuments",
      "submissionDeadline",
      "submissionEmail",
      "emailSubjectFormat",
      "pdfUrl",
    ];

    for (const key of updatable) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    if (data.submissionDeadline) data.submissionDeadline = new Date(data.submissionDeadline);

    const updated = await prisma.jobOffer.update({ where: { id }, data });

    return NextResponse.json({ offer: updated });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur" },
      { status: 500 }
    );
  }
}
