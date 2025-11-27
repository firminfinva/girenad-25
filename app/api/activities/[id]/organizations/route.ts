import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all organizations for an activity
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizations = await prisma.activityOrganization.findMany({
      where: { activityId: params.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des organisations" },
      { status: 500 }
    );
  }
}

// PUT - Update all organizations for an activity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    const organizations = await request.json();

    // Delete existing organizations
    await prisma.activityOrganization.deleteMany({
      where: { activityId: params.id },
    });

    // Create new organizations
    const createdOrganizations = await prisma.$transaction(
      organizations.map(
        (org: { name: string; order: number }) =>
          prisma.activityOrganization.create({
            data: {
              name: org.name,
              order: org.order,
              activityId: params.id,
            },
          })
      )
    );

    return NextResponse.json(createdOrganizations);
  } catch (error) {
    console.error("Error updating organizations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des organisations" },
      { status: 500 }
    );
  }
}

