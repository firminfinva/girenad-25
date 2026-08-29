import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE - Delete a gallery (activite) and all its images
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; galleryId: string }> }
) {
  try {
    const { id, galleryId } = await params;
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    // Verify the gallery belongs to the project
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Galerie non trouvée" },
        { status: 404 }
      );
    }

    if (gallery.projectId !== id) {
      return NextResponse.json(
        { error: "Cette galerie n'appartient pas à ce projet" },
        { status: 403 }
      );
    }

    // Delete gallery (cascade will delete all images)
    await prisma.gallery.delete({
      where: { id: galleryId },
    });

    return NextResponse.json({ message: "Galerie supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la galerie" },
      { status: 500 }
    );
  }
}

// PATCH - Update a gallery (activite)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; galleryId: string }> }
) {
  try {
    const { id, galleryId } = await params;
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    // Verify the gallery belongs to the project
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Galerie non trouvée" },
        { status: 404 }
      );
    }

    if (gallery.projectId !== id) {
      return NextResponse.json(
        { error: "Cette galerie n'appartient pas à ce projet" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, order } = body;

    const updated = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(description !== undefined && { description: description || null }),
        ...(order !== undefined && { order }),
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la galerie" },
      { status: 500 }
    );
  }
}
