import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all programs for an activity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const programs = await prisma.program.findMany({
      where: { activityId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des programmes" },
      { status: 500 }
    );
  }
}

// PUT - Update all programs for an activity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    const programs = await request.json();

    // Delete existing programs
    await prisma.program.deleteMany({
      where: { activityId: id },
    });

    // Create new programs
    const createdPrograms = await prisma.$transaction(
      programs.map((program: { time: string; event: string; order: number }) =>
        prisma.program.create({
          data: {
            time: program.time,
            event: program.event,
            order: program.order,
            activityId: id,
          },
        })
      )
    );

    return NextResponse.json(createdPrograms);
  } catch (error) {
    console.error("Error updating programs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des programmes" },
      { status: 500 }
    );
  }
}

