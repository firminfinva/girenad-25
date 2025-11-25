# Cloudinary Setup Guide

This project uses Cloudinary for storing images, PDFs, and videos.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Cloudinary Credentials

1. Sign up for a free account at [https://cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## File Upload Flow

1. **Frontend**: User selects a file (image, PDF, or video)
2. **Frontend**: File is sent to `/api/upload` endpoint
3. **Backend**: File is uploaded to Cloudinary
4. **Backend**: Returns Cloudinary URL
5. **Frontend**: Uses the Cloudinary URL to create/update records in the database

## Supported File Types

### Images
- JPEG/JPG
- PNG
- GIF
- WebP
- Max size: 10MB

### Videos
- MP4
- WebM
- QuickTime
- AVI
- Max size: 10MB

### PDFs
- PDF
- Max size: 5MB

## API Endpoint

### POST `/api/upload`

Uploads a file to Cloudinary.

**Headers:**
- `Authorization: Bearer <token>` (required, Admin or Moderator only)

**Body (FormData):**
- `file`: The file to upload (required)
- `folder`: Folder path in Cloudinary (optional, default: "girenad")
- `resourceType`: Type of resource - "image", "video", or "raw" (optional, default: "image")

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "girenad/...",
  "format": "jpg",
  "resource_type": "image"
}
```

## Usage Example

```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("folder", "girenad/projects/123");
formData.append("resourceType", "image");

const response = await fetch("/api/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const data = await response.json();
// Use data.url as the image URL
```

