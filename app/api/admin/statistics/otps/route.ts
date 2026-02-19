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
    const status = searchParams.get("status"); // "active", "expired", "used", or "unused"

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        where.createdAt.gte = fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    // Filter by used status
    if (status === "used") {
      where.used = true;
    } else if (status === "unused") {
      where.used = false;
    }

    const otps = await prisma.oTP.findMany({
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
        createdAt: "desc",
      },
    });

    // Filter by status (active/expired) and add isExpired flag
    const now = new Date();
    const processedOtps = otps.map((otp: any) => {
      const isExpired = new Date(otp.expiresAt) < now;
      const isActive = !otp.used && !isExpired;
      return {
        id: otp.id,
        userId: otp.userId,
        user: otp.user,
        otp: otp.otp,
        expiresAt: otp.expiresAt.toISOString(),
        createdAt: otp.createdAt.toISOString(),
        used: otp.used,
        usedAt: otp.usedAt?.toISOString() || null,
        isExpired,
        isActive,
      };
    });

    // Apply additional status filter if provided (for active/expired)
    let filteredOtps = processedOtps;
    if (status === "active") {
      filteredOtps = processedOtps.filter((otp) => otp.isActive);
    } else if (status === "expired") {
      filteredOtps = processedOtps.filter((otp) => otp.isExpired && !otp.used);
    }
    // "used" and "unused" are already filtered in the where clause

    return NextResponse.json(filteredOtps);
  } catch (error) {
    console.error("Error fetching OTPs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des OTP" },
      { status: 500 }
    );
  }
}

