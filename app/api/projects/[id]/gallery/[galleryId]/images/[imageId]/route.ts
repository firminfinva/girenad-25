import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// DELETE - Delete a gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string; imageId: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    // Verify the image belongs to the gallery and project
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.imageId },
      include: {
        gallery: true,
      },
    });

    if (!image) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    if (image.gallery.id !== params.galleryId) {
      return NextResponse.json(
        { error: "Cette image n'appartient pas à cette galerie" },
        { status: 403 }
      );
    }

    if (image.gallery.projectId !== params.id) {
      return NextResponse.json(
        { error: "Cette image n'appartient pas à ce projet" },
        { status: 403 }
      );
    }

    await prisma.galleryImage.delete({
      where: { id: params.imageId },
    });

    return NextResponse.json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}
