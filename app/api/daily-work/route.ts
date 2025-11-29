import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get daily work for a user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Check if dailyWork model exists
    if (!prisma.dailyWork) {
      console.error("Prisma dailyWork model not available. Please restart the server.");
      return NextResponse.json(
        { error: "Service temporairement indisponible. Veuillez redémarrer le serveur." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let targetDate: Date;
    if (date) {
      targetDate = new Date(date + "T00:00:00.000Z");
    } else {
      // Default to today
      targetDate = new Date();
      targetDate.setHours(0, 0, 0, 0);
    }
    
    // For @db.Date fields, we need to compare with a date range
    // Create start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    const dailyWork = await prisma.dailyWork.findMany({
      where: {
        userId: user.userId,
        workDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(dailyWork);
  } catch (error) {
    console.error("Error fetching daily work:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du travail quotidien" },
      { status: 500 }
    );
  }
}

// POST - Create new daily work
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Check if dailyWork model exists
    if (!prisma.dailyWork) {
      console.error("Prisma dailyWork model not available. Please restart the server.");
      return NextResponse.json(
        { error: "Service temporairement indisponible. Veuillez redémarrer le serveur." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, description, workDate } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est requis" },
        { status: 400 }
      );
    }

    // Normalize date to UTC start of day for @db.Date field
    const normalizedDate = workDate ? new Date(workDate) : new Date();
    normalizedDate.setUTCHours(0, 0, 0, 0);

    console.log("Creating daily work with:", {
      title,
      description: description || null,
      workDate: normalizedDate.toISOString(),
      userId: user.userId,
    });

    const dailyWork = await prisma.dailyWork.create({
      data: {
        title,
        description: description || null,
        workDate: normalizedDate,
        userId: user.userId,
      },
    });

    console.log("Daily work created successfully:", dailyWork.id);
    return NextResponse.json(dailyWork, { status: 201 });
  } catch (error: any) {
    console.error("Error creating daily work:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    return NextResponse.json(
      { 
        error: "Erreur lors de la création du travail quotidien",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

