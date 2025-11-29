import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    if (!isAdmin(user.role)) {
      return NextResponse.json(
        { error: "Accès refusé. Administrateur requis." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const status = searchParams.get("status"); // "completed" or "pending"

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (dateFrom || dateTo) {
      where.workDate = {};
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setUTCHours(0, 0, 0, 0);
        where.workDate.gte = fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setUTCHours(23, 59, 59, 999);
        where.workDate.lte = toDate;
      }
    }

    if (status === "completed") {
      where.completed = true;
    } else if (status === "pending") {
      where.completed = false;
    }

    const dailyWork = await prisma.dailyWork.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        workDate: "desc",
      },
    });

    const processedDailyWork = dailyWork.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description,
      completed: work.completed,
      workDate: work.workDate.toISOString(),
      completedAt: work.completedAt?.toISOString() || null,
      createdAt: work.createdAt.toISOString(),
      user: work.user,
    }));

    return NextResponse.json(processedDailyWork);
  } catch (error) {
    console.error("Error fetching daily work:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du travail quotidien" },
      { status: 500 }
    );
  }
}

