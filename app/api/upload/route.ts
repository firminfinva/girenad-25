import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminOrModerator } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST - Upload a file to Cloudinary
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user || !isAdminOrModerator(user.role)) {
      return NextResponse.json(
        { error: "Non autorisé. Admin ou Modérateur requis." },
        { status: 403 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "girenad";
    const resourceType = (formData.get("resourceType") as
      | "image"
      | "video"
      | "raw") || "image";

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for images/videos, 5MB for PDFs)
    const maxSize =
      resourceType === "raw" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `Le fichier est trop volumineux. Taille maximale: ${
            maxSize / 1024 / 1024
          }MB`,
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const allowedRawTypes = ["application/pdf"];

    let isValidType = false;
    if (resourceType === "image") {
      isValidType = allowedImageTypes.includes(file.type);
    } else if (resourceType === "video") {
      isValidType = allowedVideoTypes.includes(file.type);
    } else if (resourceType === "raw") {
      isValidType = allowedRawTypes.includes(file.type);
    }

    if (!isValidType) {
      return NextResponse.json(
        {
          error: `Type de fichier non autorisé. Type attendu: ${resourceType}`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      buffer,
      folder,
      resourceType
    );

    return NextResponse.json(
      {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload du fichier",
      },
      { status: 500 }
    );
  }
}

