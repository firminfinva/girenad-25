import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get a single homepage partner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partner = await prisma.homepagePartner.findUnique({
      where: { id: params.id },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partenaire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error fetching homepage partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du partenaire" },
      { status: 500 }
    );
  }
}

// PATCH - Update a homepage partner
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
    const { name, logo, website, description, order, active } = body;

    const partner = await prisma.homepagePartner.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(logo !== undefined && { logo: logo || null }),
        ...(website !== undefined && { website: website || null }),
        ...(description !== undefined && { description: description || null }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error updating homepage partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du partenaire" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a homepage partner
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

    await prisma.homepagePartner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Partenaire supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting homepage partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du partenaire" },
      { status: 500 }
    );
  }
}

