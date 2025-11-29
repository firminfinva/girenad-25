import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH - Update daily work (mark as complete/incomplete)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { completed, title, description } = body;

    // Check if daily work exists and belongs to user
    const dailyWork = await prisma.dailyWork.findUnique({
      where: { id: params.id },
    });

    if (!dailyWork) {
      return NextResponse.json(
        { error: "Travail quotidien non trouvé" },
        { status: 404 }
      );
    }

    if (dailyWork.userId !== user.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (completed !== undefined) {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date() : null;
    }
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const updatedWork = await prisma.dailyWork.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedWork);
  } catch (error) {
    console.error("Error updating daily work:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du travail quotidien" },
      { status: 500 }
    );
  }
}

// DELETE - Delete daily work
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Check if daily work exists and belongs to user
    const dailyWork = await prisma.dailyWork.findUnique({
      where: { id: params.id },
    });

    if (!dailyWork) {
      return NextResponse.json(
        { error: "Travail quotidien non trouvé" },
        { status: 404 }
      );
    }

    if (dailyWork.userId !== user.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    await prisma.dailyWork.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Travail quotidien supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting daily work:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du travail quotidien" },
      { status: 500 }
    );
  }
}

