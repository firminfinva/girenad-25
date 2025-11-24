import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List all projects
export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}

// POST - Create a new project
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

    if (!title || !overview || !context || !generalObjective) {
      return NextResponse.json(
        { error: "Les champs obligatoires sont manquants" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        overview,
        context,
        generalObjective,
        interventionArea: interventionArea || "",
        duration: duration || "",
        beneficiaries: beneficiaries || "",
        status: status || "PLANNED",
        creatorId: user.userId,
        // Create related entities
        specificObjectives: specificObjectives
          ? {
              create: specificObjectives.map(
                (obj: { content: string; order: number }, index: number) => ({
                  content: obj.content,
                  order: obj.order !== undefined ? obj.order : index + 1,
                })
              ),
            }
          : undefined,
        mainActivities: mainActivities
          ? {
              create: mainActivities.map(
                (act: { content: string; order: number }, index: number) => ({
                  content: act.content,
                  order: act.order !== undefined ? act.order : index + 1,
                })
              ),
            }
          : undefined,
        partners: partners
          ? {
              create: partners.map(
                (partner: { name: string; type: string }) => ({
                  name: partner.name,
                  type: partner.type as any,
                })
              ),
            }
          : undefined,
        expectedResults: expectedResults
          ? {
              create: expectedResults.map(
                (
                  result: { content: string; order: number },
                  index: number
                ) => ({
                  content: result.content,
                  order: result.order !== undefined ? result.order : index + 1,
                })
              ),
            }
          : undefined,
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
        specificObjectives: true,
        mainActivities: true,
        partners: true,
        expectedResults: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    );
  }
}
