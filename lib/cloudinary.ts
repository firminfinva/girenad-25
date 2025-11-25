import { v2 as cloudinary } from "cloudinary";

// Lazy configuration - only configure when needed
let isConfigured = false;

function ensureConfigured() {
  if (!isConfigured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [];
      if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
      if (!apiKey) missing.push("CLOUDINARY_API_KEY");
      if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");

      throw new Error(
        `Cloudinary credentials are missing: ${missing.join(
          ", "
        )}. Please add them to your .env file. See CLOUDINARY_SETUP.md for instructions.`
      );
    }

    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
    });

    isConfigured = true;
  }
}

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
}

/**
 * Upload a file to Cloudinary
 * @param file - File buffer
 * @param folder - Folder path in Cloudinary (optional)
 * @param resourceType - Type of resource: 'image', 'video', or 'raw' (for PDFs)
 * @returns Upload result with URL and metadata
 */
export async function uploadToCloudinary(
  file: Buffer,
  folder: string = "girenad",
  resourceType: "image" | "video" | "raw" = "image"
): Promise<UploadResult> {
  ensureConfigured();
  try {
    // Use buffer stream upload instead of base64 for better performance
    // This is more efficient for larger files and avoids timeout issues
    const uploadOptions: any = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      timeout: 60000, // 60 seconds timeout
    };

    // For images, add optimization options
    if (resourceType === "image") {
      uploadOptions.quality = "auto";
      uploadOptions.fetch_format = "auto";
    }

    // Upload using buffer stream (more efficient than base64)
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(file);
    });

    return {
      url: result.url,
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format || "",
      resource_type: result.resource_type,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    
    // Provide more specific error messages
    if (error?.http_code === 401) {
      throw new Error(
        "Cloudinary authentication failed. Please check your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file."
      );
    } else if (error?.http_code === 499 || error?.name === "TimeoutError") {
      throw new Error(
        "Upload timeout. The file might be too large or the connection is slow. Please try again with a smaller file or check your internet connection."
      );
    } else if (error?.http_code === 400) {
      throw new Error(
        `Invalid file format or size. ${error.message || "Please check the file and try again."}`
      );
    } else if (error?.message) {
      throw new Error(`Cloudinary error: ${error.message}`);
    } else {
      throw new Error("Erreur lors de l'upload vers Cloudinary");
    }
  }
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource: 'image', 'video', or 'raw'
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  ensureConfigured();
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Erreur lors de la suppression depuis Cloudinary");
  }
}

export default cloudinary;
