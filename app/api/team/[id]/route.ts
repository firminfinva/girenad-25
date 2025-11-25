import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Get a single team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Membre de l'équipe non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du membre de l'équipe" },
      { status: 500 }
    );
  }
}

// PATCH - Update a team member
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
    const { role, bio, imageUrl, linkedinUrl, twitterUrl, order, featured } =
      body;

    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        ...(role !== undefined && { role: role || null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl || null }),
        ...(twitterUrl !== undefined && { twitterUrl: twitterUrl || null }),
        ...(order !== undefined && { order }),
        ...(featured !== undefined && { featured }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du membre de l'équipe" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a team member
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

    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Membre de l'équipe supprimé avec succès",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du membre de l'équipe" },
      { status: 500 }
    );
  }
}
