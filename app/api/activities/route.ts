import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List all activities
export async function GET(request: NextRequest) {
  try {
    const activities = await prisma.activity.findMany({
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
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des activités" },
      { status: 500 }
    );
  }
}

// POST - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, date, location, status, projectId } = body;

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Les champs obligatoires sont manquants" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        date: new Date(date),
        location: location || null,
        status: status || "UPCOMING",
        creatorId: user.userId,
        projectId: projectId || null,
      },
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

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'activité" },
      { status: 500 }
    );
  }
}
