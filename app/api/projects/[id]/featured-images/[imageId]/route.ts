import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH - Update a featured image
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
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
    const { imageUrl, altText, order } = body;

    const featuredImage = await prisma.projectFeaturedImage.update({
      where: { id: params.imageId },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(altText !== undefined && { altText }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(featuredImage);
  } catch (error) {
    console.error("Error updating featured image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la photo phare" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a featured image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    await prisma.projectFeaturedImage.delete({
      where: { id: params.imageId },
    });

    return NextResponse.json({ message: "Photo phare supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting featured image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la photo phare" },
      { status: 500 }
    );
  }
}

