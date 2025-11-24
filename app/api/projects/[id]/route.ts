import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Get a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find project by database ID
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        specificObjectives: {
          orderBy: {
            order: "asc",
          },
        },
        mainActivities: {
          orderBy: {
            order: "asc",
          },
        },
        partners: true,
        expectedResults: {
          orderBy: {
            order: "asc",
          },
        },
        galleries: {
          include: {
            images: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    );
  }
}

// PATCH - Update a project
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
    const {
      title,
      overview,
      context,
      generalObjective,
      interventionArea,
      duration,
      beneficiaries,
      status,
      specificObjectives,
      mainActivities,
      partners,
      expectedResults,
    } = body;

    // Start a transaction to update project and related entities
    const project = await prisma.$transaction(async (tx) => {
      // Update project basic info
      const updatedProject = await tx.project.update({
        where: { id: params.id },
        data: {
          ...(title && { title }),
          ...(overview && { overview }),
          ...(context && { context }),
          ...(generalObjective && { generalObjective }),
          ...(interventionArea !== undefined && { interventionArea }),
          ...(duration !== undefined && { duration }),
          ...(beneficiaries !== undefined && { beneficiaries }),
          ...(status && { status }),
        },
      });

      // Update related entities if provided
      if (specificObjectives !== undefined) {
        // Delete existing and create new
        await tx.specificObjective.deleteMany({
          where: { projectId: params.id },
        });
        if (specificObjectives.length > 0) {
          await tx.specificObjective.createMany({
            data: specificObjectives.map(
              (obj: { content: string; order: number }, index: number) => ({
                projectId: params.id,
                content: obj.content,
                order: obj.order !== undefined ? obj.order : index + 1,
              })
            ),
          });
        }
      }

      if (mainActivities !== undefined) {
        await tx.mainActivity.deleteMany({
          where: { projectId: params.id },
        });
        if (mainActivities.length > 0) {
          await tx.mainActivity.createMany({
            data: mainActivities.map(
              (act: { content: string; order: number }, index: number) => ({
                projectId: params.id,
                content: act.content,
                order: act.order !== undefined ? act.order : index + 1,
              })
            ),
          });
        }
      }

      if (partners !== undefined) {
        await tx.partner.deleteMany({
          where: { projectId: params.id },
        });
        if (partners.length > 0) {
          await tx.partner.createMany({
            data: partners.map((partner: { name: string; type: string }) => ({
              projectId: params.id,
              name: partner.name,
              type: partner.type as any,
            })),
          });
        }
      }

      if (expectedResults !== undefined) {
        await tx.expectedResult.deleteMany({
          where: { projectId: params.id },
        });
        if (expectedResults.length > 0) {
          await tx.expectedResult.createMany({
            data: expectedResults.map(
              (result: { content: string; order: number }, index: number) => ({
                projectId: params.id,
                content: result.content,
                order: result.order !== undefined ? result.order : index + 1,
              })
            ),
          });
        }
      }

      // Return project with all relations
      return await tx.project.findUnique({
        where: { id: params.id },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          specificObjectives: true,
          mainActivities: true,
          partners: true,
          expectedResults: true,
        },
      });
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
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

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
}
