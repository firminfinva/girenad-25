import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Get all gallery items for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItems = await prisma.gallery.findMany({
      where: {
        projectId: params.id,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: [
        { title: "asc" }, // Group by title (activite) first
        { order: "asc" }, // Then by order within each activite
      ],
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de la galerie",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// POST - Add a new gallery item to a project
export async function POST(
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

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre de la galerie est requis" },
        { status: 400 }
      );
    }

    // Get the highest order number for galleries in this project
    const maxOrder = await prisma.gallery.findFirst({
      where: {
        projectId: params.id,
      },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    // Create the gallery
    const gallery = await prisma.gallery.create({
      data: {
        title: title,
        description: description || null,
        order: maxOrder ? maxOrder.order + 1 : 0,
        projectId: params.id,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'image" },
      { status: 500 }
    );
  }
}
