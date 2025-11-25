import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Get all featured images for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const featuredImages = await prisma.projectFeaturedImage.findMany({
      where: { projectId: params.id },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(featuredImages);
  } catch (error) {
    console.error("Error fetching featured images:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des photos phares" },
      { status: 500 }
    );
  }
}

// POST - Create a new featured image
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

    const body = await request.json();
    const { imageUrl, altText, order } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "L'URL de l'image est requise" },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }

    // Get max order to set default
    const maxOrder = await prisma.projectFeaturedImage.findFirst({
      where: { projectId: params.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const featuredImage = await prisma.projectFeaturedImage.create({
      data: {
        projectId: params.id,
        imageUrl,
        altText: altText || null,
        order: order !== undefined ? order : (maxOrder?.order || 0) + 1,
      },
    });

    return NextResponse.json(featuredImage, { status: 201 });
  } catch (error) {
    console.error("Error creating featured image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la photo phare" },
      { status: 500 }
    );
  }
}

