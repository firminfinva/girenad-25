import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get a single activity
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        programs: {
          orderBy: {
            order: "asc",
          },
        },
        organizations: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activité non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'activité" },
      { status: 500 }
    );
  }
}

// PATCH - Update an activity
export async function PATCH(
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

    const body = await request.json();
    const { title, description, date, location, imageUrl, status, projectId } =
      body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (location !== undefined) updateData.location = location;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (status) updateData.status = status;
    if (projectId !== undefined) updateData.projectId = projectId;

    const activity = await prisma.activity.update({
      where: { id: params.id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'activité" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an activity
export async function DELETE(
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

    await prisma.activity.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Activité supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'activité" },
      { status: 500 }
    );
  }
}
