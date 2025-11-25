import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List all team members
export async function GET(request: NextRequest) {
  try {
    const teamMembers = await prisma.teamMember.findMany({
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
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des membres de l'équipe" },
      { status: 500 }
    );
  }
}

// POST - Create a new team member
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
    const {
      userId,
      role,
      bio,
      imageUrl,
      linkedinUrl,
      twitterUrl,
      order,
      featured,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "L'utilisateur est requis" },
        { status: 400 }
      );
    }

    // Verify user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Check if user is already a team member
    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { userId },
    });

    if (existingTeamMember) {
      return NextResponse.json(
        { error: "Cet utilisateur est déjà membre de l'équipe" },
        { status: 400 }
      );
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        userId,
        role: role || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
        linkedinUrl: linkedinUrl || null,
        twitterUrl: twitterUrl || null,
        order: order || 0,
        featured: featured || false,
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

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du membre de l'équipe" },
      { status: 500 }
    );
  }
}
