import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthUser {
  userId: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "MODERATOR" | "USER";
}

export async function verifyToken(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    // Get user from database using userId from token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role as "SUPERADMIN" | "ADMIN" | "MODERATOR" | "USER",
    };
  } catch (error) {
    return null;
  }
}

export function isAdminOrModerator(role: string): boolean {
  return role === "SUPERADMIN" || role === "ADMIN" || role === "MODERATOR";
}

export function isAdmin(role: string): boolean {
  return role === "SUPERADMIN" || role === "ADMIN";
}