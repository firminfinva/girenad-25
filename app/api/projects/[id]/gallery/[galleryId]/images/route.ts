import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all images for a gallery
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        galleryId: params.galleryId,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des images" },
      { status: 500 }
    );
  }
}

// POST - Add an image to a gallery
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; galleryId: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    // Verify gallery belongs to project
    const gallery = await prisma.gallery.findUnique({
      where: { id: params.galleryId },
      include: {
        images: true,
      },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Galerie non trouvée" },
        { status: 404 }
      );
    }

    if (gallery.projectId !== params.id) {
      return NextResponse.json(
        { error: "Cette galerie n'appartient pas à ce projet" },
        { status: 403 }
      );
    }

    // Check if gallery already has 6 images
    if (gallery.images.length >= 6) {
      return NextResponse.json(
        { error: "Une galerie ne peut contenir que 6 images maximum" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { imageUrl, altText } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "L'URL de l'image est requise" },
        { status: 400 }
      );
    }

    // Get the highest order number for images in this gallery
    const maxImageOrder = await prisma.galleryImage.findFirst({
      where: {
        galleryId: params.galleryId,
      },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    // Create the image
    const galleryImage = await prisma.galleryImage.create({
      data: {
        imageUrl,
        altText: altText || null,
        order: maxImageOrder ? maxImageOrder.order + 1 : 0,
        galleryId: params.galleryId,
      },
    });

    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'image" },
      { status: 500 }
    );
  }
}
