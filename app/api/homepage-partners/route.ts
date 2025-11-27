import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List all homepage partners
// Public: returns only active partners
// Admin/Moderator: returns all partners
export async function GET(request: NextRequest) {
  try {
    // Try to get user, but don't fail if no token (public endpoint)
    let isAdmin = false;
    try {
      const user = await verifyToken(request);
      isAdmin = user ? isAdminOrModerator(user.role) : false;
    } catch (tokenError) {
      // No token or invalid token - treat as public user
      isAdmin = false;
    }

    const partners = await prisma.homepagePartner.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching homepage partners:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", errorMessage);
    console.error("Error stack:", errorStack);
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des partenaires",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create a new homepage partner (admin/moderator only)
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
    const { name, logo, website, description, order, active } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Le nom du partenaire est requis" },
        { status: 400 }
      );
    }

    const partner = await prisma.homepagePartner.create({
      data: {
        name,
        logo: logo || null,
        website: website || null,
        description: description || null,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error("Error creating homepage partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du partenaire" },
      { status: 500 }
    );
  }
}

